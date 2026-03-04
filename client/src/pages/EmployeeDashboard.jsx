import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Play, Square, Coffee, CheckCircle, Clock, Activity, DollarSign, AlertCircle, MapPin } from 'lucide-react';
import moment from 'moment';

const EmployeeDashboard = () => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState(null);

    useEffect(() => {
        fetchTodayRecord();
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                (err) => console.error("Error getting location: ", err)
            );
        }

        return () => clearInterval(interval);
    }, []);

    const fetchTodayRecord = async () => {
        try {
            const res = await axios.get('/attendance/my-records');
            const today = moment().startOf('day');
            const todayRecord = res.data.find(r => moment(r.date).isSame(today, 'day'));
            setRecord(todayRecord || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePunchIn = async () => {
        try {
            await axios.post('/attendance/punch-in', { location });
            fetchTodayRecord();
        } catch (err) {
            alert(err.response?.data?.message || 'Error executing action');
        }
    };

    const handleAction = async (actionUrl) => {
        try {
            await axios.post(`/attendance/${actionUrl}`);
            fetchTodayRecord();
        } catch (err) {
            alert(err.response?.data?.message || 'Error executing action');
        }
    };

    const isPunchedIn = record && record.punchIn;
    const isPunchedOut = record && record.punchOut;
    const isOnBreak = record && record.breaks && record.breaks.some(b => !b.breakEnd);

    // Dynamic work hours and break time calculations
    let displayWorkHours = '0h 0m';
    if (record?.totalWorkHours) {
        const totalMins = Math.round(record.totalWorkHours * 60);
        displayWorkHours = `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
    }
    let displayBreakTime = record?.totalBreakTime || 0;
    let displayEarnedSalary = record?.earnedSalary ? record.earnedSalary.toFixed(2) : '0.00';
    let displayPenaltyAmount = record?.penaltyAmount ? record.penaltyAmount.toFixed(2) : '0.00';

    if (isPunchedIn && !isPunchedOut) {
        let activeBreakMins = 0;
        if (isOnBreak && record.breaks) {
            const openBreak = record.breaks.find(b => !b.breakEnd);
            if (openBreak) {
                activeBreakMins = moment(currentTime).diff(moment(openBreak.breakStart), 'minutes');
            }
        }

        displayBreakTime = (record?.totalBreakTime || 0) + activeBreakMins;

        const grossMins = moment(currentTime).diff(moment(record.punchIn), 'minutes');
        const netMins = grossMins - displayBreakTime;

        let netHours = 0;
        let finalDisplayString = '0h 0m';
        if (netMins > 0) {
            netHours = netMins / 60;
            const hoursPart = Math.floor(netMins / 60);
            const minsPart = netMins % 60;
            finalDisplayString = `${hoursPart}h ${minsPart}m`;
        }
        displayWorkHours = finalDisplayString;

        if (user && user.hourlyRate) {
            let grossSal = netHours * user.hourlyRate;
            let penalty = record?.penaltyAmount || 0;
            displayPenaltyAmount = penalty.toFixed(2);
            let netSal = Math.max(0, grossSal - penalty);
            displayEarnedSalary = netSal.toFixed(2);
        } else if (record?.penaltyAmount) {
            displayPenaltyAmount = record.penaltyAmount.toFixed(2);
        }
    }

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Overview</h2>
                    <p className="text-slate-500 font-medium">Keep track of your daily attendance progress.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Current Time</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">{moment(currentTime).format('hh:mm A')}</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">{moment(currentTime).format('dddd, MMMM Do YYYY')}</p>
                        </div>
                        <div className="p-3 bg-indigo-100/50 rounded-2xl text-indigo-600">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Current Status</p>
                            <h3 className={`text-2xl font-extrabold ${isPunchedOut ? 'text-slate-800' : isOnBreak ? 'text-amber-600' : isPunchedIn ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {isPunchedOut ? 'Punched Out' : isOnBreak ? 'On Break' : isPunchedIn ? 'Working' : 'Not Started'}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-2xl ${isPunchedOut ? 'bg-slate-100 text-slate-600' : isOnBreak ? 'bg-amber-100/50 text-amber-600' : isPunchedIn ? 'bg-emerald-100/50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {isPunchedIn && !isPunchedOut && !isOnBreak ? <Activity className="w-6 h-6 animate-pulse" /> : <CheckCircle className="w-6 h-6" />}
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Break Time</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">{displayBreakTime} <span className="text-lg font-medium text-slate-500">mins</span></h3>
                        </div>
                        <div className="p-3 bg-amber-100/50 rounded-2xl text-amber-600">
                            <Coffee className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Net Work Hours</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">{displayWorkHours}</h3>
                        </div>
                        <div className="p-3 bg-violet-100/50 rounded-2xl text-violet-600">
                            <Play className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Earned Salary</p>
                            <h3 className="text-3xl font-extrabold text-slate-800"><span className="text-xl font-medium text-slate-500 mr-1">$</span>{displayEarnedSalary}</h3>
                        </div>
                        <div className="p-3 bg-sky-100/50 rounded-2xl text-sky-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Late Penalty</p>
                            <h3 className="text-3xl font-extrabold text-slate-800"><span className="text-xl font-medium text-rose-300 mr-1">-$</span>{displayPenaltyAmount}</h3>
                        </div>
                        <div className="p-3 bg-rose-100/50 rounded-2xl text-rose-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 lg:p-12 mb-10 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="flex flex-col items-center mb-10 text-center relative z-10">
                    <div className="w-16 h-1 bg-indigo-100 rounded-full mb-6"></div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Punch Interface</h2>
                    <p className="text-slate-500 font-medium mb-4">Record your attendance and breaks smoothly.</p>

                    {!isPunchedIn && location && (
                        <div className="mb-6 inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100 shadow-sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            Location Captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto relative z-10">
                    <button
                        disabled={isPunchedIn}
                        onClick={handlePunchIn}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300 ${!isPunchedIn ? 'bg-indigo-600 shadow-xl shadow-indigo-600/30 hover:-translate-y-2 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${!isPunchedIn ? 'bg-white/20' : 'bg-slate-200'}`}>
                            <Play className="w-7 h-7" />
                        </div>
                        <span className="font-bold tracking-wider text-sm">PUNCH IN</span>
                    </button>

                    <button
                        disabled={!isPunchedIn || isPunchedOut || isOnBreak}
                        onClick={() => handleAction('break-start')}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300 ${isPunchedIn && !isPunchedOut && !isOnBreak ? 'bg-amber-500 shadow-xl shadow-amber-500/30 hover:-translate-y-2 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isPunchedIn && !isPunchedOut && !isOnBreak ? 'bg-white/20' : 'bg-slate-200'}`}>
                            <Coffee className="w-7 h-7" />
                        </div>
                        <span className="font-bold tracking-wider text-sm">BREAK START</span>
                    </button>

                    <button
                        disabled={!isOnBreak}
                        onClick={() => handleAction('break-end')}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300 ${isOnBreak ? 'bg-emerald-500 shadow-xl shadow-emerald-500/30 hover:-translate-y-2 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isOnBreak ? 'bg-white/20' : 'bg-slate-200'}`}>
                            <CheckCircle className="w-7 h-7" />
                        </div>
                        <span className="font-bold tracking-wider text-sm">BREAK END</span>
                    </button>

                    <button
                        disabled={!isPunchedIn || isPunchedOut || isOnBreak}
                        onClick={() => handleAction('punch-out')}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300 ${isPunchedIn && !isPunchedOut && !isOnBreak ? 'bg-rose-500 shadow-xl shadow-rose-500/30 hover:-translate-y-2 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isPunchedIn && !isPunchedOut && !isOnBreak ? 'bg-white/20' : 'bg-slate-200'}`}>
                            <Square className="w-7 h-7" />
                        </div>
                        <span className="font-bold tracking-wider text-sm">PUNCH OUT</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
