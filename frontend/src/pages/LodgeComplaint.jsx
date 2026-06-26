import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LodgeComplaint = () => {
  const [formData, setFormData] = useState({
    category: 'Municipal Corporation', subCategory: '', description: '', location: '', urgencyLevel: 'Medium'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/complaints', formData);
      setSuccess('Complaint lodged successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to lodge complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-card/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Lodge a New Complaint</h2>
          <p className="text-gray-400 mb-8">Please provide details about the issue so we can assign the right department.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl text-sm">{success}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Department / Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none appearance-none">
                  <option value="Municipal Corporation">Municipal Corporation</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Police">Police</option>
                  <option value="Water Department">Water Department</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Sub-Category (e.g. Leakage)</label>
                <input name="subCategory" type="text" onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none placeholder-gray-600" placeholder="Optional details..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Location *</label>
                <input name="location" type="text" required onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none placeholder-gray-600" placeholder="Street, City, Landmark" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Urgency Level</label>
                <select name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none appearance-none">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Description of Issue *</label>
              <textarea name="description" required rows="5" onChange={handleChange} className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white outline-none placeholder-gray-600 resize-none" placeholder="Please describe the problem in detail..."></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button type="submit" disabled={loading} className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-[0_0_20px_rgba(108,99,255,0.3)] disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3.5 rounded-xl font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LodgeComplaint;
