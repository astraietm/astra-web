import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Users,
    Calendar,
    CheckCircle2,
    QrCode,
    Plus,
    ArrowUpRight,
    Radio,
    Clock,
    MapPin
} from 'lucide-react';
import KPICard from '../components/admin/dashboard/KPICard';
import TrafficChart from '../components/admin/dashboard/TrafficChart';
import RecentActivityTable from '../components/admin/dashboard/RecentActivityTable';
import StatusBadge from '../components/admin/common/StatusBadge';
import AttendeeDrawer from '../components/admin/common/AttendeeDrawer';
import { CardSkeleton } from '../components/admin/common/LoadingSkeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        activeEvents: 0,
        attendedCount: 0,
        attendanceRate: 0,
        recentActivity: [],
        allRegistrations: [],
        eventsList: []
    });

    const [timeframe, setTimeframe] = useState('7D');
    const [selectedAttendee, setSelectedAttendee] = useState(null);

    // Dynamic greeting based on time of day
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [regRes, eventRes] = await Promise.all([
                axios.get(`${API_URL}/events/admin/registrations/`, { headers: { Authorization: `Bearer ${token}` } })
                    .catch(() => axios.get(`${API_URL}/admin-registrations/`, { headers: { Authorization: `Bearer ${token}` } }))
                    .catch(() => ({ data: [] })),
                axios.get(`${API_URL}/operations/events/`, { headers: { Authorization: `Bearer ${token}` } })
                    .catch(() => ({ data: [] }))
            ]);
            const regs = Array.isArray(regRes.data) ? regRes.data : [];
            const events = Array.isArray(eventRes.data) ? eventRes.data : [];
            
            const attended = regs.filter(r => r.is_used || r.status === 'ATTENDED').length;
            const activeEventsCount = events.filter(e => e.is_registration_open).length;

            setStats({
                totalRegistrations: regs.length,
                activeEvents: activeEventsCount || events.length,
                attendedCount: attended,
                attendanceRate: regs.length > 0 ? Math.round((attended / regs.length) * 100) : 0,
                recentActivity: regs.slice(0, 5),
                allRegistrations: regs,
                eventsList: events
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Real data-driven chart aggregation
    const { chartData, chartLabels, chartTrend, chartTrendValue } = useMemo(() => {
        const registrations = stats.allRegistrations;
        if (!registrations || registrations.length === 0) {
            return { chartData: [], chartLabels: [], chartTrend: null, chartTrendValue: null };
        }

        const now = new Date();

        if (timeframe === '24H') {
            const intervals = 6; // 4-hour intervals
            const counts = new Array(intervals).fill(0);
            const labels = [];
            for (let i = intervals - 1; i >= 0; i--) {
                const time = new Date(now.getTime() - i * 4 * 3600 * 1000);
                labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }

            registrations.forEach(r => {
                const t = new Date(r.timestamp || r.created_at || r.registration_date);
                if (!isNaN(t.getTime())) {
                    const diffHours = (now - t) / (1000 * 3600);
                    if (diffHours >= 0 && diffHours < 24) {
                        const bucket = intervals - 1 - Math.floor(diffHours / 4);
                        if (bucket >= 0 && bucket < intervals) counts[bucket]++;
                    }
                }
            });

            return { chartData: counts, chartLabels: labels, chartTrend: null, chartTrendValue: null };
        }

        if (timeframe === '30D') {
            const days = 30;
            const counts = new Array(days).fill(0);
            const labels = [];
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                labels.push(i % 5 === 0 ? d.toLocaleDateString([], { month: 'short', day: 'numeric' }) : '');
            }

            registrations.forEach(r => {
                const t = new Date(r.timestamp || r.created_at || r.registration_date);
                if (!isNaN(t.getTime())) {
                    const diffDays = Math.floor((now - t) / (1000 * 3600 * 24));
                    if (diffDays >= 0 && diffDays < days) {
                        counts[days - 1 - diffDays]++;
                    }
                }
            });

            return { chartData: counts, chartLabels: labels, chartTrend: null, chartTrendValue: null };
        }

        // Default '7D'
        const days = 7;
        const counts = new Array(days).fill(0);
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            labels.push(i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' }));
        }

        let currentPeriod = 0;
        let prevPeriod = 0;

        registrations.forEach(r => {
            const t = new Date(r.timestamp || r.created_at || r.registration_date);
            if (!isNaN(t.getTime())) {
                const diffDays = Math.floor((now - t) / (1000 * 3600 * 24));
                if (diffDays >= 0 && diffDays < 7) {
                    counts[6 - diffDays]++;
                    currentPeriod++;
                } else if (diffDays >= 7 && diffDays < 14) {
                    prevPeriod++;
                }
            }
        });

        let trend = null;
        let trendValue = null;
        if (prevPeriod > 0) {
            const diff = Math.round(((currentPeriod - prevPeriod) / prevPeriod) * 100);
            trend = diff >= 0 ? 'up' : 'down';
            trendValue = `${diff >= 0 ? '+' : ''}${diff}% vs last wk`;
        }

        return { chartData: counts, chartLabels: labels, chartTrend: trend, chartTrendValue: trendValue };
    }, [stats.allRegistrations, timeframe]);

    // Upcoming events sorted by date
    const upcomingEvents = useMemo(() => {
        return stats.eventsList
            .filter(e => e.event_date)
            .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
            .slice(0, 3);
    }, [stats.eventsList]);

    return (
        <div className="space-y-6 pb-12">
            {/* Header: Greeting + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        {greeting}, {user?.name || user?.first_name || 'Admin'}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                        Real-time overview of ASTRA festival operations and attendee activity.
                    </p>
                </div>

                {/* Primary actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={() => navigate('/admin/events')}
                        className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                    >
                        <Plus size={14} />
                        <span>Create Event</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/scanner')}
                        className="h-9 px-3.5 rounded-lg bg-[#111319] hover:bg-white/[0.06] border border-white/[0.08] text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                        <QrCode size={14} />
                        <span>Entrance Scanner</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/notifications')}
                        className="h-9 px-3.5 rounded-lg bg-[#111319] hover:bg-white/[0.06] border border-white/[0.08] text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                        <Radio size={14} />
                        <span>Broadcast</span>
                    </button>
                </div>
            </div>

            {/* KPI Row (Real values only, no fake trends) */}
            {loading ? (
                <CardSkeleton count={4} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard
                        title="Total Registrations"
                        value={stats.totalRegistrations}
                        icon={Users}
                        description={stats.totalRegistrations === 0 ? "No registrations yet" : "Active participant passes"}
                        isPrimary
                    />
                    <KPICard
                        title="Active Events"
                        value={stats.activeEvents}
                        icon={Calendar}
                        description={stats.activeEvents === 0 ? "No active events yet" : "Live workshops & tracks"}
                    />
                    <KPICard
                        title="Checked-In Attendance"
                        value={stats.attendedCount}
                        icon={CheckCircle2}
                        trend={stats.totalRegistrations > 0 ? "up" : null}
                        trendValue={stats.totalRegistrations > 0 ? `${stats.attendanceRate}% turnout` : null}
                        description={stats.attendedCount === 0 ? "No check-ins yet" : "Verified venue entries"}
                    />
                    <KPICard
                        title="Scanner Status"
                        value="Ready"
                        icon={QrCode}
                        description="Verification gateway online"
                    />
                </div>
            )}

            {/* Main Content: Trends & Event Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Registration Trends Chart (8 cols) */}
                <div className="lg:col-span-8">
                    <TrafficChart
                        data={chartData}
                        labels={chartLabels}
                        trend={chartTrend}
                        trendValue={chartTrendValue}
                        timeframe={timeframe}
                        onTimeframeChange={setTimeframe}
                        isLoading={loading}
                        onRetry={fetchDashboardData}
                    />
                </div>

                {/* Event Performance (4 cols) */}
                <div className="lg:col-span-4 bg-[#111319] border border-white/[0.06] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm min-h-[320px]">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-tight">Event Performance</h3>
                            <p className="text-xs text-slate-400 font-medium">Capacity and registration tracking</p>
                        </div>
                        {stats.eventsList.length > 0 && (
                            <button 
                                onClick={() => navigate('/admin/events')}
                                className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                            >
                                <span>View all</span>
                                <ArrowUpRight size={13} />
                            </button>
                        )}
                    </div>

                    {stats.eventsList.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01]">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 flex items-center justify-center mb-2.5">
                                <Calendar size={18} />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-200">No active events yet</h4>
                            <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed mb-3">
                                Create your first event to start tracking performance.
                            </p>
                            <button
                                onClick={() => navigate('/admin/events')}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                            >
                                <Plus size={13} />
                                <span>Create Event</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
                            {stats.eventsList.slice(0, 4).map((evt) => {
                                const capacity = evt.registration_limit || evt.max_capacity || 100;
                                // Get actual registrations matching this event title
                                const registeredForEvent = stats.allRegistrations.filter(
                                    r => r.event_details?.title === evt.title
                                ).length;
                                const current = evt.current_registrations_count || registeredForEvent || 0;
                                const percent = Math.min(100, Math.round((current / capacity) * 100));

                                return (
                                    <div key={evt.id} className="p-2.5 rounded-xl bg-[#0d0f14] border border-white/[0.05] space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-semibold text-white truncate">{evt.title}</p>
                                            <span className="text-[11px] font-mono text-slate-400 shrink-0">
                                                {percent}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span className="truncate">{evt.venue || 'Campus Venue'}</span>
                                            <span className="font-mono text-slate-300">{current} / {capacity} seats</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Events Overview (Only rendered if events with dates exist) */}
            {upcomingEvents.length > 0 && (
                <div className="bg-[#111319] border border-white/[0.06] rounded-2xl p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-tight">Upcoming Schedule</h3>
                            <p className="text-xs text-slate-400 font-medium">Next scheduled sessions and deadlines</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/events')}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <span>Manage schedule</span>
                            <ArrowUpRight size={13} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {upcomingEvents.map((evt) => (
                            <div key={evt.id} className="p-3.5 rounded-xl bg-[#0d0f14] border border-white/[0.05] space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                        {evt.category || 'Event'}
                                    </span>
                                    <StatusBadge 
                                        status={evt.is_registration_open ? 'Open' : 'Closed'} 
                                    />
                                </div>
                                <h4 className="text-xs font-semibold text-white truncate" title={evt.title}>
                                    {evt.title}
                                </h4>
                                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                                    <span className="inline-flex items-center gap-1">
                                        <Clock size={11} className="text-slate-500" />
                                        {new Date(evt.event_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin size={11} className="text-slate-500" />
                                        <span className="truncate max-w-[100px]">{evt.venue || 'Campus'}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Registrations Table */}
            <RecentActivityTable
                registrations={stats.recentActivity}
                onSelectAttendee={(attendee) => setSelectedAttendee(attendee)}
            />

            {/* Attendee Slide-Over Detail Drawer */}
            <AttendeeDrawer
                isOpen={Boolean(selectedAttendee)}
                onClose={() => setSelectedAttendee(null)}
                attendee={selectedAttendee}
            />
        </div>
    );
};

export default AdminDashboard;
