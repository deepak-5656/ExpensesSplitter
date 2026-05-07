import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Users, PieChart } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/personal', icon: Wallet, label: 'Personal' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/analytics', icon: PieChart, label: 'Analytics' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-30 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <item.icon size={22} className={({ isActive }) => isActive ? 'fill-indigo-100' : ''} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
