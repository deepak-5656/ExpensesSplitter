import React from 'react';
import CategoryBadge from './CategoryBadge';
import { Trash2 } from 'lucide-react';

const ExpenseCard = ({ expense, onDelete, currentUserId }) => {
  const isOwner = expense.paidBy?._id === currentUserId || expense.user === currentUserId;
  const dateStr = new Date(expense.createdAt || expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
          {expense.category === 'Food' ? '🍕' : expense.category === 'Transport' ? '🚕' : '💸'}
        </div>
        <div>
          <p className="text-base font-medium text-black mb-1">{expense.title}</p>
          <p className="text-xs text-slate-400 mb-2">
            {expense.paidBy ? `Paid by ${expense.paidBy.name} • ` : ''}{dateStr}
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] uppercase font-medium tracking-wide border border-slate-200">
              {expense.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <p className="text-lg font-medium text-black">₹{expense.amount.toFixed(2)}</p>
        {isOwner && onDelete && (
          <button 
            onClick={() => onDelete(expense._id)}
            className="text-slate-400 hover:text-black transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(ExpenseCard);
