import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, LogOut, Shield, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.upiId) {
      setUpiId(user.upiId);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const saveUpiId = async () => {
    try {
      setIsSaving(true);
      await api.put('/auth/profile', { upiId });
      toast.success('UPI ID updated successfully!');
      // Update local storage/context silently if needed, but a page reload is fine
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Failed to update UPI ID');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-normal text-black mb-1">Profile Settings</h1>
        <p className="text-slate-500">Manage your account and payment details.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-black text-4xl font-normal border border-slate-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-normal text-black">{user?.name}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <Mail size={16} />
              {user?.email}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-black text-xs font-medium mt-3 border border-slate-200">
              <Shield size={12} />
              Verified
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <QrCode size={20} /> Payment Settings (UPI)
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Add your real UPI ID below. When friends owe you money in a group, they can instantly pay you via a live QR Code!
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="e.g. username@okhdfcbank"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-black outline-none text-black"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <button 
                onClick={saveUpiId}
                disabled={isSaving}
                className="px-6 py-3 bg-black hover:bg-[#111] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save UPI'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-black px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
