'use client';

import React, { useState } from 'react';
import { Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to update password');
      }

      setMessage({ type: 'success', text: 'Admin passphrase updated successfully! Please use the new passphrase next time you log in.' });
      setCurrentPassword('');
      setNewPassword('');
      
      // Update current session cookie to prevent immediate logout
      document.cookie = `admin_session=${newPassword}; path=/; max-age=86400; SameSite=Strict`;
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-[#E0DDD8]">
        <div>
          <h2 className="text-2xl font-display font-bold text-stone-900 flex items-center gap-3">
            <Shield className="w-6 h-6 text-gold-accent" />
            Security <span className="font-light italic">Settings</span>
          </h2>
          <p className="text-xs font-sans text-stone-500 uppercase tracking-widest mt-1">
            Manage your admin dashboard access
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E0DDD8] p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-stone-100">
          <Key className="w-5 h-5 text-stone-400" />
          <h3 className="text-sm font-sans uppercase tracking-widest font-bold text-stone-900">
            Change Passphrase
          </h3>
        </div>

        {message && (
          <div className={`mb-6 p-4 border text-xs font-sans uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <span className="font-bold">{message.type === 'success' ? 'Success: ' : 'Error: '}</span>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">Current Passphrase *</label>
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E0DDD8] focus:outline-none focus:ring-1 focus:ring-gold-accent focus:border-gold-accent bg-[#FAF8F5] transition-colors"
              placeholder="Enter current passphrase"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">New Passphrase *</label>
            <input
              required
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E0DDD8] focus:outline-none focus:ring-1 focus:ring-gold-accent focus:border-gold-accent bg-[#FAF8F5] transition-colors"
              placeholder="Enter new passphrase"
            />
            <p className="text-[10px] text-stone-400 mt-1">Make sure to store your new passphrase securely.</p>
          </div>

          <div className="pt-4 border-t border-[#E0DDD8] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center py-3 px-8 border border-transparent text-xs font-sans uppercase font-bold tracking-widest text-white bg-black hover:bg-stone-900 focus:outline-none transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Passphrase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
