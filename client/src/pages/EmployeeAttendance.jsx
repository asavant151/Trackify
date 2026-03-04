import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import moment from 'moment';

const EmployeeAttendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await axios.get('/attendance/my-records');
            setRecords(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">My Attendance History</h2>

            <div className="glass-card overflow-hidden shadow-lg border border-gray-100 flex flex-col w-full">
                <div className="p-0 flex-1 overflow-x-auto w-full">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50/80 text-gray-500 text-sm border-b">
                            <tr>
                                <th className="py-4 px-6 font-medium">Date</th>
                                <th className="py-4 px-6 font-medium">Punch In</th>
                                <th className="py-4 px-6 font-medium">Punch Out</th>
                                <th className="py-4 px-6 font-medium">Net Hours</th>
                                <th className="py-4 px-6 font-medium">Earned ($)</th>
                                <th className="py-4 px-6 font-medium">Penalty ($)</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record._id} className="border-b hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-gray-800 font-medium">
                                        {moment(record.date).format('MMMM DD, YYYY')}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {record.punchIn ? moment(record.punchIn).format('hh:mm A') : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {record.punchOut ? moment(record.punchOut).format('hh:mm A') : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {record.totalWorkHours ? record.totalWorkHours.toFixed(2) : '0'} hrs
                                    </td>
                                    <td className="py-4 px-6 font-bold text-indigo-600">
                                        {record.earnedSalary > 0 ? `$${record.earnedSalary.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-4 px-6 font-bold text-rose-500">
                                        {record.penaltyAmount > 0 ? `-$${record.penaltyAmount.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                                            record.status === 'Late' ? 'bg-rose-100 text-rose-700' :
                                                record.status === 'On Leave' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {record.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">No attendance records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAttendance;
