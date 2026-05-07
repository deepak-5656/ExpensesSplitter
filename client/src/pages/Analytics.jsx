import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#111111', '#333333', '#555555', '#777777', '#999999', '#bbbbbb', '#dddddd', '#eeeeee'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/personal');
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 text-slate-500 animate-pulse">Loading analytics...</div>;
  if (!data) return <div className="p-10 text-slate-500">No data available</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-normal text-black mb-1">Analytics</h1>
          <p className="text-slate-400 text-sm">Understand your total combined spending</p>
        </div>
      </div>

      <div className="bg-black text-white p-8 rounded-3xl shadow-lg">
        <p className="text-slate-400 text-sm font-medium tracking-widest mb-2 uppercase">Total Spent This Month</p>
        <p className="text-5xl font-light tracking-tight">₹{data.totalSpending.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)]">
          <h3 className="text-lg font-bold text-black mb-6">Spending by Category</h3>
          {data.categoryBreakdown.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {data.categoryBreakdown.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-sm font-medium text-slate-600 gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">No data for this month</div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)]">
          <h3 className="text-lg font-bold text-black mb-6">Monthly Trend</h3>
          {data.monthlyTrend.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrend}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="amount" fill="#000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-72 flex items-center justify-center text-slate-400">Not enough data to show trends</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
