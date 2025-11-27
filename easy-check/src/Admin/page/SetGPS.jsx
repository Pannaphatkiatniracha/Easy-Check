import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { MapPin, Settings, Search, Filter, Download, Eye, Edit, Trash2, Plus, Save, X, ChevronLeft, ChevronRight, Calendar, CheckCircle, AlertCircle, MapPinned, Navigation, Locate ,UsersRound} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SetGPS.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function GPSAdminDashboard() {
  const [activeTab, setActiveTab] = useState('check');
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showLocationMapModal, setShowLocationMapModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const mapRef = useRef(null);
  const logMapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const logMapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    radius: 100,
    active: true
  });

  const [locations, setLocations] = useState([
    { id: 1, name: 'สำนักงานใหญ่', address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ', lat: 13.7563, lng: 100.5018, radius: 100, active: true },
    { id: 2, name: 'มหาวิทยาลัยศรีปทุม', address: 'Sripatum University, 2410/2, Phahon Yothin Road, Lat Yao Subdistrict, Chatuchak District, Bangkok, 10900, Thailand', lat: 13.854758, lng: 100.585453, radius: 100, active: true },
  ]);

  // Mock check-in logs - เฉพาะการเช็คอินที่สำเร็จ (ในรัศมี) เท่านั้น
  const [checkInLogs] = useState([
    { id: 1, employee: 'สมชาย ใจดี', employeeId: 'EMP001', position: 'พนักงานช่าง', location: 'สำนักงานใหญ่', time: '08:30:00', date: '30/10/2025', lat: 13.7563, lng: 100.5018 },
    { id: 2, employee: 'สมหญิง รักงาน', employeeId: 'EMP002', position: 'หัวหน้าแผนก', location: 'มหาวิทยาลัยศรีปทุม', time: '08:45:00', date: '30/10/2025', lat: 13.854758, lng: 100.585453 },
    { id: 3, employee: 'วิไล สวยงาม', employeeId: 'EMP004', position: 'พนักงานขาย', location: 'สำนักงานใหญ่', time: '08:20:00', date: '30/10/2025', lat: 13.7563, lng: 100.5018 },
    { id: 4, employee: 'สมศักดิ์ มั่นคง', employeeId: 'EMP005', position: 'ช่างเทคนิค', location: 'มหาวิทยาลัยศรีปทุม', time: '08:50:00', date: '30/10/2025', lat: 13.854758, lng: 100.585453 },
    { id: 5, employee: 'ธนา กล้าหาญ', employeeId: 'EMP007', position: 'หัวหน้าโครงการ', location: 'มหาวิทยาลัยศรีปทุม', time: '08:15:00', date: '30/10/2025', lat: 13.854758, lng: 100.585453 },
    { id: 6, employee: 'มานี ขยันทำ', employeeId: 'EMP008', position: 'พนักงานคลัง', location: 'มหาวิทยาลัยศรีปทุม', time: '08:25:00', date: '29/10/2025', lat: 13.854758, lng: 100.585453 },
    { id: 7, employee: 'สมชาย ใจดี', employeeId: 'EMP001', position: 'พนักงานช่าง', location: 'สำนักงานใหญ่', time: '17:30:00', date: '30/10/2025', lat: 13.7565, lng: 100.5020 },
    { id: 8, employee: 'สมหญิง รักงาน', employeeId: 'EMP002', position: 'หัวหน้าแผนก', location: 'มหาวิทยาลัยศรีปทุม', time: '17:45:00', date: '30/10/2025', lat: 13.854758, lng: 100.585453 },
  ]);

  // Initialize map for check-in log view
  useEffect(() => {
    if (showMapModal && logMapRef.current && !logMapInstanceRef.current && selectedLog) {
      logMapInstanceRef.current = L.map(logMapRef.current).setView([selectedLog.lat, selectedLog.lng], 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(logMapInstanceRef.current);

      // Add marker for employee check-in location
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin marker-success">
                <div class="marker-icon">✓</div>
              </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });

      L.marker([selectedLog.lat, selectedLog.lng], { icon })
        .addTo(logMapInstanceRef.current)
        .bindPopup(`
          <div class="map-popup">
            <strong>${selectedLog.employee}</strong><br/>
            ${selectedLog.location}<br/>
            ${selectedLog.date} ${selectedLog.time}
          </div>
        `).openPopup();

      // Add circle for reference (from location radius)
      L.circle([selectedLog.lat, selectedLog.lng], {
        radius: 100,
        color: '#48bb78',
        fillColor: '#48bb78',
        fillOpacity: 0.1
      }).addTo(logMapInstanceRef.current);
    }

    return () => {
      if (logMapInstanceRef.current) {
        logMapInstanceRef.current.remove();
        logMapInstanceRef.current = null;
      }
    };
  }, [showMapModal, selectedLog]);

  // Initialize map for location modal
  useEffect(() => {
    if (showLocationMapModal && mapRef.current && !mapInstanceRef.current) {
      const defaultLat = formData.lat || 13.7563;
      const defaultLng = formData.lng || 100.5018;
      
      mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', (e) => {
        updateMapLocation(e.latlng.lat, e.latlng.lng);
      });

      if (formData.lat && formData.lng) {
        updateMapLocation(formData.lat, formData.lng);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        circleRef.current = null;
      }
    };
  }, [showLocationMapModal]);

  useEffect(() => {
    if (circleRef.current && formData.radius) {
      circleRef.current.setRadius(parseInt(formData.radius));
    }
  }, [formData.radius]);

  // Search location with debounce
  useEffect(() => {
    if (locationSearchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(locationSearchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [locationSearchTerm]);

  const searchLocation = async (query) => {
    setSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=th`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      showToast('ไม่สามารถค้นหาสถานที่ได้', 'error');
    } finally {
      setSearchingLocation(false);
    }
  };

  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    updateMapLocation(lat, lng);
    setLocationSearchTerm('');
    setSearchResults([]);
    showToast('เลือกตำแหน่งสำเร็จ', 'success');
  };

  const updateMapLocation = (lat, lng) => {
    setFormData(prev => ({ ...prev, lat, lng }));

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true })
        .addTo(mapInstanceRef.current)
        .on('dragend', (e) => {
          const pos = e.target.getLatLng();
          updateMapLocation(pos.lat, pos.lng);
        });
    }

    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
    } else {
      circleRef.current = L.circle([lat, lng], {
        radius: parseInt(formData.radius),
        color: '#667eea',
        fillColor: '#667eea',
        fillOpacity: 0.2
      }).addTo(mapInstanceRef.current);
    }

    mapInstanceRef.current.setView([lat, lng], 15);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.display_name) {
          setFormData(prev => ({ ...prev, address: data.display_name }));
        }
      })
      .catch(err => console.log('Geocoding error:', err));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('เบราว์เซอร์ไม่รองรับ GPS', 'error');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateMapLocation(position.coords.latitude, position.coords.longitude);
        setGettingLocation(false);
        showToast('ใช้ตำแหน่งปัจจุบันสำเร็จ', 'success');
      },
      (error) => {
        setGettingLocation(false);
        showToast('ไม่สามารถใช้ตำแหน่งปัจจุบันได้', 'error');
      }
    );
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'กรุณากรอกชื่อสถานที่';
    if (!formData.address.trim()) errors.address = 'กรุณากรอกที่อยู่';
    if (!formData.lat || isNaN(formData.lat)) errors.lat = 'กรุณาเลือกตำแหน่งบนแผนที่';
    if (!formData.lng || isNaN(formData.lng)) errors.lng = 'กรุณาเลือกตำแหน่งบนแผนที่';
    if (!formData.radius || formData.radius < 10) errors.radius = 'รัศมีต้องมากกว่า 10 เมตร';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredLogs = useMemo(() => {
    let result = [...checkInLogs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.employee.toLowerCase().includes(term) ||
        log.employeeId.toLowerCase().includes(term) ||
        log.position.toLowerCase().includes(term) ||
        log.location.toLowerCase().includes(term)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(log => log.status === filters.status);
    }

    if (filters.dateFrom) {
      result = result.filter(log => {
        const logDate = log.date.split('/').reverse().join('-');
        return logDate >= filters.dateFrom;
      });
    }

    if (filters.dateTo) {
      result = result.filter(log => {
        const logDate = log.date.split('/').reverse().join('-');
        return logDate <= filters.dateTo;
      });
    }

    return result;
  }, [checkInLogs, searchTerm, filters]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleExport = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const headers = ['พนักงาน', 'รหัสพนักงาน', 'ตำแหน่ง', 'สถานที่', 'วันที่', 'เวลา', 'GPS', 'สถานะ'];
      const csvContent = [
        headers.join(','),
        ...filteredLogs.map(log => [
          log.employee,
          log.employeeId,
          log.position,
          log.location,
          log.date,
          log.time,
          `"${log.lat}, ${log.lng}"`,
          log.status === 'success' ? 'นอกพื้นที่' : ' เช็คอินสำเร็จ'
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `check-in-logs-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      setLoading(false);
      showToast('ส่งออกข้อมูลสำเร็จ', 'success');
    }, 1000);
  }, [filteredLogs, showToast]);

  const openModal = (type, location = null) => {
    setModalType(type);
    if (location) {
      setSelectedLocation(location);
      setFormData({
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        radius: location.radius,
        active: location.active
      });
    } else {
      setFormData({
        name: '',
        address: '',
        lat: '',
        lng: '',
        radius: 100,
        active: true
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowLocationMapModal(false);
    setShowMapModal(false);
    setSelectedLocation(null);
    setSelectedLog(null);
    setFormErrors({});
    setLocationSearchTerm('');
    setSearchResults([]);
  };

  const openLocationMapModal = () => {
    setShowLocationMapModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveLocation = () => {
    if (!validateForm()) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (modalType === 'add') {
        const newLocation = {
          id: Math.max(...locations.map(l => l.id), 0) + 1,
          ...formData,
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
          radius: parseInt(formData.radius)
        };
        setLocations([...locations, newLocation]);
        showToast('เพิ่มสถานที่สำเร็จ', 'success');
      } else {
        setLocations(locations.map(loc => 
          loc.id === selectedLocation.id 
            ? { ...loc, ...formData, lat: parseFloat(formData.lat), lng: parseFloat(formData.lng), radius: parseInt(formData.radius) }
            : loc
        ));
        showToast('แก้ไขสถานที่สำเร็จ', 'success');
      }
      setLoading(false);
      closeModal();
    }, 500);
  };

  const handleDeleteLocation = (id) => {
    if (confirm('คุณต้องการลบสถานที่นี้หรือไม่?')) {
      setLoading(true);
      setTimeout(() => {
        setLocations(locations.filter(loc => loc.id !== id));
        setLoading(false);
        showToast('ลบสถานที่สำเร็จ', 'success');
      }, 500);
    }
  };

  const openMapModal = (log) => {
    setSelectedLog(log);
    setShowMapModal(true);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    showToast('ใช้ตัวกรองสำเร็จ', 'success');
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      location: 'all',
      dateFrom: '',
      dateTo: '',
    });
    showToast('ล้างตัวกรองสำเร็จ', 'success');
  };

  const uniqueLocations = useMemo(() => {
    return [...new Set(checkInLogs.map(log => log.location))];
  }, [checkInLogs]);

  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      today: filteredLogs.filter(l => l.date === '30/10/2025').length,
      thisMonth: filteredLogs.length,
    };
  }, [filteredLogs]);

  return (
    <div className="app-con">
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="main-wrapper">
        <div className="header-card">
          <div className="header-content">
            <div>
              <h1 className="header-title">ระบบจัดการ GPS </h1>
              
            </div>
            <div className="head-icon">
              <MapPin size={40} color="white" />
            </div>
          </div>
        </div>

        <div className="tab-container">
          <button
            onClick={() => setActiveTab('check')}
            className={`tab-button ${activeTab === 'check' ? 'tab-active' : ''}`}
          >
            <Eye size={20} />
            ตรวจสอบ GPS
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`tab-button ${activeTab === 'settings' ? 'tab-active' : ''}`}
          >
            <Settings size={20} />
            ตั้งค่า GPS
          </button>
        </div>

        {activeTab === 'check' ? (
          <div>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon stat-primary">
                  <UsersRound size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">ทั้งหมด</p>
                  <p className="stat-value">{stats.total}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-success">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">วันนี้</p>
                  <p className="stat-value">{stats.today}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-info">
                  <Calendar size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">เดือนนี้</p>
                  <p className="stat-value">{stats.thisMonth}</p>
                </div>
              </div>
            </div>

            <div className="search-container">
              <div className="search-bar">
                <div className="search-input-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="ค้นหาพนักงาน, รหัส, ตำแหน่ง, สถานที่..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button 
                  className="filter-button"
                  onClick={() => setShowFilterModal(true)}
                >
                  <Filter size={18} />
                  ตัวกรอง
                  {(filters.status !== 'all' || filters.location !== 'all' || filters.dateFrom || filters.dateTo) && (
                    <span className="filter-badge">•</span>
                  )}
                </button>
                <button 
                  className="export-button"
                  onClick={handleExport}
                  disabled={filteredLogs.length === 0}
                >
                  <Download size={18} />
                  Export ({filteredLogs.length})
                </button>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header-section">
                <h2 className="table-title">บันทึกการลงเวลา</h2>
                <p className="table-subtitle">แสดง {paginatedLogs.length} จาก {filteredLogs.length} รายการ</p>
              </div>
              
              {filteredLogs.length === 0 ? (
                <div className="empty-state">
                  <Search size={48} color="#cbd5e0" />
                  <p>ไม่พบข้อมูลที่ค้นหา</p>
                </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr className="table-header-row">
                          <th className="table-header">พนักงาน</th>
                          <th className="table-header">รหัส</th>
                          <th className="table-header">ตำแหน่ง</th>
                          <th className="table-header">สถานที่</th>
                          <th className="table-header">วันที่</th>
                          <th className="table-header">เวลา</th>
                          <th className="table-header">GPS</th>
                          <th className="table-header-center">ดูแผนที่</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLogs.map((log) => (
                          <tr key={log.id} className="table-row">
                            <td className="table-cell-bold">{log.employee}</td>
                            <td className="table-cell">{log.employeeId}</td>
                            <td className="table-cell">{log.position}</td>
                            <td className="table-cell-bold">{log.location}</td>
                            <td className="table-cell">{log.date}</td>
                            <td className="table-cell">{log.time}</td>
                            <td className="table-cell-small">{log.lat.toFixed(4)}, {log.lng.toFixed(4)}</td>
                            <td className="table-cell-center">
                              <button 
                                className="view-map-button"
                                onClick={() => openMapModal(log)}
                              >
                                <MapPinned size={14} />
                                ดูแผนที่
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div className="pagination-info">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="add-button-container">
              <button onClick={() => openModal('add')} className="add-location-button">
                <Plus size={20} />
                เพิ่มสถานที่
              </button>
            </div>

            <div className="locations-grid">
              {locations.map((location) => (
                <div key={location.id} className="location-card">
                  <div className="location-header">
                    <div className="location-info">
                      <div className="location-icon">
                        <MapPin size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="location-name">{location.name}</h3>
                        <span className={`location-status ${location.active ? 'location-active' : 'location-inactive'}`}>
                          {location.active ? '● เปิดใช้งาน' : '● ปิดใช้งาน'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="location-details">
                    <p className="location-detail-item">
                      <strong>ที่อยู่:</strong> {location.address}
                    </p>
                    <p className="location-detail-item">
                      <strong>GPS:</strong> {location.lat}, {location.lng}
                    </p>
                    <p className="location-detail-item">
                      <strong>รัศมี:</strong> {location.radius} เมตร
                    </p>
                  </div>

                  <div className="location-actions">
                    <button onClick={() => openModal('edit', location)} className="edit-button">
                      <Edit size={16} />
                      แก้ไข
                    </button>
                    <button onClick={() => handleDeleteLocation(location.id)} className="delete-button">
                      <Trash2 size={16} />
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location Form Modal */}
      {showModal && !showLocationMapModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === 'add' ? 'เพิ่มสถานที่ใหม่' : 'แก้ไขสถานที่'}
              </h2>
              <button onClick={closeModal} className="modal-close-button">
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">ชื่อสถานที่ <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${formErrors.name ? 'error' : ''}`}
                placeholder="เช่น สำนักงานใหญ่"
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>

            <div className="map-selection-container">
              <button 
                type="button"
                onClick={openLocationMapModal}
                className="map-selection-button"
              >
                <MapPinned size={20} />
                <div className="map-selection-text">
                  <strong>เลือกตำแหน่งจากแผนที่</strong>
                  <small>คลิกเพื่อเปิดแผนที่และเลือกตำแหน่ง (มีฟีเจอร์ค้นหาสถานที่)</small>
                </div>
                <Navigation size={20} />
              </button>
              
              {(formData.lat && formData.lng) && (
                <div className="selected-location-info">
                  <MapPin size={16} color="#48bb78" />
                  <span>ตำแหน่ง: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lng).toFixed(4)}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">ที่อยู่ <span className="required">*</span></label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`form-input form-textarea ${formErrors.address ? 'error' : ''}`}
                placeholder="ที่อยู่จะถูกกรอกอัตโนมัติเมื่อเลือกจากแผนที่"
                rows="3"
              />
              {formErrors.address && <span className="error-text">{formErrors.address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                รัศมี: {formData.radius} เมตร <span className="required">*</span>
              </label>
              <input
                type="range"
                name="radius"
                min="10"
                max="500"
                step="10"
                value={formData.radius}
                onChange={handleInputChange}
                className="radius-slider-SetGPS"
              />
              <div className="radius-marks">
                <span>10m</span>
                <span>100m</span>
                <span>250m</span>
                <span>500m</span>
              </div>
              {formErrors.radius && <span className="error-text">{formErrors.radius}</span>}
              <small className="form-hint">
                💡 100-150m สำหรับอาคารสำนักงาน | 200-300m สำหรับโรงงาน<br/>
                ⚠️ <strong>หมายเหตุ:</strong> พนักงานจะสามารถเช็คอินได้เฉพาะเมื่ออยู่ภายในรัศมีที่กำหนดเท่านั้น
              </small>
            </div>

            <div className="form-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span>เปิดใช้งานสถานที่นี้</span>
              </label>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-button">
                ยกเลิก
              </button>
              <button onClick={handleSaveLocation} className="save-button">
                <Save size={18} />
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Map Modal with Search */}
      {showLocationMapModal && (
        <div className="modal-overlay" onClick={() => setShowLocationMapModal(false)}>
          <div className="modal-content modal-map" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">เลือกตำแหน่งบนแผนที่</h2>
              <button onClick={() => setShowLocationMapModal(false)} className="modal-close-button">
                <X size={20} />
              </button>
            </div>

            {/* Search Location */}
            <div className="location-search-container">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหาสถานที่ เช่น สยามพารากอน, ถนนสุขุมวิท, กรุงเทพ..."
                  value={locationSearchTerm}
                  onChange={(e) => setLocationSearchTerm(e.target.value)}
                  className="search-input"
                />
                {locationSearchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => {
                      setLocationSearchTerm('');
                      setSearchResults([]);
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {searchingLocation && (
                <div className="search-loading">
                  <div className="small-spinner"></div>
                  <span>กำลังค้นหา...</span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="search-result-item"
                      onClick={() => selectSearchResult(result)}
                    >
                      <MapPin size={16} color="#667eea" />
                      <div className="result-text">
                        <strong>{result.display_name.split(',')[0]}</strong>
                        <small>{result.display_name}</small>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="map-instructions">
              <div className="instruction-item">
                <MapPin size={18} color="#667eea" />
                <span>คลิกบนแผนที่เพื่อเลือกตำแหน่ง</span>
              </div>
              <div className="instruction-item">
                <Navigation size={18} color="#667eea" />
                <span>ลาก Marker เพื่อปรับตำแหน่ง</span>
              </div>
              <button 
                onClick={getCurrentLocation}
                className="current-location-button"
                disabled={gettingLocation}
              >
                <Locate size={18} />
                {gettingLocation ? 'กำลังค้นหา...' : 'ใช้ตำแหน่งปัจจุบัน'}
              </button>
            </div>

            <div ref={mapRef} className="leaflet-map"></div>

            <div className="map-info-bar">
              {formData.lat && formData.lng ? (
                <>
                  <div className="map-info-item">
                    <strong>พิกัด:</strong>
                    <span>{parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}</span>
                  </div>
                  <div className="map-info-item">
                    <strong>รัศมี:</strong>
                    <span className="radius-badge">{formData.radius}m</span>
                  </div>
                </>
              ) : (
                <p className="map-help-text">👆 คลิกบนแผนที่หรือค้นหาสถานที่</p>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowLocationMapModal(false)} className="save-button" style={{ width: '100%' }}>
                <CheckCircle size={18} />
                ยืนยันตำแหน่งนี้
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">ตัวกรองข้อมูล</h2>
              <button onClick={() => setShowFilterModal(false)} className="modal-close-button">
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">สถานะ</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="form-input"
              >
                <option value="all">ทั้งหมด</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">สถานที่</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="form-input"
              >
                <option value="all">ทั้งหมด</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '5px' }} />
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '5px' }} />
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="modal-actions">
              <button onClick={clearFilters} className="cancel-button">
                ล้างตัวกรอง
              </button>
              <button onClick={applyFilters} className="save-button">
                <Filter size={18} />
                ใช้ตัวกรอง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-in Log Map Modal */}
      {showMapModal && selectedLog && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <MapPin size={24} style={{ display: 'inline', marginRight: '8px' }} />
                ตำแหน่ง GPS - {selectedLog.employee}
              </h2>
              <button onClick={closeModal} className="modal-close-button">
                <X size={20} />
              </button>
            </div>

            <div className="map-info">
              <div className="map-info-item">
                <strong>พนักงาน:</strong> {selectedLog.employee} ({selectedLog.employeeId})
              </div>
              <div className="map-info-item">
                <strong>ตำแหน่ง:</strong> {selectedLog.position}
              </div>
              <div className="map-info-item">
                <strong>สถานที่:</strong> {selectedLog.location}
              </div>
              <div className="map-info-item">
                <strong>วันที่/เวลา:</strong> {selectedLog.date} {selectedLog.time}
              </div>
              <div className="map-info-item">
                <strong>พิกัด GPS:</strong> {selectedLog.lat.toFixed(6)}, {selectedLog.lng.toFixed(6)}
              </div>
              <div className="map-info-item">
                <strong>หมายเหตุ:</strong>
                <span className="status-badge status-success" style={{ marginLeft: '8px' }}>
                  ✓ เช็คอินสำเร็จ
                </span>
              </div>
            </div>

            <div ref={logMapRef} className="leaflet-map" style={{ height: '450px' }}></div>

           
          </div>
        </div>
      )}
    </div>
  );
}