import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Clock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            if (res.role === 'admin') navigate('/admin/dashboard');
            else navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

            <div className="flex w-full max-w-7xl mx-auto z-10 p-4 lg:p-12">
                {/* Left Side - Graphics (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-col flex-1 justify-center p-16 animate-fade-in-up">
                    <div className="mb-12 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                            Track<span className="text-indigo-600">ify</span>
                        </h1>
                    </div>

                    <h2 className="text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                        Smart <span className="text-gradient">Attendance</span><br /> Management
                    </h2>
                    <p className="text-xl text-slate-500 max-w-md font-medium leading-relaxed">
                        Streamline your workflow with real-time tracking, automated reporting, and seamless integration.
                    </p>

                    {/* Floating Graphic Element */}
                    <div className="mt-16 w-80 h-48 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 relative animate-float">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-indigo-400 to-violet-400 rounded-full blur-[40px] -z-10 opacity-60"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                            <div className="space-y-2">
                                <div className="w-24 h-2.5 bg-slate-200 rounded-full"></div>
                                <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full h-2.5 bg-slate-200 rounded-full"></div>
                            <div className="w-4/5 h-2.5 bg-slate-200 rounded-full"></div>
                            <div className="w-full h-8 bg-indigo-50 rounded-xl mt-4 border border-indigo-100"></div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex flex-col justify-center items-center lg:items-end w-full">
                    <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                        <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                                Track<span className="text-indigo-600">ify</span>
                            </h1>
                        </div>

                        <div className="mb-10 text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back 👋</h3>
                            <p className="text-slate-500 font-medium">Please enter your credentials to access your account.</p>
                        </div>

                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    required
                                />
                                <div className="flex justify-end mt-2">
                                    <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">Forgot password?</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary flex items-center justify-center gap-2 mt-4 py-3.5 text-[0.95rem]"
                            >
                                Sign in to workspace
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 font-medium text-sm">
                                New to Trackify?{' '}
                                <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
