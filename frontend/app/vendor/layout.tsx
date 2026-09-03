"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Sparkles, 
  Wallet, 
  Bot, 
  Settings, 
  LogOut,
  Bell,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";

import { useAuth } from "@/context/AuthContext";
import { withAuth } from "@/components/auth/useAuth";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close notifications
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch past notifications & connect to SSE
  useEffect(() => {
    const token = localStorage.getItem("flameiq_token");
    if (!token) return;

    fetch("http://localhost:5000/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setNotifications(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch notifications:", err));

    const evtSource = new EventSource(`http://localhost:5000/api/notifications/stream?token=${token}`);
    
    evtSource.onmessage = (event) => {
      try {
        const newNotif = JSON.parse(event.data);
        setNotifications(prev => [newNotif, ...prev]);
      } catch (err) {
        console.error("Failed to parse SSE notification:", err);
      }
    };

    return () => {
      evtSource.close();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { path: "/vendor/dashboard", label: "Dashboard", icon: Home },
    { path: "/vendor/orders", label: "Refill Orders", icon: Sparkles },
    { path: "/vendor/payments", label: "Payments", icon: Wallet },
    { path: "/vendor/ai-assistant", label: "AI Assistant", icon: Bot },
    { path: "/vendor/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 relative z-10 shadow-2xl transition-transform">
            <div className="h-16 flex items-center justify-between px-6 border-b border-transparent shrink-0 mt-2">
              <Image src="/images/logo.png" alt="FlameIntel" width={140} height={32} className="h-7 w-auto object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.path);
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive ? "bg-[#1e40af] text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                    {item.label}
                    {isActive && <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-yellow-400 rounded-full" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 shrink-0">
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col h-full shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-transparent shrink-0 mt-2">
          <Image src="/images/logo.png" alt="FlameIntel" width={140} height={32} className="h-7 w-auto object-contain" />
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive 
                    ? "bg-[#1e40af] text-white" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                {item.label}
                {isActive && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-yellow-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <div className="bg-[#1e40af] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <h3 className="font-bold text-lg leading-tight mb-2">Never run out of cooking gas again.</h3>
            <p className="text-xs text-blue-100 mb-4 opacity-90">Let <span className="font-bold text-yellow-400">FlameIntel</span> predict, remind and deliver- so you can focus on what matters.</p>
            <button className="bg-white text-blue-900 text-xs font-bold py-2.5 px-4 rounded-xl w-full flex items-center justify-between hover:bg-blue-50 transition-colors">
              Explore Smart Refill
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="text-sm font-semibold text-slate-700 truncate">
              {navItems.find(i => pathname?.startsWith(i.path))?.label || "Refill Orders"}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/vendor/settings" 
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Settings size={16} />
            </Link>
            
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center transition-colors relative ${isNotificationsOpen ? 'bg-slate-100 text-blue-600 border-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-blue-600 font-medium hover:underline">Mark all as read</button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                        <Bell size={24} />
                      </div>
                      <p className="font-medium text-slate-800 text-sm mb-1">No new notifications</p>
                      <p className="text-xs text-slate-500">You&apos;re all caught up! Check back later for updates on your refill orders.</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif, index) => (
                        <div key={notif.id || index} className={`p-4 border-b border-slate-50 flex gap-3 hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                            notif.type === 'success' ? 'bg-green-100 text-green-600' :
                            notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                            notif.type === 'error' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <Bell size={14} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">
                              {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-all">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Indicator */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img
                  src={user?.avatar || "https://i.pravatar.cc/150?img=11"} 
                  alt={user?.name || "Vendor User"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                {user?.name?.split(" ")[0] || "Vendor"} <span className="text-[10px] text-slate-400">▼</span>
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Restrict access strictly to VENDOR and ADMIN roles
export default withAuth(VendorLayout, ["VENDOR", "ADMIN"]);