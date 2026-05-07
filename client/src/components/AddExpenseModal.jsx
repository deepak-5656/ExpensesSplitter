import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AddExpenseModal({ isOpen, onClose, onAdd, members, currentUser }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal'); // 'equal' | 'custom'
  const [customSplits, setCustomSplits] = useState({});

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setAmount('');
      setSplitType('equal');
      
      const initialSplits = {};
      members?.forEach(m => initialSplits[m._id] = '');
      setCustomSplits(initialSplits);
    }
  }, [isOpen, members]);

  if (!isOpen) return null;

  const handleCustomSplitChange = (userId, val) => {
    setCustomSplits(prev => ({ ...prev, [userId]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = parseFloat(amount);
    
    // If it's a personal expense (no members), bypass split logic
    if (!members || members.length === 0) {
      onAdd({ title, amount: totalAmount });
      return;
    }

    let splitAmong = [];
    
    if (splitType === 'equal') {
      const share = totalAmount / members.length;
      splitAmong = members.map(m => ({ user: m._id, share }));
    } else {
      let sum = 0;
      splitAmong = members.map(m => {
        const share = parseFloat(customSplits[m._id]) || 0;
        sum += share;
        return { user: m._id, share };
      });
      
      if (Math.abs(sum - totalAmount) > 0.01) {
        alert(`Custom splits (₹${sum}) must equal total amount (₹${totalAmount})`);
        return;
      }
    }

    onAdd({
      title,
      amount: totalAmount,
      splitType,
      splitAmong
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-black">Add Expense</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Dominos Pizza"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-black outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full px-4 py-3 text-2xl font-medium border border-slate-200 rounded-xl focus:ring-1 focus:ring-black outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {members && members.length > 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Split Options</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSplitType('equal')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${splitType === 'equal' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}
                  >
                    Split Equally
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitType('custom')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${splitType === 'custom' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}
                  >
                    Punch Exact Prices
                  </button>
                </div>
              </div>

              {splitType === 'custom' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Punch member prices</p>
                  {members.map(member => (
                    <div key={member._id} className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-black truncate flex-1">{member.name} {member._id === currentUser?._id && '(You)'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none text-right"
                          value={customSplits[member._id] || ''}
                          onChange={(e) => handleCustomSplitChange(member._id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="pt-4 mt-2 border-t border-slate-100">
            <button 
              type="submit"
              className="w-full bg-black hover:bg-[#111] text-white font-medium py-3 rounded-xl transition-colors"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
