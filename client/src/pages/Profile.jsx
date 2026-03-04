import React, { useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Save, LayoutDashboard, KeyRound } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        parentPhone: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/auth/me');
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    parentPhone: data.parentPhone || '',
                    password: '',
                    confirmPassword: ''
                });

                // Stealthily update the old localstorage session to include the new data so it's fresh
                if (user && (!user.phone || !user.parentPhone)) {
                    updateUser({ ...user, ...data });
                }
            } catch (error) {
                console.error("Could not fetch fresh user data", error);
            }
        };

        if (user) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            return setErrorMsg('Passwords do not match');
        }

        setLoading(true);
        try {
            const body = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                parentPhone: formData.parentPhone,
            };

            if (formData.password) {
                body.password = formData.password;
            }

            const res = await axios.put('/auth/profile', body);
            updateUser(res.data);
            setSuccessMsg('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm glass-card border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            </div>

            <div className="glass-card shadow-xl border border-gray-100 p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100px] -z-10 pointer-events-none opacity-60"></div>

                {successMsg && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-indigo-500" /> Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-indigo-500" /> My Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="E.g. 9876543210"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-indigo-500" /> Parent / Emergency Phone <span className="text-xs text-indigo-500 font-normal ml-auto">(For WhatsApp)</span>
                            </label>
                            <input
                                type="text"
                                name="parentPhone"
                                value={formData.parentPhone}
                                onChange={handleChange}
                                placeholder="E.g. 9876543210"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-100">
                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-indigo-500" /> Change Password
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Must match new password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
