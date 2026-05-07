import React from 'react';

const BalanceCard = ({ name, balance, type = 'owes' }) => {
  const isPositive = balance >= 0;
  const isOwes = type === 'owes';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{name}</h4>
          <p className="text-xs text-slate-500">
            {isOwes ? (isPositive ? 'You owe them' : 'They owe you') : 'Spent total'}
          </p>
        </div>
      </div>
      <div className={`font-bold ${
        isOwes ? (isPositive ? 'text-red-500' : 'text-green-500') : 'text-slate-800'
      }`}>
        ₹{Math.abs(balance).toFixed(2)}
      </div>
    </div>
  );
};

export default BalanceCard;
