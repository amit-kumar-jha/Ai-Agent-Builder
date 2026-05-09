'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle2, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notification';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadNotifications() {
    const res = await getNotifications();
    if (res.success) {
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.read).length);
    }
  }

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    loadNotifications();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-green-500" style={{ color: '#10b981' }} />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" style={{ color: '#f59e0b' }} />;
      case 'error': return <XCircle size={16} className="text-red-500" style={{ color: '#ef4444' }} />;
      default: return <Info size={16} className="text-blue-500" style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '8px' }}
        className="hover-bg-glass"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%', border: '2px solid var(--bg-primary)' }}></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ 
              position: 'absolute', 
              top: 'calc(100% + 12px)', 
              right: 0, 
              width: '360px', 
              maxHeight: '480px', 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-primary)', 
              borderRadius: '16px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  style={{ fontSize: '12px', color: 'var(--accent-purple)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  <Bell size={32} style={{ opacity: 0.1, margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '13px' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notif) => (
                  <div 
                    key={notif._id} 
                    onClick={() => !notif.read && handleMarkRead(notif._id)}
                    style={{ 
                      padding: '16px 20px', 
                      borderBottom: '1px solid var(--border-primary)', 
                      background: notif.read ? 'transparent' : 'rgba(139, 92, 246, 0.03)',
                      cursor: notif.read ? 'default' : 'pointer',
                      display: 'flex',
                      gap: '12px',
                      transition: 'background 0.2s'
                    }}
                    className="hover-bg-glass"
                  >
                    <div style={{ marginTop: '2px' }}>
                      {getIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{notif.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{notif.message}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {!notif.read && (
                      <div style={{ width: '8px', height: '8px', background: 'var(--accent-purple)', borderRadius: '50%', marginTop: '6px' }}></div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid var(--border-primary)', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
