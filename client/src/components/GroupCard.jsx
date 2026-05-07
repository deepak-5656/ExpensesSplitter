import React from 'react';
import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  return (
    <Link to={`/groups/${group._id}`} className="block">
      <div className="p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-colors cursor-pointer group hover:shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
            {group.emoji || '👥'}
          </div>
          <div>
            <h3 className="text-lg font-medium text-black">{group.name}</h3>
            <p className="text-slate-400 text-sm">{group.members?.length || 0} members</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
