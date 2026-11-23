"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/auth/FormField";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/validation";

type RegisterField = "name" | "email" | "password" | "confirmPassword";
type RegisterErrors = Partial<Record<RegisterField, string>>;

export default function RegisterPage() {
  const router = useRouter();
  const { status, register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: RegisterErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(
        form.password,
        form.confirmPassword,
      ),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    setServerError("");
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Buat akun CineBook"
      description="Daftar gratis dan mulai pesan tiket film favoritmu."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-red-500 hover:text-red-400"
          >
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
          >
            {serverError}
          </div>
        )}

        <FormField
          label="Nama lengkap"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Nama kamu"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormField
          label="Konfirmasi password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Ulangi password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Membuat akun..." : "Daftar"}
        </button>
      </form>
    </AuthCard>
  );
}
