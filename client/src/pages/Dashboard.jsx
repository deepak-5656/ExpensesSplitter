import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import GroupCard from '../components/GroupCard';
import ExpenseCard from '../components/ExpenseCard';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [groupsRes, expensesRes] = await Promise.all([
          api.get('/groups'),
          api.get('/personal/expenses')
        ]);
        
        setGroups(groupsRes.data.slice(0, 3));
        setRecentExpenses(expensesRes.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-40 bg-slate-200 rounded-2xl w-full"></div>
      <div className="flex gap-4"><div className="h-32 bg-slate-200 rounded-2xl flex-1"></div></div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-normal text-black mb-1">Dashboard</h1>
          <p className="text-slate-400 text-sm">Here's what's happening with your expenses.</p>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-normal text-black">Your Groups</h2>
          <Link to="/groups" className="text-slate-400 hover:text-black text-sm transition-colors border-b border-transparent hover:border-black pb-0.5">See all</Link>
        </div>
        
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-slate-400" />
            </div>
            <h3 className="font-semibold text-black">No groups yet</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">Create a group to start splitting bills with friends.</p>
            <Link to="/groups" className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-[#111] transition-colors">
              Create Group
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-normal text-black">Recent Personal Expenses</h2>
          <Link to="/personal" className="text-slate-400 hover:text-black text-sm transition-colors border-b border-transparent hover:border-black pb-0.5">See all</Link>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-slate-100">
          {recentExpenses.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No recent expenses found.</p>
          ) : (
            recentExpenses.map(expense => (
              <ExpenseCard key={expense._id} expense={expense} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
