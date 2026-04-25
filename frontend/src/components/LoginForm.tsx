import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { AuthForm } from './AuthForm';

type LoginFields = 'email' | 'password';

export const LoginForm = () => {
  const [formData, setFormData] = useState<Record<LoginFields, string>>({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const fields = [
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    {
      name: 'password',
      label: 'Mật khẩu',
      type: 'password',
      autoComplete: 'current-password',
    },
  ] as const;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await authApi.login(formData);
      localStorage.setItem('token', res.data.token);
      alert('Đăng nhập thành công!');
      navigate('/'); // Về trang chủ
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: string } } };
      const message = apiError.response?.data?.error ?? 'Đăng nhập thất bại';

      alert(message);
    }
  };

  return (
    <AuthForm
      title="Đăng nhập"
      submitLabel="Đăng nhập"
      values={formData}
      fields={fields}
      onSubmit={handleSubmit}
      onChange={(name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }}
    />
  );
};
