import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input = ({ label, ...props }: InputProps) => (
  <div className="grid gap-1.5">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input
      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
      {...props}
    />
  </div>
);
