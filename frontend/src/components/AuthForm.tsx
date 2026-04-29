import type { ReactNode, FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axiosClient from '../api/axiosClient';
import { Input } from './ui/Input';

type FormField<T extends string> = {
  name: T;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
};

type AuthFormProps<T extends string> = {
  title: string;
  submitLabel: string;
  values: Record<T, string>;
  fields: readonly FormField<T>[];
  onChange: (name: T, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  footer?: ReactNode;
};

export const AuthForm = <T extends string>({
  title,
  submitLabel,
  values,
  fields,
  onChange,
  onSubmit,
  footer,
}: AuthFormProps<T>) => {
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axiosClient.post('/auth/google', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Đăng nhập thành công!');
      navigate('/profile');
    }
    catch (error: any) {
      console.error('Google Auth Error:', error);
      alert('Không thể xác thực với hệ thống. Vui lòng thử lại.');
    }
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
        <h2 className="mb-5 text-center text-[1.65rem] font-bold text-slate-900">
          {title}
        </h2>
        <form onSubmit={onSubmit} className="grid gap-4">
          {fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              required
              onChange={(event) => onChange(field.name, event.target.value)}
            />
          ))}
          <button
            type="submit"
            className="mt-1 rounded-xl bg-linear-to-r from-blue-700 to-blue-600 px-4 py-2.5 font-bold text-white transition hover:-translate-y-0.5 hover:brightness-105"
          >
            {submitLabel}
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 font-medium">Hoặc tiếp tục với</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
            theme="outline"
            shape="pill"
            text="continue_with"
          />
        </div>
        {footer ? (
          <div className="mt-4 text-center text-sm text-slate-600">{footer}</div>
        ) : null}
      </div>
    </GoogleOAuthProvider>
  );
};
