import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../../api/authApi';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await authApi.register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate('/login');
    } catch (error: any) {
      alert(error.response?.data?.error || "Đăng ký thất bại");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Tạo tài khoản mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email"
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
          <input 
            type="text"
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input 
            type="password"
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
          <input 
            type="password"
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Đăng ký
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập ngay</Link>
      </p>
    </div>
  );
};