import type { ReactNode, FormEvent } from 'react';
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
  return (
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
          className="mt-1 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2.5 font-bold text-white transition hover:-translate-y-0.5 hover:brightness-105"
        >
          {submitLabel}
        </button>
      </form>
      {footer ? (
        <div className="mt-4 text-center text-sm text-slate-600">{footer}</div>
      ) : null}
    </div>
  );
};
