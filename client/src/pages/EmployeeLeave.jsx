import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import moment from 'moment';

const EmployeeLeave = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get('/leave/my-leaves');
            setLeaves(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/leave/apply', formData);
            setFormData({ fromDate: '', toDate: '', reason: '' });
            setShowForm(false);
            fetchLeaves(); // Refresh
        } catch (err) {
            alert(err.response?.data?.message || 'Error applying leave');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm glass-card mb-6 border border-gray-100 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Leave Applications</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-md"
                >
                    {showForm ? 'Cancel Application' : 'Apply for Leave'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card p-6 border border-gray-100 shadow-lg animate-fade-in mb-6 bg-indigo-50/30">
                    <h3 className="text-xl font-semibold text-indigo-900 mb-4">Leave Application Form</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">From Date</label>
                                <input
                                    name="fromDate" type="date" value={formData.fromDate} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">To Date</label>
                                <input
                                    name="toDate" type="date" value={formData.toDate} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Reason</label>
                            <textarea
                                name="reason" value={formData.reason} onChange={handleChange} rows="3"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" required
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-transform hover:scale-[1.02]">
                            Submit Request
                        </button>
                    </form>
                </div>
            )}

            <div className="glass-card overflow-hidden shadow-lg border border-gray-100 flex flex-col w-full">
                <div className="p-0 flex-1 overflow-x-auto w-full">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50/80 text-gray-500 text-sm border-b">
                            <tr>
                                <th className="py-4 px-6 font-medium">Applied On</th>
                                <th className="py-4 px-6 font-medium">From Date</th>
                                <th className="py-4 px-6 font-medium">To Date</th>
                                <th className="py-4 px-6 font-medium">Reason</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave._id} className="border-b hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-gray-600 text-sm">
                                        {moment(leave.createdAt).format('MMMM DD, YYYY')}
                                    </td>
                                    <td className="py-4 px-6 text-gray-800 font-medium">
                                        {moment(leave.fromDate).format('MM/DD/YYYY')}
                                    </td>
                                    <td className="py-4 px-6 text-gray-800 font-medium">
                                        {moment(leave.toDate).format('MM/DD/YYYY')}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 truncate max-w-xs" title={leave.reason}>
                                        {leave.reason}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                            leave.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {leave.status ? leave.status.toUpperCase() : 'PENDING'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {leaves.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">No leave requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLeave;
