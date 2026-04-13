import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { MapPin, Settings, Search, Filter, Download, Eye, Edit, Trash2, Plus, Save, X, ChevronLeft, ChevronRight, Calendar, CheckCircle, AlertCircle, MapPinned, Navigation, Locate, UsersRound, Power } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// แก้ปัญหา Leaflet default marker icon ที่หายไปเมื่อ build ด้วย Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function GPSAdminDashboard() {
  // ----- state ควบคุม UI -----
  const [activeTab, setActiveTab] = useState('check');        // แท็บที่แสดงอยู่: 'check' หรือ 'settings'
  const [showModal, setShowModal] = useState(false);          // modal เพิ่ม/แก้ไขสถานที่
  const [showFilterModal, setShowFilterModal] = useState(false);      // modal ตัวกรอง
  const [showMapModal, setShowMapModal] = useState(false);            // modal แผนที่ดู check-in log
  const [showLocationMapModal, setShowLocationMapModal] = useState(false); // modal แผนที่เลือกพิกัด
  const [modalType, setModalType] = useState('');             // 'add' หรือ 'edit'
  const [searchTerm, setSearchTerm] = useState('');           // คำค้นหาในตาราง log
  const [locationSearchTerm, setLocationSearchTerm] = useState('');   // คำค้นหาในแผนที่ Nominatim
  const [searchResults, setSearchResults] = useState([]);     // ผลลัพธ์จาก Nominatim API
  const [searchingLocation, setSearchingLocation] = useState(false);  // กำลังค้นหาอยู่ไหม
  const [selectedLocation, setSelectedLocation] = useState(null);     // location ที่เลือก (สำหรับ edit/delete)
  const [selectedLog, setSelectedLog] = useState(null);       // log ที่เลือกดูแผนที่
  const [loading, setLoading] = useState(false);              // loading ทั่วไป (save/delete)
  const [toast, setToast] = useState({ show: false, message: '', type: '' }); // toast notification
  const [gettingLocation, setGettingLocation] = useState(false); // กำลังดึง GPS ปัจจุบันไหม

  // ----- state ข้อมูลหลัก -----
  // locations: ดึงจาก API GET /gps-locations (แทน mock data เดิม)
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true); // โหลด locations ครั้งแรก

  // checkInLogs: ยังเป็น mock เพราะ attendance API ยังไม่เสร็จ (รอเพื่อนในทีม)
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

  // ----- Refs สำหรับ Leaflet maps -----
  const mapRef = useRef(null);           // DOM element สำหรับแผนที่เลือกพิกัด
  const logMapRef = useRef(null);        // DOM element สำหรับแผนที่ดู log
  const mapInstanceRef = useRef(null);   // Leaflet map instance (เลือกพิกัด)
  const logMapInstanceRef = useRef(null); // Leaflet map instance (ดู log)
  const markerRef = useRef(null);        // marker บนแผนที่เลือกพิกัด
  const circleRef = useRef(null);        // วงกลมรัศมีบนแผนที่
  const searchTimeoutRef = useRef(null); // debounce timer สำหรับ Nominatim search

  // ----- state สำหรับ pagination -----
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ----- state ตัวกรอง log -----
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // ----- state form errors -----
  const [formErrors, setFormErrors] = useState({});

  // ----- state ข้อมูลใน form เพิ่ม/แก้ไขสถานที่ -----
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    radius: 100,
    branch_id: '',  // เพิ่ม branch_id สำหรับผูกสถานที่กับสาขา
    active: true
  });

  // ดึง JWT token และข้อมูล admin จาก localStorage
  const token = localStorage.getItem('token');
  // ดึง branch_id ของ admin ที่ login อยู่ เพื่อกรอง GPS เฉพาะสาขาของตัวเอง
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const adminBranchId = user?.branch_id;

  // ==========================================================
  // API CALLS — ดึงและจัดการข้อมูลจาก backend
  // ==========================================================

  // ดึง GPS locations เฉพาะสาขาของ admin ที่ login อยู่
  const fetchLocations = useCallback(async () => {
    try {
      // ส่ง branch_id ของ admin ไปกรองให้เห็นเฉพาะสาขาตัวเอง
      const res = await fetch(`http://localhost:5000/gps-locations?branch_id=${adminBranchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('โหลดข้อมูลสถานที่ไม่สำเร็จ');
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      showToast('ไม่สามารถโหลดสถานที่ได้: ' + err.message, 'error');
    } finally {
      setLoadingLocations(false);
    }
  }, [token, adminBranchId]);

  // โหลดข้อมูลเมื่อ component mount ครั้งแรก
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // ==========================================================
  // MAP EFFECTS — สร้าง/ทำลาย Leaflet map instances
  // ==========================================================

  // สร้างแผนที่สำหรับดู check-in log ของพนักงาน
  useEffect(() => {
    if (showMapModal && logMapRef.current && !logMapInstanceRef.current && selectedLog) {
      // สร้าง map instance โดยใช้พิกัดของ log ที่เลือก
      logMapInstanceRef.current = L.map(logMapRef.current).setView([selectedLog.lat, selectedLog.lng], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(logMapInstanceRef.current);

      // สร้าง custom icon สีเขียวแสดงตำแหน่ง check-in
      const icon = L.divIcon({
        className: 'bg-transparent border-none',
        html: `<div class="text-emerald-500 drop-shadow-md">
                <svg width="32" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3" fill="white"></circle>
                  <path d="M9 10l2 2 4-4" stroke="white" stroke-width="2" fill="none"></path>
                </svg>
              </div>`,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
      });

      // วาง marker พร้อม popup แสดงข้อมูลพนักงาน
      L.marker([selectedLog.lat, selectedLog.lng], { icon })
        .addTo(logMapInstanceRef.current)
        .bindPopup(`
          <div class="p-1 min-w-[150px] font-sans">
            <strong class="text-gray-800 text-base block mb-1">${selectedLog.employee}</strong>
            <span class="text-gray-600 text-sm flex items-center gap-1 mb-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${selectedLog.location}</span>
            <span class="text-indigo-600 text-sm font-bold flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${selectedLog.date} ${selectedLog.time}</span>
          </div>
        `).openPopup();

      // วาดวงกลมแสดงรัศมีอ้างอิง
      L.circle([selectedLog.lat, selectedLog.lng], {
        radius: 100,
        color: '#48bb78',
        fillColor: '#48bb78',
        fillOpacity: 0.1
      }).addTo(logMapInstanceRef.current);
    }

    // cleanup: ทำลาย map instance เมื่อปิด modal
    return () => {
      if (logMapInstanceRef.current) {
        logMapInstanceRef.current.remove();
        logMapInstanceRef.current = null;
      }
    };
  }, [showMapModal, selectedLog]);

  // สร้างแผนที่สำหรับเลือกพิกัดใน form เพิ่ม/แก้ไขสถานที่
  useEffect(() => {
    if (showLocationMapModal && mapRef.current && !mapInstanceRef.current) {
      // ถ้ามีพิกัดอยู่แล้ว (กรณีแก้ไข) ให้แสดงพิกัดนั้น ไม่งั้นใช้กรุงเทพเป็น default
      const defaultLat = formData.lat || 13.7563;
      const defaultLng = formData.lng || 100.5018;

      mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // คลิกบนแผนที่ → อัปเดตพิกัดใน formData
      mapInstanceRef.current.on('click', (e) => {
        updateMapLocation(e.latlng.lat, e.latlng.lng);
      });

      // ถ้ากำลังแก้ไข → แสดง marker ที่พิกัดเดิม
      if (formData.lat && formData.lng) {
        updateMapLocation(formData.lat, formData.lng);
      }
    }

    // cleanup: ทำลาย map instance และ refs เมื่อปิด modal
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        circleRef.current = null;
      }
    };
  }, [showLocationMapModal]);

  // อัปเดตขนาดวงกลมรัศมีเมื่อ slider เปลี่ยน
  useEffect(() => {
    if (circleRef.current && formData.radius) {
      circleRef.current.setRadius(parseInt(formData.radius));
    }
  }, [formData.radius]);

  // ==========================================================
  // NOMINATIM SEARCH — ค้นหาสถานที่ด้วย debounce 500ms
  // ==========================================================
  useEffect(() => {
    // รอให้พิมพ์อย่างน้อย 3 ตัวอักษรก่อนค้นหา
    if (locationSearchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    // ล้าง timer เดิมก่อนตั้งใหม่ (debounce)
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

  // เรียก Nominatim API เพื่อค้นหาสถานที่ในประเทศไทย
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

  // เมื่อเลือกผลลัพธ์จาก Nominatim → ย้าย marker ไปพิกัดนั้น
  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    updateMapLocation(lat, lng);
    setLocationSearchTerm('');
    setSearchResults([]);
    showToast('เลือกตำแหน่งสำเร็จ', 'success');
  };

  // อัปเดตพิกัดใน formData + ย้าย marker + วาดวงกลม + reverse geocode
  const updateMapLocation = (lat, lng) => {
    setFormData(prev => ({ ...prev, lat, lng }));

    // ย้าย marker ที่มีอยู่ หรือสร้างใหม่ถ้ายังไม่มี
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true })
        .addTo(mapInstanceRef.current)
        .on('dragend', (e) => {
          // ลาก marker → อัปเดตพิกัดใหม่
          const pos = e.target.getLatLng();
          updateMapLocation(pos.lat, pos.lng);
        });
    }

    // ย้ายวงกลมรัศมี หรือสร้างใหม่
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

    // zoom แผนที่ไปยังพิกัดที่เลือก
    mapInstanceRef.current.setView([lat, lng], 15);

    // Reverse geocode เพื่อดึงที่อยู่แบบข้อความมากรอก field address อัตโนมัติ
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.display_name) {
          setFormData(prev => ({ ...prev, address: data.display_name }));
        }
      })
      .catch(err => console.log('Geocoding error:', err));
  };

  // ใช้ตำแหน่ง GPS ปัจจุบันของผู้ใช้
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
      () => {
        setGettingLocation(false);
        showToast('ไม่สามารถใช้ตำแหน่งปัจจุบันได้', 'error');
      }
    );
  };

  // ==========================================================
  // UI HELPERS
  // ==========================================================

  // แสดง toast notification แล้วซ่อนหลัง 3 วินาที
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }, []);

  // ตรวจสอบความถูกต้องของ form ก่อน save
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'กรุณากรอกชื่อสถานที่';
    if (!formData.address.trim()) errors.address = 'กรุณากรอกที่อยู่';
    if (!formData.lat || isNaN(formData.lat)) errors.lat = 'กรุณาเลือกตำแหน่งบนแผนที่';
    if (!formData.lng || isNaN(formData.lng)) errors.lng = 'กรุณาเลือกตำแหน่งบนแผนที่';
    if (!formData.radius || formData.radius < 10) errors.radius = 'รัศมีต้องมากกว่า 10 เมตร';
    // branch_id ไม่ต้อง validate เพราะ set อัตโนมัติจาก adminBranchId

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==========================================================
  // LOCATION CRUD HANDLERS
  // ==========================================================

  // บันทึกสถานที่: POST (เพิ่ม) หรือ PUT (แก้ไข) ไปที่ backend
  const handleSaveLocation = async () => {
    if (!validateForm()) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    setLoading(true);
    try {
      // สร้าง body ที่จะส่งไป backend
      const body = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        radius: parseInt(formData.radius),
        // ใช้ adminBranchId โดยตรง ไม่ต้องให้ admin เลือกเอง
        branch_id: parseInt(adminBranchId)
      };

      if (modalType === 'add') {
        // POST /gps-locations → เพิ่มสถานที่ใหม่
        const res = await fetch('http://localhost:5000/gps-locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.message || 'เพิ่มสถานที่ไม่สำเร็จ');
        }
        showToast('เพิ่มสถานที่สำเร็จ', 'success');
      } else {
        // PUT /gps-locations/:id → แก้ไขสถานที่ที่มีอยู่
        const res = await fetch(`http://localhost:5000/gps-locations/${selectedLocation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.message || 'แก้ไขสถานที่ไม่สำเร็จ');
        }
        showToast('แก้ไขสถานที่สำเร็จ', 'success');
      }

      // โหลดข้อมูลใหม่จาก DB เพื่อให้ list อัปเดต
      await fetchLocations();
      closeModal();
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ลบสถานที่: DELETE /gps-locations/:id
  const handleDeleteLocation = async (id) => {
    if (!confirm('คุณต้องการลบสถานที่นี้หรือไม่?')) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/gps-locations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'ลบไม่สำเร็จ');
      }
      showToast('ลบสถานที่สำเร็จ', 'success');
      // โหลด locations ใหม่หลังลบ
      await fetchLocations();
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
    } finally {
      setLoading(false);
    }
  };

  // เปิด/ปิดสถานที่: PATCH /gps-locations/:id/toggle
  const handleToggleLocation = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/gps-locations/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'เปลี่ยนสถานะไม่สำเร็จ');
      }
      const data = await res.json();
      showToast(data.message, 'success');

      // อัปเดต state เฉพาะ location ที่เปลี่ยน ไม่ต้อง fetch ทั้งหมดใหม่
      setLocations(prev =>
        prev.map(loc => loc.id === id ? { ...loc, active: data.active } : loc)
      );
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  // ==========================================================
  // MODAL HANDLERS
  // ==========================================================

  // เปิด modal เพิ่ม หรือ แก้ไขสถานที่
  const openModal = (type, location = null) => {
    setModalType(type);
    if (location) {
      // กรณีแก้ไข: กรอกข้อมูลเดิมลงใน form
      setSelectedLocation(location);
      setFormData({
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        radius: location.radius,
        branch_id: adminBranchId, // ใช้ branch ของ admin เสมอ
        active: location.active
      });
    } else {
      // กรณีเพิ่มใหม่: เคลียร์ form และ set branch_id อัตโนมัติ
      setFormData({
        name: '',
        address: '',
        lat: '',
        lng: '',
        radius: 100,
        branch_id: adminBranchId, // ใช้ branch ของ admin เสมอ
        active: true
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  // ปิด modal ทุกประเภทและ reset state
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

  // อัปเดต formData เมื่อ input เปลี่ยน (รองรับทั้ง text, number, checkbox)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // ล้าง error ของ field นั้นทันทีที่แก้ไข
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // เปิด modal แผนที่สำหรับดู location ของ log
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

  // ==========================================================
  // COMPUTED / MEMOIZED VALUES
  // ==========================================================

  // รายชื่อ location ที่ไม่ซ้ำสำหรับ dropdown ในตัวกรอง
  const uniqueLocations = useMemo(() => {
    return [...new Set(checkInLogs.map(log => log.location))];
  }, [checkInLogs]);

  // กรอง checkInLogs ตาม searchTerm และ filters
  // ต้องประกาศก่อน stats เพราะ stats ใช้ filteredLogs
  const filteredLogs = useMemo(() => {
    let result = [...checkInLogs];

    // กรองด้วยคำค้นหา (ชื่อ, รหัส, ตำแหน่ง, สถานที่)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log =>
        log.employee.toLowerCase().includes(term) ||
        log.employeeId.toLowerCase().includes(term) ||
        log.position.toLowerCase().includes(term) ||
        log.location.toLowerCase().includes(term)
      );
    }

    // กรองด้วยสถานะ
    if (filters.status !== 'all') {
      result = result.filter(log => log.status === filters.status);
    }

    // กรองด้วยวันที่เริ่มต้น (format dd/MM/yyyy → yyyy-MM-dd เพื่อเปรียบเทียบ)
    if (filters.dateFrom) {
      result = result.filter(log => {
        const logDate = log.date.split('/').reverse().join('-');
        return logDate >= filters.dateFrom;
      });
    }

    // กรองด้วยวันที่สิ้นสุด
    if (filters.dateTo) {
      result = result.filter(log => {
        const logDate = log.date.split('/').reverse().join('-');
        return logDate <= filters.dateTo;
      });
    }

    return result;
  }, [checkInLogs, searchTerm, filters]);

  // สถิติสรุป: จำนวน log ทั้งหมด, วันนี้, เดือนนี้ (ประกาศหลัง filteredLogs)
  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      today: filteredLogs.filter(l => l.date === '30/10/2025').length,
      thisMonth: filteredLogs.length,
    };
  }, [filteredLogs]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // ตัดข้อมูลสำหรับ pagination
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  // reset หน้ากลับไป 1 เมื่อ filter เปลี่ยน
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Export log เป็น CSV
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

      // ใส่ BOM (0xFEFF) เพื่อให้ Excel อ่านภาษาไทยได้ถูกต้อง
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `check-in-logs-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      setLoading(false);
      showToast('ส่งออกข้อมูลสำเร็จ', 'success');
    }, 1000);
  }, [filteredLogs, showToast]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full flex-1 box-border overflow-x-hidden bg-slate-50 p-4 sm:p-6 md:p-8 font-sans text-gray-800 min-h-screen">

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl font-bold transition-all duration-300 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <span className="text-indigo-600 font-bold">กำลังประมวลผล...</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 md:p-10 mb-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold m-0 tracking-tight flex items-center gap-3">ระบบจัดการ GPS</h1>
            <p className="text-indigo-100 mt-2 font-medium text-sm sm:text-base">จัดการสถานที่และตรวจสอบการลงเวลาของพนักงาน</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner relative z-10 flex-shrink-0">
            <MapPin size={32} className="text-white" />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 sm:gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('check')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 border-none cursor-pointer whitespace-nowrap ${activeTab === 'check' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <Eye size={20} />
            ตรวจสอบ GPS
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 border-none cursor-pointer whitespace-nowrap ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <Settings size={20} />
            ตั้งค่าสถานที่
          </button>
        </div>

        {/* ===== TAB: ตรวจสอบ GPS (check-in logs) ===== */}
        {activeTab === 'check' ? (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="p-4 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0">
                  <UsersRound size={24} />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium m-0 mb-1 text-sm">ทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-800 m-0">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="p-4 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium m-0 mb-1 text-sm">วันนี้</p>
                  <p className="text-2xl font-bold text-gray-800 m-0">{stats.today}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="p-4 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                  <Calendar size={24} />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium m-0 mb-1 text-sm">เดือนนี้</p>
                  <p className="text-2xl font-bold text-gray-800 m-0">{stats.thisMonth}</p>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาพนักงาน, รหัส, ตำแหน่ง, สถานที่..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium text-gray-700 transition-all"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors border-none cursor-pointer"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-3.5 bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl font-bold transition-all cursor-pointer relative"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Filter size={18} />
                    ตัวกรอง
                    {(filters.status !== 'all' || filters.location !== 'all' || filters.dateFrom || filters.dateTo) && (
                      <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>
                  <button
                    className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white border-none hover:bg-indigo-700 rounded-xl font-bold transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleExport}
                    disabled={filteredLogs.length === 0}
                  >
                    <Download size={18} />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Check-in Log Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800 m-0">บันทึกการลงเวลา</h2>
                <p className="text-sm font-medium text-gray-500 m-0">แสดง {paginatedLogs.length} จาก {filteredLogs.length} รายการ</p>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 m-0 mb-2">ไม่พบข้อมูลที่ค้นหา</h3>
                  <p className="text-gray-500 text-sm m-0">ลองเปลี่ยนคำค้นหา หรือปรับตัวกรองใหม่</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">พนักงาน</th>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">รหัส</th>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">ตำแหน่ง</th>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">สถานที่</th>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">วันที่</th>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">เวลา</th>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">GPS</th>
                          <th className="bg-gray-50/80 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-center">ดูแผนที่</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-gray-800 border-b border-gray-50 align-middle">{log.employee}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600 border-b border-gray-50 align-middle">{log.employeeId}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600 border-b border-gray-50 align-middle">{log.position}</td>
                            <td className="px-6 py-4 text-sm font-bold text-indigo-600 border-b border-gray-50 align-middle bg-indigo-50/20">{log.location}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600 border-b border-gray-50 align-middle">{log.date}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-800 border-b border-gray-50 align-middle">{log.time}</td>
                            <td className="px-6 py-4 text-xs font-mono text-gray-500 border-b border-gray-50 align-middle">{log.lat.toFixed(4)},<br />{log.lng.toFixed(4)}</td>
                            <td className="px-6 py-4 border-b border-gray-50 align-middle text-center">
                              <button
                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-colors border-none cursor-pointer mx-auto"
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-100">
                      <button
                        className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border cursor-pointer transition-colors ${currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
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
          /* ===== TAB: ตั้งค่าสถานที่ ===== */
          <div>
            {loadingLocations ? (
              /* กำลังโหลด */
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : locations.length === 0 ? (
              /* ยังไม่มีจุดเช็คอินสำหรับสาขานี้ */
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center gap-6">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
                  <MapPin size={40} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">ยังไม่มีจุดเช็คอินสำหรับสาขานี้</h3>
                  <p className="text-gray-500 text-sm">กรุณาตั้งค่าพิกัดสำหรับให้พนักงานในสาขาของคุณเช็คอิน</p>
                </div>
                <button
                  onClick={() => openModal('add')}
                  className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg border-none cursor-pointer"
                >
                  <Plus size={20} />
                  ตั้งค่าจุดเช็คอิน
                </button>
              </div>
            ) : (
              /* มี location อยู่แล้ว: แสดง single card */
              (() => {
                const loc = locations[0];
                return (
                  <div className="max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <MapPin size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold m-0">{loc.name}</h3>
                              <p className="text-indigo-100 text-sm mt-1 m-0">{loc.branch_name}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${loc.active ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40' : 'bg-gray-500/30 text-gray-100 border border-gray-400/40'}`}>
                            {loc.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex flex-col gap-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                          <Navigation size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-1">ที่อยู่</p>
                            <p className="text-sm text-gray-700 m-0 leading-relaxed">{loc.address || '-'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-indigo-50 rounded-xl text-center">
                            <p className="text-xs font-bold text-indigo-500 mb-1">พิกัด (Lat, Lng)</p>
                            <p className="text-sm font-mono text-indigo-700 m-0">{parseFloat(loc.lat).toFixed(5)}</p>
                            <p className="text-sm font-mono text-indigo-700 m-0">{parseFloat(loc.lng).toFixed(5)}</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-xl text-center">
                            <p className="text-xs font-bold text-purple-500 mb-1">รัศมีเช็คอิน</p>
                            <p className="text-2xl font-extrabold text-purple-700 m-0">{loc.radius}</p>
                            <p className="text-xs text-purple-500 m-0">เมตร</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-6 border-t border-gray-100 flex gap-3">
                        <button
                          onClick={() => openModal('edit', loc)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all border-none cursor-pointer"
                        >
                          <Edit size={18} />
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleToggleLocation(loc.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border-none cursor-pointer ${loc.active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                        >
                          <Power size={18} />
                          {loc.active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>

      {/* ===== MODAL: เพิ่ม/แก้ไขสถานที่ ===== */}
      {showModal && !showLocationMapModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 transition-all duration-300" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800 m-0">
                {modalType === 'add' ? 'เพิ่มสถานที่ใหม่' : 'แก้ไขสถานที่'}
              </h2>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex flex-col gap-6">

              {/* ชื่อสถานที่ */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">ชื่อสถานที่ <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`px-4 py-3 bg-gray-50 border ${formErrors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white font-medium transition-colors w-full`}
                  placeholder="เช่น สำนักงานใหญ่"
                />
                {formErrors.name && <span className="text-xs font-bold text-rose-500 mt-1">{formErrors.name}</span>}
              </div>

              {/* ปุ่มเลือกพิกัดจากแผนที่ */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={openLocationMapModal}
                  className="w-full bg-indigo-50/50 border-2 border-dashed border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                    <MapPinned size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <strong className="text-indigo-700 font-bold text-base">คลิกเพื่อเลือกตำแหน่งจากแผนที่</strong>
                    <small className="text-indigo-500/80 font-medium">มีฟีเจอร์ค้นหาสถานที่และดึงพิกัดปัจจุบัน</small>
                  </div>
                </button>

                {/* แสดงพิกัดที่เลือกแล้ว */}
                {(formData.lat && formData.lng) && (
                  <div className="mt-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-semibold text-sm font-mono">
                    <MapPin size={18} className="text-emerald-500" />
                    <span>พิกัด: {parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}</span>
                  </div>
                )}
                {(formErrors.lat || formErrors.lng) && (
                  <span className="text-xs font-bold text-rose-500">{formErrors.lat || formErrors.lng}</span>
                )}
              </div>

              {/* ที่อยู่ (กรอกอัตโนมัติจาก reverse geocode) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">ที่อยู่ <span className="text-rose-500">*</span></label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`px-4 py-3 bg-gray-50 border ${formErrors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white font-medium transition-colors w-full resize-none`}
                  placeholder="ที่อยู่จะถูกกรอกอัตโนมัติเมื่อเลือกจากแผนที่"
                  rows="3"
                />
                {formErrors.address && <span className="text-xs font-bold text-rose-500 mt-1">{formErrors.address}</span>}
              </div>

              {/* Slider รัศมี */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  รัศมี: <span className="text-indigo-600 text-base">{formData.radius}</span> เมตร <span className="text-rose-500">*</span>
                </label>
                <input
                  type="range"
                  name="radius"
                  min="10"
                  max="500"
                  step="10"
                  value={formData.radius}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                />
                <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 px-1">
                  <span>10m</span>
                  <span>100m</span>
                  <span>250m</span>
                  <span>500m</span>
                </div>
                {formErrors.radius && <span className="text-xs font-bold text-rose-500 mt-1">{formErrors.radius}</span>}

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mt-3 flex flex-col gap-2 text-xs font-medium text-amber-800">
                  <div className="flex gap-2 items-start"><AlertCircle size={14} className="mt-0.5 flex-shrink-0" /> พนักงานจะสามารถเช็คอินได้เฉพาะเมื่ออยู่ภายในรัศมีที่กำหนดเท่านั้น</div>
                  <div className="flex gap-2 items-start ml-5 text-amber-700/80">คำแนะนำ: 100-150m สำหรับอาคารสำนักงาน | 200-300m สำหรับโรงงาน</div>
                </div>
              </div>

              {/* Checkbox เปิดใช้งานทันที */}
              <div className="flex items-center mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="font-bold text-gray-700">เปิดใช้งานสถานที่นี้ทันที</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3 mt-auto rounded-b-3xl">
              <button onClick={closeModal} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition-colors cursor-pointer">
                ยกเลิก
              </button>
              <button onClick={handleSaveLocation} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                <Save size={20} />
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: แผนที่เลือกพิกัด ===== */}
      {showLocationMapModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] flex justify-center items-center p-4 sm:p-6 transition-all duration-300" onClick={() => setShowLocationMapModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800 m-0 flex items-center gap-3"><MapPinned size={28} className="text-indigo-600" /> เลือกตำแหน่งบนแผนที่</h2>
              <button onClick={() => setShowLocationMapModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 bg-gray-100 flex flex-col min-h-[500px]">
              {/* Floating Search Bar */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md z-[400] px-4">
                <div className="relative shadow-xl">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาสถานที่ เช่น สยามพารากอน..."
                    value={locationSearchTerm}
                    onChange={(e) => setLocationSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-xl shadow-md outline-none font-semibold text-gray-700"
                  />
                  {locationSearchTerm && (
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-1 border-none cursor-pointer transition-colors"
                      onClick={() => {
                        setLocationSearchTerm('');
                        setSearchResults([]);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Searching indicator */}
                {searchingLocation && (
                  <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center justify-center gap-3 text-indigo-600 font-semibold z-[400]">
                    <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    กำลังค้นหา...
                  </div>
                )}

                {/* ผลลัพธ์การค้นหา */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto z-[400]">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        className="w-full flex items-start gap-3 p-4 border-b border-gray-50 last:border-0 hover:bg-indigo-50 transition-colors text-left border-none cursor-pointer bg-transparent"
                        onClick={() => selectSearchResult(result)}
                      >
                        <MapPin size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-col">
                          <strong className="text-gray-800 text-sm mb-0.5">{result.display_name.split(',')[0]}</strong>
                          <small className="text-gray-500 text-xs leading-relaxed">{result.display_name}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Leaflet Map Container */}
              <div ref={mapRef} className="w-full h-full z-10 flex-1"></div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                {formData.lat && formData.lng ? (
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <strong className="font-extrabold">พิกัด:</strong>
                      <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">{parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <strong className="font-extrabold">รัศมี:</strong>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold">{formData.radius}m</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-amber-600 font-semibold m-0 flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    กรุณาคลิกบนแผนที่หรือค้นหาสถานที่
                  </p>
                )}
                {/* ปุ่มใช้ GPS ปัจจุบัน */}
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded-lg font-bold transition-all text-sm cursor-pointer whitespace-nowrap"
                  disabled={gettingLocation}
                >
                  {gettingLocation ? <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div> : <Locate size={16} />}
                  {gettingLocation ? 'กำลังค้นหา...' : 'ใช้ตำแหน่งปัจจุบัน'}
                </button>
              </div>

              {/* ยืนยันตำแหน่ง → ปิด modal แผนที่กลับไปที่ form */}
              <button onClick={() => setShowLocationMapModal(false)} className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg border-none cursor-pointer">
                <CheckCircle size={20} />
                ยืนยันตำแหน่งนี้
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: ตัวกรอง Log ===== */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 transition-all duration-300" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2"><Filter size={24} className="text-indigo-600" /> ตัวกรองข้อมูล</h2>
              <button onClick={() => setShowFilterModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">สถานะ</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors w-full cursor-pointer"
                >
                  <option value="all">ทั้งหมด</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">สถานที่</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors w-full cursor-pointer"
                >
                  <option value="all">ทั้งหมด</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" /> วันที่เริ่มต้น
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" /> วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors w-full"
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={clearFilters} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition-colors cursor-pointer">
                ล้างตัวกรอง
              </button>
              <button onClick={applyFilters} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-bold transition-all shadow-md hover:shadow-lg cursor-pointer">
                <Filter size={18} />
                ใช้ตัวกรอง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: แผนที่ดู GPS ของ Log ===== */}
      {showMapModal && selectedLog && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 transition-all duration-300" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800 m-0 flex items-center gap-3">
                <MapPin size={28} className="text-indigo-600" /> ตำแหน่ง GPS - {selectedLog.employee}
              </h2>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col md:flex-row gap-6">
              {/* ข้อมูลพนักงาน */}
              <div className="md:w-1/3 flex flex-col gap-4">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-500">พนักงาน</span>
                    <strong className="text-gray-800 text-lg">{selectedLog.employee} <span className="text-sm text-gray-500 font-normal">({selectedLog.employeeId})</span></strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-500">ตำแหน่ง</span>
                    <strong className="text-gray-800">{selectedLog.position}</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-500">สถานที่</span>
                    <strong className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit">{selectedLog.location}</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-500">วันที่ / เวลา</span>
                    <strong className="text-gray-800">{selectedLog.date} <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-1">{selectedLog.time}</span></strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-500">พิกัด GPS</span>
                    <strong className="text-gray-800 font-mono text-sm">{selectedLog.lat.toFixed(6)}, {selectedLog.lng.toFixed(6)}</strong>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-sm font-semibold text-gray-500">สถานะ</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 w-fit">
                      <CheckCircle size={16} /> เช็คอินสำเร็จ (อยู่ในพื้นที่)
                    </span>
                  </div>
                </div>
              </div>

              {/* Leaflet Map สำหรับดู log */}
              <div className="md:w-2/3 h-[400px] md:h-auto min-h-[400px]">
                <div ref={logMapRef} className="w-full h-full rounded-2xl border-2 border-gray-200 z-10 shadow-inner"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
