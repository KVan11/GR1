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
  const facebookAppId = import.meta.env.VITE_FB_APP_ID;

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
  const responseFacebook = async (accessToken: string) => {
    try {
      const res = await axiosClient.post('/auth/facebook', {
        token: accessToken,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Đăng nhập thành công!');
      navigate('/profile');
    }
    catch (error: any) {
      console.error('Fb Login Error:', error);
      alert('Lỗi đăng nhập Fb');
    }
  };

  const handleFacebookLogin = async () => {
    if (!facebookAppId) {
      alert('Thiếu VITE_FB_APP_ID trong file .env');
      return;
    }

    const isSecureOrigin =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isSecureOrigin) {
      alert('Facebook login chỉ hoạt động trên HTTPS hoặc localhost.');
      return;
    }

    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    authUrl.searchParams.set('client_id', facebookAppId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', 'public_profile,email');

    const popup = window.open(
      authUrl.toString(),
      'facebook-login',
      'width=600,height=700'
    );

    if (!popup) {
      alert('Trình duyệt đã chặn cửa sổ đăng nhập Facebook.');
      return;
    }

    const pollTimer = window.setInterval(async () => {
      try {
        if (popup.closed) {
          window.clearInterval(pollTimer);
          return;
        }

        const popupUrl = popup.location.href;
        if (!popupUrl.startsWith(redirectUri)) {
          return;
        }

        const hash = popup.location.hash.startsWith('#')
          ? popup.location.hash.slice(1)
          : popup.location.hash;
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          return;
        }

        window.clearInterval(pollTimer);
        popup.close();
        await responseFacebook(accessToken);
      }
      catch {
        return;
      }
    }, 500);
  };

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

        <div className="flex flex-col items-center gap-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
            theme="outline"
            shape="pill"
            text="continue_with"
          />
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-[#dadce0] bg-white px-6 py-2.5 text-sm font-normal text-[#3c4043] transition hover:bg-[#e8f0fe] hover:border-[#c6dafc] self-center"
          >
            <svg className="h-5 w-5" fill="#0A66C2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Tiếp tục sử dụng dịch vụ Facebook
          </button>
        </div>
        {footer ? (
          <div className="mt-4 text-center text-sm text-slate-600">{footer}</div>
        ) : null}
      </div>
    </GoogleOAuthProvider>
  );
};
