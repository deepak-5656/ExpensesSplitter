import React from 'react';
import { X } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function QRModal({ isOpen, onClose, targetUser, amount, onSettle, isSettling }) {
  if (!isOpen || !targetUser) return null;

  // Real UPI deep link format
  // upi://pay?pa=upiId&pn=Name&am=Amount&cu=INR
  const upiId = targetUser.upiId || `${targetUser.email.split('@')[0]}@ybl`; // Fallback to dummy if missing
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(targetUser.name)}&am=${amount.toFixed(2)}&cu=INR`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-black">Pay {targetUser.name.split(' ')[0]}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-1.5" disabled={isSettling}>
            <X size={20} />
          </button>
        </div>

        <div className="p-8 text-center space-y-6">
          <div className="inline-flex justify-center items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
            <QRCode value={upiLink} size={200} fgColor="#111111" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Amount to Settle</p>
            <p className="text-4xl font-light tracking-tight text-black">₹{amount.toFixed(2)}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>UPI ID:</span>
              <span className="font-medium text-black truncate ml-4">{upiId}</span>
            </div>
            {!targetUser.upiId && (
              <p className="text-xs text-amber-600 mt-2">Note: This user hasn't added their real UPI ID yet. Using a simulation ID.</p>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            disabled={isSettling}
            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSettle}
            disabled={isSettling}
            className="flex-1 bg-black hover:bg-[#111] text-white font-medium py-3.5 rounded-xl transition-colors shadow-lg shadow-black/10 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isSettling ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Mark as Paid'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
