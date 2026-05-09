'use client';
import { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, XCircle, CheckCircle2, Search, Trash2, Check, RefreshCw } from 'lucide-react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notification';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = async () => {
    setIsLoading(true);
    const res = await getNotifications();
    if (res.success) {
      setNotifications(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

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
      case 'success': return <CheckCircle2 size={20} style={{ color: '#10b981' }} />;
      case 'warning': return <AlertTriangle size={20} style={{ color: '#f59e0b' }} />;
      case 'error': return <XCircle size={20} style={{ color: '#ef4444' }} />;
      default: return <Info size={20} style={{ color: '#3b82f6' }} />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="page-header" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Notifications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Stay updated with your agent activities and system alerts.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={loadNotifications}
            style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleMarkAllRead}
            style={{ padding: '10px 20px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Check size={18} /> Mark all read
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '14px', 
              fontWeight: filter === 'all' ? 700 : 500, 
              color: filter === 'all' ? 'var(--accent-purple)' : 'var(--text-secondary)', 
              cursor: 'pointer',
              padding: '4px 0',
              borderBottom: filter === 'all' ? '2px solid var(--accent-purple)' : '2px solid transparent'
            }}
          >
            All Notifications
          </button>
          <button 
            onClick={() => setFilter('unread')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '14px', 
              fontWeight: filter === 'unread' ? 700 : 500, 
              color: filter === 'unread' ? 'var(--accent-purple)' : 'var(--text-secondary)', 
              cursor: 'pointer',
              padding: '4px 0',
              borderBottom: filter === 'unread' ? '2px solid var(--accent-purple)' : '2px solid transparent'
            }}
          >
            Unread
          </button>
        </div>

        <div style={{ minHeight: '400px' }}>
          {isLoading ? (
            <div style={{ padding: '100px 0', textAlign: 'center' }}>
              <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--text-tertiary)', margin: '0 auto' }} />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{ padding: '100px 20px', textAlign: 'center' }}>
              <Bell size={48} style={{ color: 'var(--text-tertiary)', opacity: 0.1, margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>All caught up!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>You have no {filter === 'unread' ? 'unread ' : ''}notifications at the moment.</p>
            </div>
          ) : (
            filteredNotifications.map((notif, i) => (
              <div 
                key={notif._id} 
                style={{ 
                  padding: '24px', 
                  borderBottom: i === filteredNotifications.length - 1 ? 'none' : '1px solid var(--border-primary)', 
                  background: notif.read ? 'transparent' : 'rgba(139, 92, 246, 0.02)',
                  display: 'flex',
                  gap: '20px',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(notif.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{notif.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                      {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', maxWidth: '800px' }}>
                    {notif.message}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {!notif.read && (
                      <button 
                        onClick={() => handleMarkRead(notif._id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={14} /> Mark as read
                      </button>
                    )}
                    {notif.link && (
                      <a 
                        href={notif.link}
                        style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                      >
                        View details →
                      </a>
                    )}
                  </div>
                </div>
                
                {!notif.read && (
                  <div style={{ width: '10px', height: '10px', background: 'var(--accent-purple)', borderRadius: '50%', marginTop: '8px' }}></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
