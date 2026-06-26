import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user', contactInfo: '', address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      
      <div className="max-w-2xl w-full space-y-8 bg-card/80 backdrop-blur-xl p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10 animate-slide-up">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join ResolveHub to lodge and track complaints</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl text-sm text-center">{success}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Full Name *</label>
              <input name="name" type="text" required onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Email Address *</label>
              <input name="email" type="email" required onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Password *</label>
              <input name="password" type="password" required minLength="6" onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Register As</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none appearance-none">
                <option value="user" className="bg-dark">Citizen / User</option>
                <option value="agent" className="bg-dark">Department Agent</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Phone Number</label>
              <input name="contactInfo" type="text" onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">City / Location</label>
              <input name="address" type="text" onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-[0_0_20px_rgba(108,99,255,0.3)]">
            {loading ? 'Processing...' : 'Create Account'}
          </button>
          
          <p className="text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-secondary hover:text-white">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
