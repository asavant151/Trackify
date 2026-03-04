import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Mail, Phone, Hash, Settings, X, Save } from 'lucide-react';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('/auth/users');
            setEmployees(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Employees...</div>;

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`/auth/employee/${editingEmployee._id}`, {
                shiftStart: editingEmployee.shiftStart,
                shiftEnd: editingEmployee.shiftEnd,
                hourlyRate: Number(editingEmployee.hourlyRate),
                latePenaltyRate: Number(editingEmployee.latePenaltyRate)
            });
            fetchEmployees();
            setEditingEmployee(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating settings');
        } finally {
            setSaving(false);
        }
    };

    const employeeList = employees.filter(e => e.role === 'employee');

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Employees</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employeeList.map((emp) => (
                    <div key={emp._id} className="glass-card p-6 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold text-xl shadow-inner border-2 border-white group-hover:scale-110 transition-transform">
                                {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{emp.name}</h3>
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{emp.department || 'General'}</p>
                            </div>
                        </div>

                        <div className="space-y-3.5 mt-5">
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                    <Hash className="w-4 h-4" />
                                </div>
                                <span className="font-mono font-semibold text-slate-700 bg-slate-100/50 px-2 py-1 rounded-md text-xs border border-slate-200">{emp.employeeId}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="font-medium truncate">{emp.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="font-medium">{emp.phone || 'Not Provided'}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between gap-3">
                            <button onClick={() => setEditingEmployee(emp)} className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors border border-slate-200 hover:border-indigo-600 shadow-sm">
                                <Settings className="w-4 h-4" /> Settings
                            </button>
                            <button className="flex-1 py-2.5 text-sm bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-600 hover:text-white transition-colors border border-rose-100 hover:border-rose-600 shadow-sm">Remove</button>
                        </div>
                    </div>
                ))}

                {employeeList.length === 0 && (
                    <div className="col-span-full text-center py-10 glass-card">
                        <p className="text-gray-500">No employees found in the system.</p>
                    </div>
                )}
            </div>

            {/* Modal for Setting Shift and Salary */}
            {editingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">Advanced Settings</h3>
                            <button onClick={() => setEditingEmployee(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Shift Start</label>
                                    <input type="time" required value={editingEmployee.shiftStart || '09:00'} onChange={(e) => setEditingEmployee({ ...editingEmployee, shiftStart: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Shift End</label>
                                    <input type="time" required value={editingEmployee.shiftEnd || '17:00'} onChange={(e) => setEditingEmployee({ ...editingEmployee, shiftEnd: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Hourly Salary Rate ($)</label>
                                    <input type="number" min="0" step="0.01" value={editingEmployee.hourlyRate || 0} onChange={(e) => setEditingEmployee({ ...editingEmployee, hourlyRate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Late Penalty ($ Flat)</label>
                                    <input type="number" min="0" step="0.01" value={editingEmployee.latePenaltyRate || 0} onChange={(e) => setEditingEmployee({ ...editingEmployee, latePenaltyRate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium pt-3" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setEditingEmployee(null)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className={`flex-1 px-4 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 ${saving ? 'opacity-70 cursor-wait' : ''}`}>
                                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />} Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEmployees;
