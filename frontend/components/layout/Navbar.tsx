"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import type { Portal } from "@/types/portal";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export default function Navbar({
  portal,
  onToggleSidebar,
}: {
  portal: Portal;
  onToggleSidebar: () => void;
}) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;

    // Fetch past notifications
    fetch("http://localhost:5000/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch notifications:", err));

    // Connect to SSE stream
    const evtSource = new EventSource(`http://localhost:5000/api/notifications/stream?token=${token}`);
    
    evtSource.onmessage = (event) => {
      try {
        const newNotif = JSON.parse(event.data);
        setNotifications((prev) => [newNotif, ...prev]);
      } catch (err) {
        console.error("Error parsing notification event:", err);
      }
    };

    return () => {
      evtSource.close();
    };
  }, [token]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:px-6 relative z-50">
      <button
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-ink-500 hover:bg-brand-50"
      >
        <Menu size={20} />
      </button>

      {portal === "customer" ? (
        <div className="flex flex-1 items-center gap-2 text-sm text-ink-500">
          
          <Image src="/images/logo.png" alt="FlameIQ logo" width={140} height={34} />
        </div>
      ) : (
        <Image src="/images/logo.png" alt="FlameIntel logo" width={110} height={26} className="flex-1" />
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          aria-label="Notifications"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative rounded-full p-2 hover:bg-brand-50 transition-colors"
        >
          <Bell size={18} className="text-ink-500" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute -right-2 sm:right-0 mt-2 w-[calc(100vw-32px)] sm:w-80 max-w-sm bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[400px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />}
                    </div>
                    <p className={`text-xs ${!notif.isRead ? 'text-slate-600' : 'text-slate-500'} line-clamp-2 leading-relaxed`}>
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <ThemeToggle />
    </header>
  );
}