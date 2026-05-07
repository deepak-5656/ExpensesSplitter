import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const JoinGroup = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [status, setStatus] = useState('joining'); // 'joining', 'success', 'error'
  const [message, setMessage] = useState('Joining group...');

  useEffect(() => {
  
    if (!authLoading && !user) {
      setStatus('error');
      setMessage('Please log in or register first to join the group.');
      localStorage.setItem('inviteToken', token);
      return;
    }

    if (user && token) {
      joinGroupWithToken();
    }
  }, [user, authLoading, token]);

  const joinGroupWithToken = async () => {
    try {
      const res = await api.get(`/groups/join/${token}`);
      setStatus('success');
      setMessage('Successfully joined the group!');
      toast.success('Successfully joined the group!');
      
      // Redirect to the group after a short delay
      setTimeout(() => {
        navigate(`/groups/${res.data.groupId}`);
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Invalid or expired invite link.');
      toast.error(error.response?.data?.message || 'Failed to join group');
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        
        {status === 'joining' && (
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Joining Group...</h2>
            <p className="text-slate-500">Please wait while we add you to the group.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Success!</h2>
            <p className="text-slate-500 mt-2">{message}</p>
            <p className="text-sm text-slate-400 mt-4">Redirecting you to the group...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-3xl">
              !
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Oops!</h2>
            <p className="text-slate-500 mt-2">{message}</p>
            
            {!user ? (
               <div className="mt-6 space-y-3">
                 <Link to="/login" className="block w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors">
                   Log In
                 </Link>
                 <Link to="/register" className="block w-full border border-indigo-600 text-indigo-600 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                   Register Account
                 </Link>
               </div>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default JoinGroup;
