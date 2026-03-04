import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Users, UserX, UserCheck, Search, Download, Clock, Eye, MapPin, Globe, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const attRes = await axios.get('/attendance/all');
            setAttendance(attRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Admin Dashboard...</div>;

    const today = moment().startOf('day');
    const todayAttendance = attendance.filter(r => moment(r.date).isSame(today, 'day'));

    const presentCount = todayAttendance.filter(r => r.status === 'Present').length;
    const lateCount = todayAttendance.filter(r => r.status === 'Late').length;
    const onLeaveCount = todayAttendance.filter(r => r.status === 'On Leave').length;

    const chartData = [
        { name: 'Present', count: presentCount },
        { name: 'Late', count: lateCount },
        { name: 'On Leave', count: onLeaveCount },
    ];

    const exportCSV = () => {
        const headers = ['Employee Name', 'Date', 'Punch In', 'Punch Out', 'Net Hours', 'Earned Salary ($)', 'Penalty ($)', 'Status', 'IP Address', 'Location'];

        const rows = attendance.map(record => {
            const name = record.userId?.name || 'Unknown';
            const date = moment(record.date).format('YYYY-MM-DD');
            const punchIn = record.punchIn ? moment(record.punchIn).format('hh:mm A') : '-';
            const punchOut = record.punchOut ? moment(record.punchOut).format('hh:mm A') : '-';
            const netHours = record.totalWorkHours ? record.totalWorkHours.toFixed(2) : '0';
            const earned = record.earnedSalary ? record.earnedSalary.toFixed(2) : '0';
            const penalty = record.penaltyAmount ? record.penaltyAmount.toFixed(2) : '0';
            const status = record.status || 'Pending';
            const ip = record.ipAddress || 'N/A';
            const loc = record.location ? `${record.location.latitude}, ${record.location.longitude}` : 'N/A';

            // wrap in quotes to prevent issue with commas in names just in case
            return [`"${name}"`, `"${date}"`, `"${punchIn}"`, `"${punchOut}"`, netHours, earned, penalty, `"${status}"`, `"${ip}"`, `"${loc}"`].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_export_${moment().format('YYYYMMDD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Company Overview</h2>
                    <p className="text-slate-500 font-medium">Here's what is happening across your workforce today.</p>
                </div>
            </div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Today Present</p>
                            <h3 className="text-4xl font-extrabold text-slate-800">{presentCount}</h3>
                        </div>
                        <div className="p-3 bg-indigo-100/50 rounded-2xl text-indigo-600">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Late Arrivals</p>
                            <h3 className="text-4xl font-extrabold text-slate-800">{lateCount}</h3>
                        </div>
                        <div className="p-3 bg-rose-100/50 rounded-2xl text-rose-600">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">On Leave</p>
                            <h3 className="text-4xl font-extrabold text-slate-800">{onLeaveCount}</h3>
                        </div>
                        <div className="p-3 bg-amber-100/50 rounded-2xl text-amber-600">
                            <UserX className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Logs</p>
                            <h3 className="text-4xl font-extrabold text-slate-800">{attendance.length}</h3>
                        </div>
                        <div className="p-3 bg-emerald-100/50 rounded-2xl text-emerald-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="glass-card p-6 lg:col-span-1 shadow-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-6 text-xl">Today's Overview</h3>
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Attendance Table */}
                <div className="glass-card lg:col-span-2 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
                        <h3 className="font-semibold text-slate-800 text-lg">Recent Attendance</h3>
                        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors font-medium text-sm">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                    <div className="p-0 flex-1 overflow-x-auto w-full">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50/80 text-gray-500 text-sm border-b">
                                <tr>
                                    <th className="py-4 px-6 font-medium">Employee</th>
                                    <th className="py-4 px-6 font-medium">Date</th>
                                    <th className="py-4 px-6 font-medium">Punch In</th>
                                    <th className="py-4 px-6 font-medium">Punch Out</th>
                                    <th className="py-4 px-6 font-medium">Status</th>
                                    <th className="py-4 px-6 font-medium text-center">Tracking</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.slice(0, 10).map((record) => (
                                    <tr key={record._id} className="border-b hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-gray-800">
                                            {record.userId?.name || 'Unknown'}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {moment(record.date).format('MMM DD, YYYY')}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {record.punchIn ? moment(record.punchIn).format('hh:mm A') : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {record.punchOut ? moment(record.punchOut).format('hh:mm A') : '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${record.status === 'Present' ? 'bg-emerald-100/60 text-emerald-700' :
                                                record.status === 'Late' ? 'bg-rose-100/60 text-rose-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {record.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {(record.location || record.ipAddress) ? (
                                                <button
                                                    onClick={() => setSelectedRecord(record)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-block"
                                                    title="View Tracking Data"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {attendance.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for Tracking Data */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col pt-6 pb-6 relative">
                        <button
                            onClick={() => setSelectedRecord(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="px-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Verification Data</h3>
                            <p className="text-sm text-gray-500">{selectedRecord.userId?.name} on {moment(selectedRecord.date).format('MMM DD, YYYY')}</p>
                        </div>

                        <div className="px-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                                    <p className="text-xs font-semibold text-indigo-600 mb-1 flex items-center uppercase tracking-wider">
                                        <Globe className="w-3.5 h-3.5 mr-1" /> IP Address
                                    </p>
                                    <p className="text-sm font-medium text-slate-800 break-all">{selectedRecord.ipAddress || 'Not Recorded'}</p>
                                </div>

                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                                    <p className="text-xs font-semibold text-emerald-600 mb-1 flex items-center uppercase tracking-wider">
                                        <MapPin className="w-3.5 h-3.5 mr-1" /> GPS Location
                                    </p>
                                    {selectedRecord.location ? (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${selectedRecord.location.latitude},${selectedRecord.location.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-emerald-700 hover:underline inline-flex items-center"
                                        >
                                            View on Map <span className="ml-1 text-[10px]">↗</span>
                                        </a>
                                    ) : (
                                        <p className="text-sm font-medium text-slate-800">Not Recorded</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 mt-6 pt-4 border-t border-slate-100">
                            <button onClick={() => setSelectedRecord(null)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-600/30">
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
