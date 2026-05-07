import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ExpenseCard from '../components/ExpenseCard';
import AddExpenseModal from '../components/AddExpenseModal';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const PersonalExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/personal/expenses');
      setExpenses(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch expenses');
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const res = await api.post('/personal/expenses', expenseData);
      setExpenses([res.data, ...expenses]);
      toast.success('Expense added successfully');
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/personal/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
      toast.success('Expense deleted');
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Personal Expenses</h1>
          <p className="text-slate-500">Track your individual spending</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center"
        >
          <Plus size={24} />
          <span className="ml-2 hidden sm:block font-medium">Add Expense</span>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl w-full"></div>)}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-4">No personal expenses yet.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 font-medium hover:underline"
          >
            Add your first expense
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.map(expense => (
            <ExpenseCard 
              key={expense._id} 
              expense={expense} 
              onDelete={handleDeleteExpense} 
              currentUserId={expense.user}
            />
          ))}
        </div>
      )}

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddExpense} 
      />
    </div>
  );
};

export default PersonalExpenses;
