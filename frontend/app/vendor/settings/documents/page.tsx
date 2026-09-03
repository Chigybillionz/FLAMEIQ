"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, ImageIcon, Upload } from "lucide-react";
import SettingsNav from "@/components/settings/SettingsNav";

const CYLINDER_OPTIONS = ["3 kg", "6 kg", "12 kg", "12.5 kg", "25 kg", "50 kg"];

export default function MyDocumentsPage() {
  const [selectedCylinders, setSelectedCylinders] = useState<string[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCylinder = (size: string) => {
    setSelectedCylinders((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocumentFile(file);
  };

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-500">
        <Link href="/vendor/settings" className="hover:text-ink-500">
          Settings
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-500">My Documents</span>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full rounded-2xl border border-border bg-card p-5 lg:w-72 lg:shrink-0">
          <SettingsNav portal="vendor" />
        </aside>

        <div className="flex flex-1 flex-col gap-6 sm:flex-row">
          <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card">
            <p className="border-b border-border px-4 py-3 text-sm font-semibold text-ink-500">
              Available Cylinder
            </p>
            <div className="flex flex-col">
              {CYLINDER_OPTIONS.map((size) => {
                const isSelected = selectedCylinders.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleCylinder(size)}
                    className={`border-l-2 px-4 py-3 text-left text-sm transition-colors ${
                      isSelected
                        ? "border-brand-500 font-semibold text-ink-500"
                        : "border-transparent text-muted-500 hover:border-brand-200 hover:bg-muted-50 hover:text-ink-500"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-ink-500">Documents Upload</p>
            <p className="mt-3 text-sm text-muted-500">
              Upload a valid document to verify your business (CAC / NIN).
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted-50/40 py-10 text-center hover:bg-muted-50"
            >
              {documentFile ? (
                <>
                  <ImageIcon size={22} className="text-brand-500" />
                  <span className="text-sm font-medium text-ink-500">{documentFile.name}</span>
                </>
              ) : (
                <>
                  <Upload size={22} className="text-muted-400" />
                  <span className="text-xs text-muted-400">JPEG (10 mb)</span>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg"
              onChange={handleFileSelected}
              className="hidden"
            />
            {/* TODO: wire to a document-upload endpoint once one exists
                on the backend — none is mounted today. */}
          </div>
        </div>
      </div>
    </div>
  );
}
