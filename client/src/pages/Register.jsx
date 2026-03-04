import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Clock, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employeeId: '',
        department: '',
        phone: '',
        parentPhone: ''
    });
    const [error, setError] = useState('');

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(formData);
        if (res.success) {
            if (res.role === 'admin') navigate('/admin/dashboard');
            else navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 relative overflow-hidden py-10 lg:py-0">
            {/* Background elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-soft"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

            <div className="flex w-full max-w-4xl mx-auto z-10 p-4 relative justify-center items-center">

                {/* Registration Form */}
                <div className="w-full bg-white/80 backdrop-blur-2xl p-8 lg:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white relative animate-fade-in-up">

                    <div className="flex flex-col items-center justify-center mb-10">
                        <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                            Create Account
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 text-center">Join Trackify and streamline your workspace.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="name">Full Name</label>
                                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="input-field py-2.5" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="employeeId">Employee ID</label>
                                <input id="employeeId" name="employeeId" type="text" value={formData.employeeId} onChange={handleChange} className="input-field py-2.5" placeholder="EMP-123" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="email">Email Address</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="input-field py-2.5" placeholder="name@company.com" required />
                        </div>

                        <div>
                            <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="input-field py-2.5" placeholder="••••••••" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="role">Role</label>
                                <select id="role" name="role" value={formData.role} onChange={handleChange} className="input-field py-2.5 appearance-none bg-white">
                                    <option value="employee">Employee</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="department">Department</label>
                                <input id="department" name="department" type="text" value={formData.department} onChange={handleChange} className="input-field py-2.5" placeholder="Engineering, HR, etc." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="phone">Phone Number</label>
                                <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} className="input-field py-2.5" placeholder="+1..." />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="parentPhone">Emergency / Parent Phone</label>
                                <input id="parentPhone" name="parentPhone" type="text" value={formData.parentPhone} onChange={handleChange} className="input-field py-2.5" placeholder="WhatsApp Number" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center gap-2 mt-8 py-3 text-[0.95rem]"
                        >
                            Sign Up
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-8">
                        <p className="text-slate-500 font-medium text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                Sign In here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
