import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../data/mockUsers';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.id || !formData.password) {
      showError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const result = authenticateUser(formData.id, formData.password);
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/dashboard');
      } else {
        showError(result.message);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ backgroundColor: '#3C467B' }}>
      <div className="w-full max-w-2xl bg-white p-12 flex flex-col items-center rounded-lg shadow-lg relative">
        
        {/* Profile Circle */}
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-12">
          <img 
            src="https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute top-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form className="w-full max-w-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input 
              type="text" 
              name="id" 
              placeholder="Employee ID" 
              value={formData.id} 
              onChange={handleChange} 
              disabled={loading}
              className="w-full px-12 py-4 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              disabled={loading}
              className="w-full px-12 py-4 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="text-right">
            <button 
              type="button"
              onClick={() => navigate('/adminforgotpassword')}
              className="text-blue-800 hover:text-blue-500 text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-400 text-white font-bold rounded-lg hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;