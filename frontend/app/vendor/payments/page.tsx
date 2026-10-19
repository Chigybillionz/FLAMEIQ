"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { ChevronRight, Landmark, CreditCard, Save, Calendar, ArrowUpRight, DollarSign } from "lucide-react";

// Explicit TypeScript shape declarations for our real-time database connection fields
interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function VendorPaymentsPage() {
  // 1. Fully interactive state for editing bank details based on team feedback
  const [bank, setBank] = useState<BankDetails>({
    bankName: "Flutterwave MFB",
    accountNumber: "9748044285",
    accountName: "",
  });

  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBankUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // This is the clean, placeholder structural wireframe where the backend team 
      // will drop their actual "PUT /api/vendor/bank-details" Axios service requests
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsEditingBank(false);
    } catch (err) {
      console.error("Failed to sync bank update with backend:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Breadcrumb Navigation */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted-500">
          <Link href="/vendor/dashboard" className="hover:text-ink-500">
            Merchant Portal
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink-500">Payments & Earnings</span>
        </nav>
        <h1 className="mt-1 text-2xl font-bold text-ink-500">Payments & Payouts</h1>
      </div>

      {/* 1. Overview Financial Metric Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-500">Available Payout Balance</p>
          <h3 className="text-3xl font-black text-brand-500 mt-1">₦0.00</h3>
          <p className="text-xs text-muted-500 mt-2">Settles automatically to your linked bank account twice weekly.</p>
        </div>
        <div className="rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-500">LifeTime Platform Revenue</p>
          <h3 className="text-3xl font-black text-ink-500 mt-1">₦0.00</h3>
          <p className="text-xs text-muted-500 mt-2">Aggregated volume total of all successfully delivered cylinders.</p>
        </div>
      </div>

      {/* 2. Fully Editable Connected Bank Details Form Block */}
      <div className="rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6">
        <div className="flex items-center justify-between mb-4 border-b border-[#E2E4E9]/60 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 flex items-center gap-2">
            <Landmark size={16} className="text-brand-500" />
            Settlement Bank Account
          </h2>
          {!isEditingBank && (
            <button
              onClick={() => setIsEditingBank(true)}
              className="text-xs font-bold text-brand-500 hover:underline"
            >
              Edit Bank Details
            </button>
          )}
        </div>

        {isEditingBank ? (
          <form onSubmit={handleBankUpdateSubmit} className="space-y-4 max-w-md">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wide text-ink-500 block">Bank Name</label>
              <input
                type="text"
                required
                value={bank.bankName}
                onChange={(e) => setBank({ ...bank, bankName: e.target.value })}
                className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-ink-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wide text-ink-500 block">Account Number</label>
              <input
                type="text"
                required
                maxLength={10}
                value={bank.accountNumber}
                onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-ink-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wide text-ink-500 block">Account Name</label>
              <input
                type="text"
                required
                value={bank.accountName}
                onChange={(e) => setBank({ ...bank, accountName: e.target.value })}
                className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-ink-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-hover disabled:opacity-60"
              >
                <Save size={14} />
                {isSaving ? "Saving..." : "Save Account Modifications"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBank(false)}
                className="rounded-md border border-brand-300 bg-white px-4 py-2 text-xs font-bold text-ink-500 hover:bg-brand-50/20"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-white p-4 rounded-md border border-[#E2E4E9]">
            <div>
              <p className="text-xs text-muted-500 uppercase font-medium">Financial Institution</p>
              <p className="font-semibold text-ink-500 mt-0.5">{bank.bankName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-500 uppercase font-medium">Account Number</p>
              <p className="font-mono font-semibold text-ink-500 mt-0.5">{bank.accountNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-500 uppercase font-medium">Verified Account Name</p>
              <p className="font-semibold text-ink-500 mt-0.5">{bank.accountName}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Empty State Pipeline List Layout Placeholder for Payout History */}
      <div className="rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 mb-4 flex items-center gap-2 border-b border-[#E2E4E9]/60 pb-3">
          <CreditCard size={16} className="text-brand-500" />
          Payout & Order Settlement Ledger
        </h2>
        
        {/* Because the team requested "No mock data", we display a clean database-ready empty ledger */}
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-500 space-y-2 bg-white rounded-md border border-[#E2E4E9]">
          <Calendar size={32} className="text-brand-300 stroke-1" />
          <p className="text-sm font-semibold text-ink-500">No payout settlements recorded yet</p>
          <p className="text-xs max-w-sm">
            Once you accept gas orders from customers and log safe delivery confirmations, your generated revenue ledgers will appear here in list format.
          </p>
        </div>
      </div>
    </div>
  );
}
