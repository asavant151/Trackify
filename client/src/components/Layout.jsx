import React, { useContext, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, Clock, Calendar, Users, Activity, Menu, Bell, X, User } from 'lucide-react';

const Layout = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const navItems = user.role === 'admin'
        ? [
            { name: 'Dashboard', path: '/admin/dashboard', icon: <Activity className="w-5 h-5" /> },
            { name: 'Employees', path: '/admin/employees', icon: <Users className="w-5 h-5" /> },
            { name: 'Leave Requests', path: '/admin/leaves', icon: <Calendar className="w-5 h-5" /> },
            { name: 'My Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
        ]
        : [
            { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
            { name: 'My Attendance', path: '/attendance', icon: <Clock className="w-5 h-5" /> },
            { name: 'Apply Leave', path: '/leave', icon: <Calendar className="w-5 h-5" /> },
            { name: 'My Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
        ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Close Button Mobile */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors z-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-full h-40 bg-indigo-600/20 blur-3xl pointer-events-none"></div>

                <div className="p-8 relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white">Track<span className="text-indigo-400">ify</span></span>
                    </h1>
                    <div className="mt-8 px-2 py-1.5 bg-slate-800/50 rounded-lg inline-block border border-slate-700/50">
                        <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest">{user.role === 'admin' ? 'Workspace Admin' : 'Employee Portal'}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 relative z-10">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-indigo-600 shadow-md shadow-indigo-600/20 text-white'
                                    : 'hover:bg-slate-800/80 hover:text-white'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full -ml-4"></div>
                                )}
                                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-300 transition-colors'}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 relative z-10 mb-2">
                    <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-semibold text-sm text-white truncate">{user.name}</span>
                                <span className="text-xs text-slate-400 truncate">{user.email}</span>
                            </div>
                            <button onClick={logout} className="p-2 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-colors text-slate-400" title="Log out">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden h-full">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm px-6 lg:px-8 flex justify-between items-center z-30 sticky top-0 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:block">
                            <h2 className="text-xl font-bold text-slate-800">Welcome back, {user.name.split(' ')[0]} 👋</h2>
                            <p className="text-sm text-slate-500 font-medium">Here's what's happening today.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <Link to="/profile" className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold group-hover:scale-105 transition-transform">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Render Views */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] relative w-full flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none z-0"></div>

                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto relative z-10 w-full flex-1">
                        <Outlet />
                    </div>

                    <footer className="mt-auto border-t border-slate-200 bg-white/50 backdrop-blur-md px-6 py-5 z-10 relative">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                            <p className="text-sm font-medium text-slate-500">
                                &copy; {new Date().getFullYear()} Trackify <span className="text-slate-400 font-normal">Attendance Management System. All rights reserved.</span>
                            </p>
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Layout;
