"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronRight, UserRound } from "lucide-react";
import SettingsNav from "@/components/settings/SettingsNav";
import MultiSelectField from "@/components/settings/MultiSelectField";
import { updateProfile } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

const CYLINDER_OPTIONS = ["3 kg", "6 kg", "12 kg", "12.5 kg", "25 kg", "50 kg"];
const DELIVERY_OPTIONS = ["Self Delivery", "Third-Party Courier", "Pickup Only"];

export default function BusinessInformationPage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState(user?.profile?.businessName ?? "");
  const [modeOfContact, setModeOfContact] = useState("");
  const [businessAddress, setBusinessAddress] = useState(user?.profile?.address ?? "");
  const [lga, setLga] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [ninOrCac, setNinOrCac] = useState("");
  const [cylinders, setCylinders] = useState<string[]>([]);
  const [deliveryModes, setDeliveryModes] = useState<string[]>([]);
  const [areasServed, setAreasServed] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink-500 outline-none placeholder:text-muted-400 focus:border-brand-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-500";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    try {
      // Only businessName/address persist today — Mode of Contact,
      // Opening Hours, NIN/CAC, Available Cylinder, Mode of Delivery and
      // Areas Served have no backend field yet, so they stay editable
      // here without being saved remotely until the backend adds support.
      await updateProfile({
        businessName,
        address: businessAddress,
        isVendor: true,
      });
      setFeedback("Business information updated.");
    } catch {
      setFeedback("Unable to update right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-500">
        <Link href="/vendor/settings" className="hover:text-ink-500">
          Settings
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-500">Business Information</span>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full rounded-2xl border border-border bg-card p-5 lg:w-72 lg:shrink-0">
          <SettingsNav portal="vendor" />
        </aside>

        <div className="flex-1 rounded-2xl border border-border bg-card p-6">
          <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-notify-50 text-ink-500">
            <UserRound size={18} />
          </span>

          {feedback && <p className="mb-4 text-sm font-medium text-brand-500">{feedback}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Business Name:</label>
              <input
                type="text"
                placeholder="Enter Your Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mode Of Contact</label>
              <input
                type="text"
                placeholder="Phone Number/Email"
                value={modeOfContact}
                onChange={(e) => setModeOfContact(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Business Address:</label>
              <input
                type="text"
                placeholder="Enter Your Business Address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>LGA</label>
                <input type="text" value={lga} onChange={(e) => setLga(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Opening Hours</label>
                <input
                  type="text"
                  placeholder="PM / AM"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>NIN / CAC Number</label>
              <input
                type="text"
                placeholder="ID Number"
                value={ninOrCac}
                onChange={(e) => setNinOrCac(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Available Cylinder</label>
              <MultiSelectField
                values={cylinders}
                onChange={setCylinders}
                options={CYLINDER_OPTIONS}
                placeholder="Select as Many as You Have"
              />
            </div>

            <div>
              <label className={labelClass}>Mode Of Delivery</label>
              <MultiSelectField
                values={deliveryModes}
                onChange={setDeliveryModes}
                options={DELIVERY_OPTIONS}
                placeholder="Multiple Choice"
              />
            </div>

            <div>
              <label className={labelClass}>Areas You Can Serve (within LGA)</label>
              <input
                type="text"
                placeholder="Enter locations"
                value={areasServed}
                onChange={(e) => setAreasServed(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating…" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
