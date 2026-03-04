import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import moment from 'moment';
import { Check, X } from 'lucide-react';

const AdminLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get('/leave/all');
            setLeaves(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        try {
            await axios.put(`/leave/approve/${id}`, { status });
            fetchLeaves(); // Refresh dataset
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating status');
        }
    };

    if (loading) return <div>Loading Requests...</div>;

    const pendingLeaves = leaves.filter(l => l.status === 'pending');
    const pastLeaves = leaves.filter(l => l.status !== 'pending');

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800">Manage Leave Requests</h2>

            {/* Pending Approvals */}
            <div className="glass-card p-6 md:p-8 border border-amber-200 bg-amber-50/20 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
                <h3 className="text-xl font-semibold mb-4 text-amber-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">{pendingLeaves.length}</span>
                    Action Required
                </h3>

                <div className="space-y-4">
                    {pendingLeaves.map(leave => (
                        <div key={leave._id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-amber-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition duration-300">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-extrabold text-slate-800 text-lg">{leave.userId?.name || 'Unknown Employee'}</h4>
                                    <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-md font-mono border border-slate-200">{leave.userId?.employeeId}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-3">
                                    <span className="uppercase text-xs tracking-wider text-indigo-500 font-bold">{leave.userId?.department || 'N/A'}</span>
                                </div>
                                <div className="text-indigo-700 bg-indigo-50/80 inline-block px-4 py-1.5 rounded-lg text-sm font-bold border border-indigo-100 shadow-inner">
                                    {moment(leave.fromDate).format('MMM DD, YYYY')} <span className="text-indigo-300 mx-2">➔</span> {moment(leave.toDate).format('MMM DD, YYYY')}
                                </div>
                                <div className="mt-4 p-4 bg-[#f8fafc] rounded-xl border border-slate-100 relative">
                                    <div className="absolute top-4 left-4 text-slate-300 text-4xl leading-none font-serif">"</div>
                                    <p className="text-slate-600 font-medium pl-6 relative z-10">{leave.reason}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 lg:flex-col min-w-[160px]">
                                <button onClick={() => handleApproval(leave._id, 'approved')} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition hover:-translate-y-0.5 shadow-sm shadow-emerald-500/30">
                                    <Check className="w-5 h-5" /> Approve
                                </button>
                                <button onClick={() => handleApproval(leave._id, 'rejected')} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition border border-rose-100 shadow-sm">
                                    <X className="w-5 h-5" /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                    {pendingLeaves.length === 0 && <p className="text-gray-500 italic">No pending leave requests at the moment.</p>}
                </div>
            </div>

            {/* Resolved History Table */}
            <div className="glass-card overflow-hidden shadow-lg flex flex-col relative">
                <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                    <h3 className="font-semibold text-slate-800 text-lg">Past Leave Requests</h3>
                </div>
                <div className="p-0 flex-1 overflow-x-auto w-full">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                            <tr>
                                <th className="py-4 px-6">Employee</th>
                                <th className="py-4 px-6">From</th>
                                <th className="py-4 px-6">To</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastLeaves.map((leave) => (
                                <tr key={leave._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-6 font-bold text-slate-800">
                                        {leave.userId?.name || 'Unknown'} <span className="text-slate-400 font-normal text-xs ml-2 font-mono">({leave.userId?.employeeId})</span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 font-medium text-sm">
                                        {moment(leave.fromDate).format('MMM DD, YYYY')}
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 font-medium text-sm">
                                        {moment(leave.toDate).format('MMM DD, YYYY')}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${leave.status === 'approved' ? 'bg-emerald-100/60 text-emerald-700' : 'bg-rose-100/60 text-rose-700'
                                            }`}>
                                            {leave.status ? leave.status : 'UNKNOWN'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {pastLeaves.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-400 font-medium">No past leave history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLeaves;
