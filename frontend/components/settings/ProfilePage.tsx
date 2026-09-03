"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Pencil, Phone, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/services/authService";
import SettingsNav from "@/components/settings/SettingsNav";
import type { Portal } from "@/types/portal";

interface FormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  lga: string;
  country: string;
  dateOfBirth: string;
}

const defaultFormValues: FormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  lga: "",
  country: "Nigeria",
  dateOfBirth: "",
};

function splitName(fullName: string): Pick<FormValues, "firstName" | "middleName" | "lastName"> {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", middleName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], middleName: "", lastName: "" };
  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

export default function ProfilePage({ variant }: { variant: Portal }) {
  const { user } = useAuth();
  const isVendor = variant === "vendor";

  const [values, setValues] = useState<FormValues>(defaultFormValues);
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // AuthContext already fetches the full user (incl. profile) on load —
  // just mirror it into local editable form state here.
  useEffect(() => {
    if (!user) return;
    const { firstName, middleName, lastName } = splitName(user.name || "");
    setValues((prev) => ({
      ...prev,
      firstName,
      middleName,
      lastName,
      email: user.email || prev.email,
      phone: user.profile?.phone || user.phone || prev.phone,
      address: user.profile?.address || user.address || prev.address,
    }));
    if (user.profile?.profilePic || user.avatar) {
      setPhoto(user.profile?.profilePic || user.avatar || null);
    }
  }, [user]);

  const initials = useMemo(() => {
    const f = values.firstName?.[0] ?? user?.name?.[0] ?? "U";
    const l = values.lastName?.[0] ?? "";
    return `${f}${l}`.toUpperCase();
  }, [values.firstName, values.lastName, user?.name]);

  const updateValue =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setSaved(false);
    };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
    // TODO: wire to a real profile-picture upload endpoint once one is
    // confirmed on the backend — preview-only for now.
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      // Only phone/address are persisted by PATCH /auth/profile for a
      // personal (non-vendor) profile today — name/LGA/Country/DOB have
      // no backend field yet, so they stay editable here without erroring.
      await updateProfile({
        phone: values.phone,
        address: values.address,
        isVendor,
      });
      setSaved(true);
    } catch (error: any) {
      setSaveError(error?.message ?? "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="text-ink-500">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-500">
        <Link href={`/${variant}/settings`} className="hover:text-ink-500">
          Settings
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-500">Profile</span>
      </nav>

      {/* Profile card */}
      <section className="mx-auto mb-8 w-full max-w-md rounded-xl border border-border bg-card px-6 py-6 text-center">
        <div className="relative mx-auto mb-4 h-20 w-20">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="Profile"
              className="h-full w-full rounded-full border-2 border-success object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-success bg-brand-500 text-xl font-bold tracking-wide text-white">
              {initials}
            </div>
          )}
        </div>

        <h1 className="text-lg font-bold">
          {values.firstName || values.lastName
            ? `${values.firstName} ${values.lastName}`.trim()
            : user?.name || "User"}
        </h1>
        <p className="mt-0.5 text-sm text-muted-500">{values.email || user?.email}</p>

        <div className="mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white">
          <UserRound size={13} />
          {isVendor ? "Vendor" : "Customer"}
        </div>

        <label className="mx-auto mt-4 flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-ink-500 hover:bg-muted-50">
          Change Photo
          <Pencil size={12} />
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>
      </section>

      {/* Nav + form */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full rounded-2xl border border-border bg-card p-5 lg:w-72 lg:shrink-0">
          <SettingsNav portal={variant} />
        </aside>

        <div className="flex-1 rounded-2xl border border-border bg-card p-6">
          <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-notify-50 text-ink-500">
            <UserRound size={18} />
          </span>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First Name:" value={values.firstName} onChange={updateValue("firstName")} />
              <Field label="Middle Name:" value={values.middleName} onChange={updateValue("middleName")} />
              <Field label="Last Name:" value={values.lastName} onChange={updateValue("lastName")} />
              <Field label="Email" value={values.email} onChange={updateValue("email")} disabled />
              <Field
                label="Phone Number"
                value={values.phone}
                onChange={updateValue("phone")}
                icon={<Phone size={14} />}
              />
              <Field
                label={isVendor ? "Address" : "Primary Address"}
                value={values.address}
                onChange={updateValue("address")}
                icon={<MapPin size={14} />}
              />
              <Field label="LGA" value={values.lga} onChange={updateValue("lga")} icon={<MapPin size={14} />} />
              <Field
                label="Country"
                value={values.country}
                onChange={updateValue("country")}
                icon={<MapPin size={14} />}
              />
              <Field
                label="Date Of Birth"
                value={values.dateOfBirth}
                onChange={updateValue("dateOfBirth")}
                placeholder="dd/mm/yyyy"
              />
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-end gap-4">
              {saved && <span className="text-xs font-medium text-success">Profile updated</span>}
              {saveError && <span className="text-xs font-medium text-error">{saveError}</span>}
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Updating…" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-500">{label}</span>
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-400">
            {icon}
          </span>
        )}
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink-500 outline-none placeholder:text-muted-400 focus:border-brand-500 ${
            icon ? "pl-9" : ""
          } ${disabled ? "cursor-not-allowed bg-muted-50/60 text-muted-500" : ""}`}
        />
      </span>
    </label>
  );
}
