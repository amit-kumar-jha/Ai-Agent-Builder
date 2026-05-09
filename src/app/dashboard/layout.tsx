'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import useStore from '@/lib/store';
import { Home, Bot, GitMerge, LayoutTemplate, Link2, BarChart2, CreditCard, Settings, LogOut, ChevronLeft, ChevronRight, Plus, Search, Bell, ChevronsUpDown, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser, logoutAction } from '@/actions/auth';
import NotificationBell from '@/components/dashboard/NotificationBell';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/agents', label: 'My Agents', icon: Bot },
  { href: '/dashboard/workflows', label: 'Workflows', icon: GitMerge },
  { href: '/dashboard/marketplace', label: 'Templates', icon: LayoutTemplate },
  { href: '/dashboard/integrations', label: 'Integrations', icon: Link2 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth, sidebarCollapsed, toggleSidebar } = useStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function checkAuth() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/signin');
      } else if (!user) {
        useStore.getState().setAuth(currentUser as any, 'server-cookie');
      }
    }
    checkAuth();
  }, [router, user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logoutAction();
    clearAuth();
    router.push('/auth/signin');
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname?.includes('/builder')) return 'Agent Builder';
    if (pathname?.includes('/agents/new')) return 'Create Agent';
    if (pathname?.includes('/agents')) return 'My Agents';
    if (pathname?.includes('/workflows')) return 'Workflows';
    if (pathname?.includes('/marketplace')) return 'Templates';
    if (pathname?.includes('/integrations')) return 'Integrations';
    if (pathname?.includes('/analytics')) return 'Analytics';
    if (pathname?.includes('/billing')) return 'Billing';
    if (pathname?.includes('/settings')) return 'Settings';
    return 'NexAgeAI';
  };

  if (!mounted) return null;

  return (
    <div className="app-layout" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ borderRight: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', zIndex: 100, display: 'flex', flexDirection: 'column', width: (sidebarCollapsed && !mobileMenuOpen) ? '80px' : '280px', transition: 'width 0.3s ease' }}>

        {/* Workspace Switcher */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-primary)', position: 'relative' }}>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', transition: 'background 0.2s' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: 'transparent' }}>
              <img src="/logo.png" alt="NexAgeAI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>NexAgeAI</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Enterprise Plan</div>
              </div>
            )}
            {(!sidebarCollapsed || mobileMenuOpen) && <ChevronsUpDown size={14} color="var(--text-tertiary)" />}
          </button>

          {/* Mobile Close Button */}
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '8px' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: isActive ? 'var(--bg-input-focus)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}>
                  <Icon size={18} color={isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'} style={{ flexShrink: 0 }} />
                  {(!sidebarCollapsed || mobileMenuOpen) && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-primary)' }}>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{user?.email || 'user@example.com'}</div>
              </div>
            )}
            {(!sidebarCollapsed || mobileMenuOpen) && <LogOut size={16} color="var(--text-tertiary)" onClick={(e) => { e.stopPropagation(); handleLogout(); }} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Navigation Bar */}
        <header className="dashboard-header" style={{ height: '64px', minHeight: '64px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Mobile Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'none' }}
            >
              <Menu size={20} />
            </button>
            {/* Desktop Toggle */}
            <button
              className="desktop-toggle"
              onClick={toggleSidebar}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{getPageTitle()}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Search Bar */}
            <div className="dashboard-search" style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                placeholder="Search agents, workflows..."
                style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
              />
              <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-primary)', fontSize: '10px', color: 'var(--text-muted)' }}>⌘K</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ThemeToggle />
              <NotificationBell />

              {/* <Link href="/dashboard/agents/new" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <Plus size={14} /> New
                </button>
              </Link> */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: 'var(--bg-secondary)' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
