import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';

export const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login(formData);
      localStorage.setItem('token', res.data.token);
      alert("Đăng nhập thành công!");
      navigate('/'); // Về trang chủ
    } catch (error: any) {
      alert(error.response?.data?.error || "Đăng nhập thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      <input 
        type="email"
        placeholder="Email" 
        className="w-full mb-4 p-2 border rounded"
        onChange={e => setFormData({...formData, email: e.target.value})}
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="w-full mb-6 p-2 border rounded"
        onChange={e => setFormData({...formData, password: e.target.value})}
      />
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Đăng nhập
      </button>
    </form>
  );
};