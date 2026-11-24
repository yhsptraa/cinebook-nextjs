import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-white/10 bg-neutral-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-neutral-400">{description}</p>
        <div className="mt-6">{children}</div>
        {footer && (
          <div className="mt-6 text-center text-sm text-neutral-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
