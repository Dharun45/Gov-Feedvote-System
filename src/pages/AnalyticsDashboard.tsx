import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Users, MessageSquare, Star, Building2,
  ArrowLeft, AlertTriangle, CheckCircle2, Clock, Shield
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart
} from 'recharts';
import { apiGetAnalytics } from '@/lib/api';

const PIE_COLORS = { Positive: '#22c55e', Neutral: '#f59e0b', Negative: '#ef4444' };
const STATUS_COLORS = { Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#22c55e' };

const StatCard = ({ icon: Icon, label, value, sub, color = 'primary' }: any) => (
  <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-card">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
    </div>
    <div className="text-3xl font-heading font-extrabold text-foreground mb-0.5">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
    {sub && <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>}
  </div>
);

const AnalyticsDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetAnalytics()
      .then(res => setData(res.data))
      .catch(e => setError(e.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground text-sm font-medium">Loading analytics...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3 max-w-xs">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <p className="text-foreground font-semibold">Backend not connected</p>
        <p className="text-muted-foreground text-sm">{error}</p>
        <Link to="/superadmin/dashboard"><button className="text-primary text-sm hover:underline">← Back to Dashboard</button></Link>
      </div>
    </div>
  );

  const sentimentPie = [
    { name: 'Positive', value: data.sentiment.positive },
    { name: 'Neutral', value: data.sentiment.neutral },
    { name: 'Negative', value: data.sentiment.negative },
  ];

  const statusPie = [
    { name: 'Pending', value: data.status.pending },
    { name: 'In Progress', value: data.status.inProgress },
    { name: 'Resolved', value: data.status.resolved },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-4 pt-6 pb-12">
          <Link to="/superadmin/dashboard" className="inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold mb-0.5">Analytics Dashboard</h1>
              <p className="text-primary-foreground/60 text-sm">Real-time insights from live database</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 -mt-6 pb-12 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="Total Feedback" value={data.totals.totalFeedback} color="primary" />
          <StatCard icon={Building2} label="Active Buildings" value={data.totals.totalBuildings} color="secondary" />
          <StatCard icon={Users} label="Active Employees" value={data.totals.totalEmployees} sub="Across all offices" color="accent" />
          <StatCard icon={Star} label="Average Rating" value={`${data.avgRating}/5`} sub={`Score: ${data.avgSentimentScore}`} color="warning" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Clock} label="Pending" value={data.status.pending} color="warning" />
          <StatCard icon={TrendingUp} label="In Progress" value={data.status.inProgress} color="primary" />
          <StatCard icon={CheckCircle2} label="Resolved" value={data.status.resolved} color="secondary" />
          <StatCard icon={Shield} label="Duplicates Flagged" value={data.duplicates} sub="AI anti-fraud" color="destructive" />
        </div>

        {/* Trend Chart */}
        {data.trend?.length > 0 && (
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h2 className="font-heading font-bold text-lg mb-4">Feedback Trend (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(222 80% 45%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(222 80% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={d => d?.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="hsl(222 80% 45%)" fill="url(#colorFeedback)" strokeWidth={2} name="Feedback Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sentiment Pie */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h2 className="font-heading font-bold text-lg mb-4">Sentiment Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sentimentPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {sentimentPie.map(entry => <Cell key={entry.name} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pie */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h2 className="font-heading font-bold text-lg mb-4">Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {statusPie.map(entry => <Cell key={entry.name} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Employees */}
        {data.topEmployees?.length > 0 && (
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h2 className="font-heading font-bold text-lg mb-4">Top Rated Employees</h2>
            <div className="space-y-3">
              {data.topEmployees.map((emp: any, i: number) => (
                <div key={emp._id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">#{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.designation} · {emp.buildingId?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="text-sm font-bold text-foreground">{emp.rating?.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{emp.totalRatings} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Building Stats */}
        {data.buildingStats?.length > 0 && (
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h2 className="font-heading font-bold text-lg mb-4">Feedback by Building</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.buildingStats} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(222 80% 45%)" radius={[0, 6, 6, 0]} name="Feedback Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.totals.totalFeedback === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No feedback data yet</p>
            <p className="text-sm">Analytics will populate as citizens submit feedback</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
