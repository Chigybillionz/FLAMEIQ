"use client";

import Link from "next/link";
import { 
  ClipboardList, 
  Hourglass, 
  Banknote, 
  Truck, 
  Star,
  MapPin,
  ChevronRight,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

// --- Types & Interfaces ---
export type OrderStatus = "pending" | "preparing" | "out_for_delivery" | "completed" | "cancelled";

export interface RefillOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  time: string;
  cylinderSize: string;
  refillType: string;
  location: string;
  status: OrderStatus;
  eta?: string;
}

export interface VendorStats {
  todaysOrdersCount: number;
  pendingOrdersCount: number;
  todaysRevenue: number;
  activeDeliveriesCount: number;
  rating: number;
  reviewCount: number;
}

export interface DemandInsights {
  peakDay: string;
  peakHour: string;
  householdsEmptyingSoon: number;
}

export interface VendorDashboardProps {
  vendorName?: string;
  stats?: VendorStats;
  pendingOrders?: RefillOrder[];
  activeDeliveries?: RefillOrder[];
  recentOrders?: RefillOrder[];
  insights?: DemandInsights;
  onAcceptOrder?: (orderId: string) => void;
}

// --- Helper Functions ---
const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold text-[10px]">Completed</span>;
    case "cancelled":
      return <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-100 text-red-600 font-bold text-[10px]">Cancelled</span>;
    case "out_for_delivery":
      return <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">Out for delivery</span>;
    case "preparing":
      return <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded">Preparing</span>;
    case "pending":
    default:
      return <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Pending</span>;
  }
};

// --- Mock Defaults ---
const defaultStats: VendorStats = {
  todaysOrdersCount: 0,
  pendingOrdersCount: 0,
  todaysRevenue: 0,
  activeDeliveriesCount: 0,
  rating: 0.0,
  reviewCount: 0,
};

const defaultInsights: DemandInsights = {
  peakDay: "N/A",
  peakHour: "N/A",
  householdsEmptyingSoon: 0,
};

export default function VendorDashboardPage({
  vendorName = "Vendor",
  stats = defaultStats,
  pendingOrders = [],
  activeDeliveries = [],
  recentOrders = [],
  insights = defaultInsights,
  onAcceptOrder,
}: VendorDashboardProps) {
  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <span>Dashboard</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="font-semibold text-slate-800">Home</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Good Morning, {vendorName}👋</h1>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening with your refill service today</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Today's Order */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ClipboardList size={20} />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Today&#39;s Order</p>
              <p className="text-xl font-bold text-blue-900 leading-none">{stats.todaysOrdersCount}</p>
            </div>
          </div>
          <Link href="/vendor/orders" className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
            View details &rarr;
          </Link>
        </div>

        {/* Pending Order */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Hourglass size={20} />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Pending Order</p>
              <p className="text-xl font-bold text-blue-900 leading-none">{stats.pendingOrdersCount}</p>
            </div>
          </div>
          <Link href="/vendor/orders" className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
            View details &rarr;
          </Link>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Banknote size={20} />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Today&apos;s Revenue</p>
              <p className="text-xl font-bold text-blue-900 leading-none">{formatNaira(stats.todaysRevenue)}</p>
            </div>
          </div>
          <Link href="/vendor/earnings" className="text-xs font-semibold text-purple-600 flex items-center gap-1 hover:underline">
            View details &rarr;
          </Link>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <Truck size={20} />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Active Deliveries</p>
              <p className="text-xl font-bold text-blue-900 leading-none">{stats.activeDeliveriesCount}</p>
            </div>
          </div>
          <Link href="/vendor/orders" className="text-xs font-semibold text-yellow-600 flex items-center gap-1 hover:underline">
            View details &rarr;
          </Link>
        </div>

        {/* Customer Rating */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
              <Star size={20} fill="currentColor" />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Customer Rating</p>
              <p className="text-xl font-bold text-blue-900 leading-none">{stats.rating.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-yellow-400 text-[10px]">
             {[1, 2, 3, 4, 5].map((star) => (
               <Star 
                 key={star} 
                 size={10} 
                 fill={star <= Math.round(stats.rating) ? "currentColor" : "#e2e8f0"} 
                 className={star <= Math.round(stats.rating) ? "" : "text-slate-200"} 
               />
             ))}
             <span className="text-slate-400 ml-1">({stats.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Pending Refill Orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Pending Refill Orders</h2>
            <Link href="/vendor/orders" className="text-xs font-semibold text-blue-600 hover:underline">View all</Link>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            {pendingOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No pending orders</p>
            ) : (
              pendingOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="border border-slate-100 rounded-lg p-3 flex gap-3 items-center hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-14 bg-yellow-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="7" y="6" width="10" height="15" rx="3" fill="#EAB308"/>
                      <rect x="9" y="3" width="6" height="3" fill="#EAB308"/>
                      <path d="M7 9C7 7.34315 8.34315 6 10 6H14C15.6569 6 17 7.34315 17 9V11H7V9Z" fill="#CA8A04"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-800">{order.orderNumber}</span>
                      <span className="text-xs font-bold text-blue-900">{formatNaira(order.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 truncate pr-2">{order.customerName}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{order.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-500">{order.cylinderSize} • {order.refillType}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MapPin size={10} /> {order.location}
                        </div>
                      </div>
                      <button 
                        onClick={() => onAcceptOrder?.(order.id)}
                        className="bg-[#1e40af] text-white text-[10px] font-bold px-3 py-1.5 rounded-md hover:bg-blue-800 transition-colors shrink-0"
                      >
                        Accept Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link href="/vendor/orders" className="mt-auto w-full py-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            View all pending order &rarr;
          </Link>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Active Deliveries</h2>
            <Link href="/vendor/orders" className="text-xs font-semibold text-blue-600 hover:underline">View all</Link>
          </div>

          <div className="flex flex-col gap-3">
            {activeDeliveries.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active deliveries</p>
            ) : (
              activeDeliveries.slice(0, 3).map((delivery) => (
                <div key={delivery.id} className="border border-slate-100 rounded-lg p-3 flex gap-3 items-center hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 text-yellow-600">
                    <Truck size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-800">{delivery.orderNumber}</span>
                      {getStatusBadge(delivery.status)}
                    </div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">{delivery.customerName}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-500">{delivery.cylinderSize} • {delivery.refillType}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MapPin size={10} /> {delivery.location}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-green-600">ETA: {delivery.eta || "-"}</span>
                        <button className="w-6 h-6 rounded border border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-50">
                           <MapPin size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-bold text-slate-800 text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/vendor/orders" className="bg-yellow-50 hover:bg-yellow-100 transition-colors p-4 rounded-xl flex items-center gap-4 text-left group border border-yellow-100">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-900 shrink-0">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="6" width="10" height="15" rx="3" fill="currentColor"/>
                  <rect x="9" y="3" width="6" height="3" fill="currentColor"/>
                </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-sm">View Refill Orders</div>
              <div className="text-[11px] text-slate-500 mt-0.5">See all orders and manage</div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>

          <Link href="/vendor/deliveries" className="bg-slate-200/50 hover:bg-slate-200 transition-colors p-4 rounded-xl flex items-center gap-4 text-left group border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 shrink-0">
               <ClipboardList size={20} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-sm">Manage Deliveries</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Track and manage deliveries</div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>

          <Link href="/vendor/pricing" className="bg-purple-100 hover:bg-purple-200 transition-colors p-4 rounded-xl flex items-center gap-4 text-left group border border-purple-200">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 shrink-0">
               <Banknote size={20} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-sm">Update Price</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Adjust prices to current daily value</div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 text-sm mb-4">Recent Orders</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-125">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Orders ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Cylinder</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">No recent orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-bold text-slate-800">{order.orderNumber}</td>
                      <td className="py-4 font-semibold text-slate-700">{order.customerName}</td>
                      <td className="py-4 font-semibold text-slate-700">{order.cylinderSize}</td>
                      <td className="py-4 font-bold text-blue-900">{formatNaira(order.amount)}</td>
                      <td className="py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 text-right font-semibold text-slate-800">{order.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demand Insights */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Demand Insights</h2>
            <Link href="/vendor/analytics" className="text-[10px] font-semibold text-blue-600 hover:underline">View full report</Link>
          </div>

          <div className="flex flex-col gap-3">
            <div className="border border-slate-100 rounded-lg p-3 flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-green-500 shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Peak Ordering Day</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{insights.peakDay}</div>
              </div>
            </div>

            <div className="border border-slate-100 rounded-lg p-3 flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-yellow-500 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Peak Ordering Hour</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{insights.peakHour}</div>
              </div>
            </div>

            <div className="border border-slate-100 rounded-lg p-3 flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-slate-700 shrink-0">
                <Users size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Households Emptying Soon</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{insights.householdsEmptyingSoon} <br/><span className="text-slate-400">In your zone</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}