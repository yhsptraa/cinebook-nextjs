import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({
  label,
  error,
  id,
  className = "",
  ...props
}: FormFieldProps) {
  const inputId = id ?? props.name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-neutral-200"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-lg border bg-neutral-950 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500/40"
            : "border-white/10 focus:border-red-500 focus:ring-red-500/40"
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
