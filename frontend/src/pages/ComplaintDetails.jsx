import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ChatBox from '../components/ChatBox';

const ComplaintDetails = ({ user }) => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaint();
  }, [id]);

  if (!complaint) return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/complaints/${id}/status`, { status: newStatus });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="group flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-6"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path></svg>
        Back to Dashboard
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Complaint Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Complaint Info</h2>
                  <p className="text-gray-500 font-mono text-sm mt-1">{complaint.trackingNumber}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</h4>
                  <p className="text-white font-medium">{complaint.category}</p>
                  {complaint.subCategory && <p className="text-sm text-gray-400 mt-1">{complaint.subCategory}</p>}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</h4>
                  <p className="text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {complaint.location}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</h4>
                  <div className="bg-dark/50 p-4 rounded-xl border border-white/5">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
                  </div>
                </div>

                {/* Agent Actions */}
                {user.role === 'agent' && (
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent Actions</h4>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleStatusChange('In Progress')}
                        className="flex-1 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-sm font-semibold transition-all"
                      >
                        Mark In Progress
                      </button>
                      <button 
                        onClick={() => handleStatusChange('Resolved')}
                        className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-sm font-semibold transition-all"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Chat Box */}
        <div className="lg:col-span-7 h-[600px] lg:h-[calc(100vh-10rem)]">
          <ChatBox complaintId={id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
