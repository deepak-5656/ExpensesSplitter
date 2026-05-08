import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import ExpenseCard from '../components/ExpenseCard';
import AddExpenseModal from '../components/AddExpenseModal';
import QRModal from '../components/QRModal';
import { Share2, Users, ArrowLeft, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [balances, setBalances] = useState({});
  
  // QR Payment State
  const [qrTargetUser, setQrTargetUser] = useState(null);
  const [qrAmount, setQrAmount] = useState(0);
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    let socket;
    const fetchGroupData = async () => {
      try {
        const [groupRes, expensesRes] = await Promise.all([
          api.get(`/groups/${id}`),
          api.get(`/expenses/group/${id}`)
        ]);
        setGroup(groupRes.data);
        setExpenses(expensesRes.data);
      } catch (error) {
        toast.error('Failed to load group details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupData();

    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.emit('join_group', id);
    
    socket.on('expense:added', (newExpense) => {
      setExpenses((prev) => [newExpense, ...prev]);
    });
    
    socket.on('member:joined', (data) => {
      setGroup((prev) => ({...prev, members: [...prev.members, data.user]}));
      toast.success(`${data.user.name} joined the group!`);
    });

    return () => {
      if (socket) {
        socket.emit('leave_group', id);
        socket.disconnect();
      }
    };
  }, [id]);

  useEffect(() => {
    if (!group || !expenses) return;
    
    const newBalances = {};
    group.members.forEach(m => newBalances[m._id] = 0);

    expenses.forEach(exp => {
      if (newBalances[exp.paidBy?._id] !== undefined) {
        newBalances[exp.paidBy._id] += exp.amount;
      }
      exp.splitAmong.forEach(split => {
        if (newBalances[split.user?._id] !== undefined) {
          newBalances[split.user._id] -= split.share;
        }
      });
    });

    setBalances(newBalances);
  }, [expenses, group]);

  const handleAddExpense = useCallback(async (expenseData) => {
    try {
      await api.post('/expenses', { ...expenseData, groupId: id });
      toast.success('Expense added successfully');
      setIsExpenseModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  }, [id]);

  const handleDeleteExpense = useCallback(async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${expenseId}`);
        setExpenses(prev => prev.filter(e => e._id !== expenseId));
        toast.success('Expense deleted');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete expense');
      }
    }
  }, []);

  const handleInvite = useCallback(async () => {
    try {
      // Show generic invite link
      const res = await api.get(`/groups/${id}/invite-link`);
      navigator.clipboard.writeText(res.data.inviteLink);
      toast.success('Invite link copied to clipboard! Share it with friends.', { duration: 5000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate invite');
    }
  }, [id]);

  const openQrPayment = (targetMember, amount) => {
    setQrTargetUser(targetMember);
    setQrAmount(amount);
  };

  const handleSettle = async () => {
    if (!qrTargetUser || qrAmount <= 0) return;
    try {
      setIsSettling(true);
      
      const settlementData = {
        title: `Payment to ${qrTargetUser.name}`,
        amount: qrAmount,
        category: 'General',
        paidBy: user._id,
        splitAmong: [
          {
            user: qrTargetUser._id,
            share: qrAmount,
            percentage: 100
          }
        ],
        groupId: id
      };

      await api.post('/expenses', settlementData);
      toast.success(`Successfully recorded payment to ${qrTargetUser.name}!`);
      setQrTargetUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record settlement');
    } finally {
      setIsSettling(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8 p-10 max-w-6xl mx-auto">
        <div className="h-40 bg-slate-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (!group) return <div className="text-center py-20 text-slate-500">Group not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-sm border border-slate-200">
            {group.emoji || '👥'}
          </div>
          <div>
            <h1 className="text-3xl font-normal text-black mb-1">{group.name}</h1>
            <p className="text-slate-400 text-sm flex items-center gap-1.5"><Users size={14}/> {group.members?.length || 0} members</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleInvite}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <Share2 size={18} /> Invite
          </button>
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-6 py-2.5 rounded-xl border border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
          >
            Add expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Expenses */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-normal text-black">Recent expenses</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-slate-100">
            {expenses.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No expenses yet. Add one to get started!</div>
            ) : (
              expenses.map(expense => (
                <ExpenseCard 
                  key={expense._id} 
                  expense={expense} 
                  onDelete={handleDeleteExpense}
                  currentUserId={user?._id}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Balances */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="font-bold text-black mb-4">Group Balances</h3>
            <div className="space-y-4">
              {group.members.map(member => {
                const balance = balances[member._id] || 0;
                const isOwedMoney = balance > 0;
                
                return (
                  <div key={member._id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-black text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-black">{member.name} {member._id === user?._id && '(You)'}</span>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <div className={`text-sm font-bold ${balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        {balance > 0 ? `+₹${balance.toFixed(2)}` : balance < 0 ? `-₹${Math.abs(balance).toFixed(2)}` : 'Settled'}
                      </div>
                      
                      {/* Show QR Payment Button if they are owed money and it's not the logged-in user */}
                      {isOwedMoney && member._id !== user?._id && (
                        <button
                          onClick={() => openQrPayment(member, balance)}
                          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-slate-100 hover:bg-black hover:text-white text-slate-600 px-2 py-1 rounded transition-colors"
                        >
                          <QrCode size={12} /> Pay
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button 
            onClick={handleInvite}
            className="w-full sm:hidden flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
          >
            <Share2 size={18} /> Invite friends
          </button>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
        onAdd={handleAddExpense}
        members={group.members}
        currentUser={user}
      />

      <QRModal 
        isOpen={!!qrTargetUser} 
        onClose={() => setQrTargetUser(null)}
        targetUser={qrTargetUser}
        amount={qrAmount}
        onSettle={handleSettle}
        isSettling={isSettling}
      />
    </div>
  );
};

export default GroupDetail;
