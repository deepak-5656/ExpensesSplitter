import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, PieChart, CheckSquare, Wallet, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Groups', icon: Users, path: '/groups', badge: 3 },
    { name: 'Personal', icon: UserCircle, path: '/personal' },
  ];

  const reportItems = [
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
    { name: 'Settlements', icon: CheckSquare, path: '/settlements' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-black text-white rounded-xl shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-[#0a0a0a] text-slate-400 flex flex-col z-50 border-r border-[#222]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black">
              <Wallet size={20} className="fill-current" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight leading-tight">SplitSmart</h1>
              <p className="text-xs text-slate-500">Expense splitter</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {/* Menu Section */}
          <div>
            <p className="text-xs font-bold text-slate-600 mb-3 px-2 tracking-wider">MENU</p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-black font-semibold shadow-sm' 
                        : 'hover:bg-[#1f1f1f] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isActive ? 'text-black' : 'text-slate-500'} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isActive ? 'bg-slate-200 text-black' : 'bg-[#1f1f1f] text-slate-400'
                        }`}>
                          {item.badge}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Reports Section */}
          <div>
            <p className="text-xs font-bold text-slate-600 mb-3 px-2 tracking-wider">REPORTS</p>
            <div className="space-y-1">
              {reportItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-black font-semibold shadow-sm' 
                        : 'hover:bg-[#1f1f1f] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className={isActive ? 'text-black' : 'text-slate-500'} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[#222]">
          <NavLink to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1f1f1f] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#1f1f1f] flex items-center justify-center text-white font-bold text-sm border border-[#333]">
              ME
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-medium text-sm truncate">My Profile</p>
              <p className="text-xs text-slate-500 truncate">View settings</p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
