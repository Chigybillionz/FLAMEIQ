"use client";

import { useState, useEffect } from "react";
import { Check, ImageIcon, Loader2, MapPin, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function VendorOrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { token } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If it's the demo ID, just show the mock immediately
    if (orderId === "FLQ-78391") {
      setOrder({
        id: "FLQ-78391",
        createdAt: new Date().toISOString(),
        status: "ON_ROUTE",
        type: "STANDARD",
        user: {
          name: "Emeka Johnson",
          profile: { address: "12, Adekunle street, Wuse 2, Abuja." }
        },
        items: [{ quantity: 1 }],
        cylinder: { size: "KG_12_5" },
      });
      setLoading(false);
      return;
    }

    if (!token || !orderId) return;
    
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          throw new Error(data.message || "Failed to load order");
        }
      } catch (err) {
        // Fallback to mock data for demo purposes if API fails
        setOrder({
          id: orderId,
          createdAt: new Date().toISOString(),
          status: "ACCEPTED",
          type: "STANDARD",
          user: {
            name: "Demo Customer",
            profile: { address: "Demo Address, Lagos." }
          },
          items: [{ quantity: 2 }],
          cylinder: { size: "KG_6" },
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [token, orderId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
        <p className="text-red-500 font-semibold">Order not found</p>
        <Link href="/vendor/dashboard" className="text-blue-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const getTimelineProgress = () => {
    if (order.status === "DELIVERED" || order.status === "CONFIRMED") return 6;
    if (order.status === "ON_ROUTE") return 3;
    if (order.status === "ACCEPTED") return 1;
    return 0;
  };

  const formatTimelineTime = (date: Date, prefix = "Today") =>
    `${prefix}, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

  const acceptedAt = new Date(order.createdAt);
  const addMinutes = (minutes: number) =>
    new Date(acceptedAt.getTime() + minutes * 60_000);
  const progress = getTimelineProgress();

  const timeline = [
    { label: "Order Accepted", time: formatTimelineTime(acceptedAt), icon: Check },
    { label: "Order Ready", time: formatTimelineTime(addMinutes(3)), icon: Check },
    { label: "Rider Assigned", time: formatTimelineTime(addMinutes(23)), icon: Check },
    { label: "Cylinder Arrival", time: formatTimelineTime(addMinutes(43)), icon: Check },
    { label: "Out For Delivery", time: formatTimelineTime(addMinutes(48)), icon: Truck },
    { label: "Delivered", time: formatTimelineTime(addMinutes(80), "Est"), icon: MapPin },
  ].map((step, index) => ({
    ...step,
    status: index < progress ? "completed" : "pending",
  }));

  return (
    <div className="flex flex-col min-h-screen bg-white">


      {/* Main Layout Area */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden p-8 gap-8">
        
        {/* Left Column: Details */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-20">
          
          <div>
            <h1 className="text-2xl font-bold text-slate-800 text-[#1e40af]">Order Details</h1>
            <p className="text-sm text-slate-500 mt-1">View and manage all your past gas orders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Customer Card */}
            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 text-sm">My Customer</h3>
              <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium w-1/3">Full Address</span>
                <span className="text-slate-800 font-medium text-right w-2/3">{order.user?.profile?.address || "Address not provided"}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Name:</span>
                <span className="text-slate-800 font-medium text-right">{order.user?.name || "Customer"}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Order ID:</span>
                <span className="text-slate-800 font-bold text-right truncate w-24">#{order.id.split('-')[0]}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Preferred Delivery Time:</span>
                <span className="text-slate-800 font-medium text-right">ASAP</span>
              </div>
            </div>

            {/* Refill Information Card */}
            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 text-sm">Refill Information</h3>
              <div className="flex gap-4">
                <div className="w-24 shrink-0 flex items-center justify-center">
                   {/* Gas Cylinder Mock Image placeholder */}
                   <div className="h-32 w-20 relative flex items-center justify-center">
                     <Image src="/cylinder.png" alt="Gas Cylinder" fill className="object-contain drop-shadow-md" />
                   </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Order ID</span>
                    <span className="text-slate-800 font-bold truncate w-24">#{order.id.split('-')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Quantity</span>
                    <span className="text-slate-800 font-medium">{order.items?.[0]?.quantity || 1} Cylinder</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Refill Type</span>
                    <span className="text-slate-800 font-medium">{order.type === "QUICK" ? "Quick Refill" : "Standard Refill"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Cylinder Size</span>
                    <span className="text-slate-800 font-medium">{order.cylinder?.size?.replace('KG_', '').replace('_', '.') || "Unknown"} KG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proof of Refill */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4 mt-2">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Proof of Refill</h3>
              <p className="text-sm text-slate-500 mt-0.5">Upload gas weight before & after refill.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl h-48 flex flex-col items-center justify-center text-center p-6 hover:bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer group relative overflow-hidden">
                {order.beforeFillImage ? (
                  <img src={order.beforeFillImage} alt="Before Refill" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-slate-300 group-hover:text-blue-400 transition-colors mb-3" size={32} />
                    <span className="text-[11px] font-bold text-slate-400 mb-1">JPEG (10 mb)</span>
                    <p className="text-xs text-slate-500 font-medium max-w-[200px]">Upload the picture of gas cylinder on a scale before refill</p>
                  </>
                )}
              </div>

              <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl h-48 flex flex-col items-center justify-center text-center p-6 hover:bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer group relative overflow-hidden">
                {order.afterFillImage ? (
                   <img src={order.afterFillImage} alt="After Refill" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-slate-300 group-hover:text-blue-400 transition-colors mb-3" size={32} />
                    <span className="text-[11px] font-bold text-slate-400 mb-1">JPEG (10 mb)</span>
                    <p className="text-xs text-slate-500 font-medium max-w-[200px]">Upload the picture of gas cylinder on a scale after refill</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Proof of Delivery */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4 mt-2">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Proof of Delivery</h3>
              <p className="text-sm text-slate-500 mt-0.5">Proof of delivery will be uploaded here by your customer.</p>
            </div>
            
            <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl h-48 w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 mt-2 relative overflow-hidden">
              {/* Add when buyer confirm flow is added */}
              <ImageIcon className="text-slate-200 mb-2" size={32} />
              <span className="text-[11px] font-bold text-slate-300">JPEG (10 mb)</span>
            </div>
          </div>

        </div>

        {/* Right Column: Delivery Info Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4 pb-10 lg:pb-0">
          
          <div className="mb-2">
            <h2 className="text-xl font-bold text-slate-800">Delivery Info</h2>
            <p className="text-sm text-slate-500 mt-1">Monitor Order Delivery Status In Real Time</p>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-sm mb-1">Courier Info</h3>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Carrier:</span>
              <span className="text-slate-800 font-semibold">Chowdeck</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-sm mb-1">Rider Info</h3>
            <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Name:</span>
              <span className="text-slate-800 font-medium text-right">Emeka</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Phone:</span>
              <span className="text-slate-800 font-bold text-right">08124354482</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Vehicle Type:</span>
              <span className="text-slate-800 font-medium text-right">Motorcycle</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm">Estimated Time Of Delivery</h3>
            <p className="text-sm text-slate-500 mt-1">Arriving In ~20 mins</p>
          </div>

          <div className="rounded-xl border border-[#d9dee8] bg-white px-[50px] py-7 shadow-sm">
            <h3 className="mb-8 text-[28px] font-bold leading-none text-[#282d52]">Status Timeline</h3>

            <div className="flex flex-col">
              {timeline.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = step.status === "completed";
                const isLast = idx === timeline.length - 1;

                return (
                  <div key={step.label} className="relative flex gap-5">
                    {!isLast && (
                      <div
                        className={`absolute left-[30px] top-[60px] h-[64px] w-[4px] -translate-x-1/2 ${
                          isCompleted ? "bg-[#1f5a8f]" : "bg-[#e3e6ec]"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full ${
                        isCompleted ? "bg-[#1f5a8f]" : "bg-[#e3e6ec]"
                      }`}
                    >
                      <StepIcon
                        size={step.label === "Delivered" ? 38 : 40}
                        strokeWidth={step.label === "Delivered" ? 1.5 : 4}
                        className="text-white"
                      />
                    </div>

                    <div className="min-h-[126px] pt-1.5">
                      <h4
                        className={`text-[25px] font-bold leading-tight ${
                          isCompleted ? "text-[#1f2937]" : "text-[#596170]"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="mt-3 block text-[24px] leading-none text-[#61708a]">
                        {step.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="mt-2 w-full bg-[#204066] hover:bg-[#152e4d] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-md">
              <Truck size={18} />
              Live Track
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
