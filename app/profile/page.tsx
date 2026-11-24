"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import FormField from "@/components/auth/FormField";
import { validateName } from "@/lib/validation";
import type { User } from "@/types/auth";

export default function ProfilePage() {
  const { status, user } = useAuth();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      {status === "loading" && <ProfileSkeleton />}
      {status === "guest" && <GuestProfile />}
      {status === "authenticated" && user && <MemberProfile user={user} />}
    </div>
  );
}



function ProfileSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-neutral-900 p-8">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-white/10" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="h-4 w-56 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-8 h-24 rounded-lg bg-white/5" />
    </div>
  );
}



function GuestProfile() {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900 p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl text-neutral-300">
        ?
      </div>
      <h1 className="mt-5 text-2xl font-bold text-white">Kamu belum login</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">
        Masuk atau buat akun untuk melihat profil, menyimpan data, dan memesan
        tiket CineBook.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/login"
          className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-white/15 px-6 py-2.5 text-sm font-semibold text-neutral-100 transition hover:bg-white/10"
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}



function MemberProfile({ user }: { user: User }) {
  const { logout, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const joinedAt = new Date(user.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function startEditing() {
    setName(user.name);
    setError(undefined);
    setSaved(false);
    setEditing(true);
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name });
      setEditing(false);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-white">
            {user.name}
          </h1>
          <p className="truncate text-sm text-neutral-400">{user.email}</p>
        </div>
      </div>

      {saved && (
        <div
          role="status"
          className="mt-6 rounded-lg border border-green-500/40 bg-green-500/10 px-3.5 py-2.5 text-sm text-green-300"
        >
          Profil berhasil diperbarui.
        </div>
      )}

      <div className="mt-8 border-t border-white/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Informasi akun
        </h2>

        {editing ? (
          <form onSubmit={handleSave} noValidate className="mt-4 space-y-4">
            <FormField
              label="Nama lengkap"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(undefined);
              }}
              error={error}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-white/15 px-5 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
              >
                Batal
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 space-y-4 text-sm">
            <InfoRow label="Nama lengkap" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Bergabung sejak" value={joinedAt} />
          </dl>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="rounded-lg border border-white/15 px-5 py-2 text-sm font-medium text-neutral-100 transition hover:bg-white/10"
          >
            Edit nama
          </button>
        )}
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-red-500/40 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="font-medium text-neutral-100">{value}</dd>
    </div>
  );
}
