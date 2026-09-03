"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getOrders, acceptOrder, rejectOrder, setOrderOnRoute, setOrderDelivered } from "@/services/ordersService";
import {
  ClipboardList,
  Clock,
  Truck,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Image as ImageIcon
} from "lucide-react";

type OrderStatus = "PAYMENT_PENDING" | "PENDING" | "ACCEPTED" | "ON_ROUTE" | "DELIVERED" | "CONFIRMED" | "REJECTED" | "CANCELLED";

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  type: string;
  createdAt: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  user: { name: string; profile?: { phone?: string; address?: string } };
}

// Map backend statuses to simple UI categories
const getUIGroup = (status: OrderStatus) => {
  if (status === "PENDING") return "Pending";
  if (["ACCEPTED", "ON_ROUTE", "DELIVERED"].includes(status)) return "Active";
  if (status === "CONFIRMED") return "Completed";
  return "Other";
};

// UI mappings for list badges
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "PAYMENT_PENDING": return { label: "Awaiting Payment", bg: "bg-slate-100", text: "text-slate-600", icon: Clock };
    case "PENDING": return { label: "Pending", bg: "bg-orange-50", text: "text-orange-500", icon: Clock };
    case "ACCEPTED": return { label: "Accepted", bg: "bg-yellow-50", text: "text-yellow-600", icon: CheckCircle2 };
    case "ON_ROUTE": return { label: "On Route", bg: "bg-yellow-50", text: "text-yellow-600", icon: Truck };
    case "DELIVERED": return { label: "Delivered", bg: "bg-blue-50", text: "text-blue-500", icon: CheckCircle2 };
    case "CONFIRMED": return { label: "Completed", bg: "bg-green-50", text: "text-green-600", icon: CheckCircle2 };
    case "REJECTED": return { label: "Rejected", bg: "bg-red-50", text: "text-red-600", icon: X };
    case "CANCELLED": return { label: "Cancelled", bg: "bg-slate-100", text: "text-slate-500", icon: X };
    default: return { label: status, bg: "bg-slate-100", text: "text-slate-600", icon: Clock };
  }
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Modal states
  const [actionLoading, setActionLoading] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      const fetchedOrders = res.data.data;
      setOrders(fetchedOrders);
      // Update selected order if it exists, otherwise select the first order
      if (selectedOrder) {
        const updatedSelected = fetchedOrders.find((o: Order) => o.id === selectedOrder.id);
        if (updatedSelected) setSelectedOrder(updatedSelected);
        else setSelectedOrder(fetchedOrders[0] || null);
      } else if (fetchedOrders.length > 0) {
        setSelectedOrder(fetchedOrders[0]);
      }
    } catch {
      showToast("Failed to load orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleFileSelect = (type: "before" | "after", file: File) => {
    const url = URL.createObjectURL(file);
    if (type === "before") { setBeforeFile(file); setBeforePreview(url); }
    else { setAfterFile(file); setAfterPreview(url); }
  };

  const handleAccept = async () => {
    if (!selectedOrder || !beforeFile || !afterFile) {
      showToast("Please upload both before and after fill images.", "error");
      return;
    }
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("beforeFillImage", beforeFile);
      formData.append("afterFillImage", afterFile);
      await acceptOrder(selectedOrder.id, formData);
      showToast("Order accepted successfully!", "success");
      setShowAcceptModal(false);
      setBeforeFile(null); setAfterFile(null);
      setBeforePreview(null); setAfterPreview(null);
      fetchOrders();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to accept order.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (orderId: string) => {
    setActionLoading(true);
    try {
      await rejectOrder(orderId);
      showToast("Order rejected. Buyer will be notified.", "success");
      fetchOrders();
    } catch {
      showToast("Failed to reject order.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOnRoute = async (orderId: string) => {
    setActionLoading(true);
    try {
      await setOrderOnRoute(orderId);
      showToast("Order marked as On Route!", "success");
      fetchOrders();
    } catch {
      showToast("Failed to update order.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelivered = async (orderId: string) => {
    setActionLoading(true);
    try {
      await setOrderDelivered(orderId);
      showToast("Order marked as Delivered! Waiting for buyer confirmation.", "success");
      fetchOrders();
    } catch {
      showToast("Failed to update order.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = orders.filter((o) => getUIGroup(o.status) === "Pending").length;
  const activeCount = orders.filter((o) => getUIGroup(o.status) === "Active").length;
  const completedCount = orders.filter((o) => getUIGroup(o.status) === "Completed").length;

  const filteredOrders = orders.filter((o) => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user.name.toLowerCase().includes(search.toLowerCase()) ||
    o.user.profile?.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-64px)] w-full bg-[#f9fafb] text-slate-900 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 text-white font-medium text-sm flex items-center gap-2 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Refill Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and process customers' refill request.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* All Orders */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-100 p-2.5 rounded-full">
                <ClipboardList size={20} className="text-slate-600" />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 mb-0.5">All Orders</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{orders.length}</p>
              </div>
            </div>
            <button className="text-xs font-medium text-blue-600 text-left hover:underline">View all</button>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl border border-orange-100 p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-50 p-2.5 rounded-full">
                <Clock size={20} className="text-orange-500" />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-800 mb-0.5">Pending</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{pendingCount}</p>
              </div>
            </div>
            <button className="text-xs font-medium text-orange-500 text-left hover:underline">View orders</button>
          </div>

          {/* Active */}
          <div className="bg-white rounded-xl border border-yellow-100 p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-yellow-50 p-2.5 rounded-full">
                <Truck size={20} className="text-yellow-500" />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-800 mb-0.5">Active</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{activeCount}</p>
              </div>
            </div>
            <button className="text-xs font-medium text-yellow-500 text-left hover:underline">View orders</button>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl border border-green-100 p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-50 p-2.5 rounded-full">
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-800 mb-0.5">Completed</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{completedCount}</p>
              </div>
            </div>
            <button className="text-xs font-medium text-green-500 text-left hover:underline">View orders</button>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, order ID or Location" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-white hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
            Sort by <ChevronDown size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Orders List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Header Row */}
          <div className="grid grid-cols-5 md:grid-cols-6 gap-4 p-4 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
            <div className="col-span-1">Order ID</div>
            <div className="col-span-2">Details</div>
            <div className="col-span-1 hidden md:block">Amount</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* List Body */}
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No orders found.
              </div>
            ) : (
              filteredOrders.map(order => {
                const badge = getStatusBadge(order.status);
                const isSelected = selectedOrder?.id === order.id;
                const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', dateOptions);

                return (
                  <div 
                    key={order.id} 
                    className={`grid grid-cols-5 md:grid-cols-6 gap-4 p-4 items-center transition-colors hover:bg-slate-50 cursor-pointer ${isSelected ? 'bg-blue-50/30' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Order ID & Date */}
                    <div className="col-span-1 flex flex-col">
                      <span className="font-semibold text-blue-900 text-sm">#FLQ-{order.id.substring(0, 5).toUpperCase()}</span>
                      <span className="text-[10px] sm:text-xs text-slate-400 mt-1">{formattedDate}</span>
                    </div>

                    {/* Details */}
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-10 h-12 bg-blue-100 rounded-lg hidden sm:flex items-center justify-center text-blue-600 shrink-0">
                        <ImageIcon size={20} />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-slate-800 text-sm truncate">
                          {order.items.length > 0 ? order.items[0].name : "Gas Cylinder"}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5 truncate">{order.items.length} Cylinder</span>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 truncate">
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{order.user.profile?.address || "No address provided"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-1 hidden md:flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">₦ {Number(order.totalAmount).toLocaleString()}</span>
                      <span className="text-[11px] text-slate-400 mt-1">{order.status === 'PAYMENT_PENDING' ? 'Awaiting Payment' : 'Paid'}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        <badge.icon size={12} strokeWidth={3} />
                        {badge.label}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 flex justify-end">
                      {order.status === "PENDING" ? (
                        <button 
                          className="text-xs font-semibold text-blue-700 bg-white border border-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowAcceptModal(true); }}
                        >
                          Accept Order
                        </button>
                      ) : (
                        <button 
                          className="text-xs font-semibold text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-slate-500 pb-8 md:pb-0">
          <span>Showing 1 to {filteredOrders.length} of {orders.length} orders</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Delivery Details */}
      <div className="w-full md:w-80 lg:w-[380px] bg-white border-l border-slate-200 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 sticky top-0 h-[calc(100vh-64px)] hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Delivery Details</h2>
          <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg md:hidden">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {selectedOrder ? (
            <>
            {/* Header Badge */}
            {(() => {
              const badge = getStatusBadge(selectedOrder.status);
              return (
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text} mb-3`}>
                    <badge.icon size={12} strokeWidth={3} />
                    {badge.label}
                  </span>
                  <h3 className="text-xl font-bold text-blue-900 mb-1">#FLQ-{selectedOrder.id.substring(0, 5).toUpperCase()}</h3>
                  <p className="text-xs text-slate-500">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              );
            })()}

            {/* Customer Info Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 mb-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  <Image src="/profile.png" alt="Profile" width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-slate-800 text-[15px] truncate">{selectedOrder.user.name}</span>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                  <MapPin size={12} className="shrink-0 text-teal-400" />
                  <span className="leading-tight truncate">{selectedOrder.user.profile?.address || "Address not provided"}</span>
                </div>
              </div>
            </div>

            {/* Refill Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm mb-4">Refill Information</h4>
              
              <div className="flex gap-4 items-center">
                <div className="w-16 h-28 relative flex items-center justify-center shrink-0">
                   <Image src="/cylinder.png" alt="Gas Cylinder" fill className="object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4 py-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Order ID</span>
                    <span className="font-semibold text-slate-800">#FLQ-{selectedOrder.id.substring(0, 5).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Quantity</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.items.length} Cylinder</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Refill Type</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.type || 'Full Refill'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Cylinder Size</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.items.length > 0 ? selectedOrder.items[0].name.split(' ')[0] : 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
               <h4 className="font-bold text-slate-800 text-sm mb-4">Payment</h4>
               <div className="flex flex-col gap-4 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Amount</span>
                    <span className="font-bold text-slate-800">₦ {Number(selectedOrder.totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Payment Method</span>
                    <span className="font-semibold text-slate-800">Payment Confirms Order</span>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto pt-2">
              {selectedOrder.status === "PENDING" && (
                <>
                  <button 
                    className="w-full bg-[#1e40af] hover:bg-blue-800 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm text-[13px]"
                    onClick={() => setShowAcceptModal(true)}
                  >
                    Accept Order
                  </button>
                  <button 
                    className="w-full bg-white hover:bg-red-50 text-red-500 border border-red-300 font-medium py-2.5 rounded-xl transition-colors shadow-sm text-[13px]"
                    onClick={() => handleReject(selectedOrder.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Reject Order"}
                  </button>
                </>
              )}
              {selectedOrder.status === "ACCEPTED" && (
                 <button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    onClick={() => handleOnRoute(selectedOrder.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Mark On Route"}
                  </button>
              )}
              {selectedOrder.status === "ON_ROUTE" && (
                 <button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    onClick={() => handleDelivered(selectedOrder.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Mark Delivered"}
                  </button>
              )}
               {selectedOrder.status === "DELIVERED" && (
                 <p className="text-center text-sm font-medium text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                    Waiting for buyer confirmation...
                 </p>
              )}
            </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
              <ClipboardList size={48} className="mb-4 text-slate-200" />
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Accept Modal with Image Upload */}
      {showAcceptModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">Accept Order #FLQ-{selectedOrder.id.substring(0, 5).toUpperCase()}</h2>
                <button onClick={() => setShowAcceptModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"><X size={20}/></button>
              </div>
              <p className="text-sm text-slate-500">Upload proof images of the cylinder before and after filling.</p>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Before Fill Image */}
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">Before Filling</p>
                <div
                  className={`border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative group ${beforePreview ? 'border-transparent' : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50'}`}
                  onClick={() => beforeRef.current?.click()}
                >
                  {beforePreview ? (
                    <>
                      <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-sm font-medium">Change Image</div>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={28} className="text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500 font-medium">Tap to upload</span>
                    </>
                  )}
                </div>
                <input
                  ref={beforeRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect("before", e.target.files[0])}
                />
              </div>

              {/* After Fill Image */}
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">After Filling</p>
                <div
                  className={`border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative group ${afterPreview ? 'border-transparent' : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50'}`}
                  onClick={() => afterRef.current?.click()}
                >
                  {afterPreview ? (
                     <>
                      <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-sm font-medium">Change Image</div>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={28} className="text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500 font-medium">Tap to upload</span>
                    </>
                  )}
                </div>
                <input
                  ref={afterRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect("after", e.target.files[0])}
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
               <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={actionLoading || !beforeFile || !afterFile}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {actionLoading ? "Accepting…" : "Confirm Accept"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
