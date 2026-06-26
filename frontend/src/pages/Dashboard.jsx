import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const endpoint = user.role === 'user' ? '/complaints/my' : '/complaints';
        const res = await api.get(endpoint);
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, [user.role]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {user.role === 'user' ? 'My Complaints' : 'Assigned Complaints'}
          </h1>
          <p className="text-gray-400 mt-1">Manage and track your service requests</p>
        </div>
        
        {user.role === 'user' && (
          <button 
            onClick={() => navigate('/lodge-complaint')}
            className="px-6 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-[0_0_20px_rgba(3,218,198,0.3)] hover:scale-105"
          >
            + Lodge New Complaint
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-card/30 rounded-2xl border border-white/5">
            <p className="text-gray-400">No complaints found. {user.role === 'user' && "Lodge one to get started!"}</p>
          </div>
        ) : (
          complaints.map(complaint => (
            <div 
              key={complaint._id}
              onClick={() => navigate(`/complaint/${complaint._id}`)}
              className="group bg-card/80 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-card hover:border-white/10 transition-all cursor-pointer hover:-translate-y-1 shadow-lg hover:shadow-primary/10"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-gray-500 bg-dark px-2 py-1 rounded">
                  {complaint.trackingNumber}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                {complaint.category}
              </h3>
              
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                {complaint.description}
              </p>
              
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {complaint.location}
                </div>
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
