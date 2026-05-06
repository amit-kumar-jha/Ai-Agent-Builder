'use client';
import { Users, Mail, Shield } from 'lucide-react';

export default function TeamPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Team Management</h2>
      <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 28 }}>Manage team members and permissions</p>
      <div className="empty-state">
        <div className="empty-state-icon"><Users size={32} color="var(--accent-purple)" /></div>
        <h3 className="empty-state-title">Team features coming soon</h3>
        <p className="empty-state-desc">Invite team members, share agents, and collaborate on workflows. Available on Starter plan and above.</p>
        <button className="btn btn-primary">Upgrade Plan</button>
      </div>
    </div>
  );
}
