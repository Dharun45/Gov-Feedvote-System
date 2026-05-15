import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Building2, MessageSquare, Star, LogOut, TrendingUp, Clock, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { store } from '@/lib/store';
import { Feedback } from '@/lib/types';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SENTIMENT_COLORS = ['hsl(160,84%,39%)', 'hsl(32,95%,54%)', 'hsl(0,84%,60%)'];
const STATUS_COLORS = ['hsl(32,95%,54%)', 'hsl(222,80%,45%)', 'hsl(160,84%,39%)'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(store.getStats());
  const [feedback, setFeedback] = useState<Feedback[]>(store.getFeedback());

  useEffect(() => {
    if (!store.isAdminLoggedIn()) navigate('/admin/login');
  }, [navigate]);

  const handleStatusChange = (id: string, status: Feedback['status']) => {
    store.updateFeedbackStatus(id, status);
    setFeedback(store.getFeedback());
    setStats(store.getStats());
    toast.success(`Status updated to ${status}`);
  };

  const sentimentData = [
    { name: 'Positive', value: stats.positive },
    { name: 'Neutral', value: stats.neutral },
    { name: 'Negative', value: stats.negative },
  ];

  const statusData = [
    { name: 'Pending', count: stats.pending, fill: STATUS_COLORS[0] },
    { name: 'In Progress', count: stats.inProgress, fill: STATUS_COLORS[1] },
    { name: 'Resolved', count: stats.resolved, fill: STATUS_COLORS[2] },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Pending': 'bg-warning/10 text-warning border-warning/20',
      'In Progress': 'bg-primary/10 text-primary border-primary/20',
      'Resolved': 'bg-success/10 text-success border-success/20',
    };
    return <Badge variant="outline" className={styles[status] || ''}>{status}</Badge>;
  };

  const getSentimentBadge = (s: string) => {
    const styles: Record<string, string> = {
      'Positive': 'bg-success/10 text-success',
      'Negative': 'bg-destructive/10 text-destructive',
      'Neutral': 'bg-warning/10 text-warning',
    };
    return <Badge className={`${styles[s] || ''} border-0`}>{s}</Badge>;
  };

  const statCards = [
    { icon: MessageSquare, label: 'Total Feedback', value: stats.totalFeedback, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Clock, label: 'Pending', value: stats.pending, color: 'text-warning', bg: 'bg-warning/10' },
    { icon: TrendingUp, label: 'In Progress', value: stats.inProgress, color: 'text-info', bg: 'bg-info/10' },
    { icon: CheckCircle2, label: 'Resolved', value: stats.resolved, color: 'text-success', bg: 'bg-success/10' },
  ];

  const secondaryStats = [
    { icon: Building2, label: 'Buildings', value: stats.totalBuildings },
    { icon: Users, label: 'Employees', value: stats.totalEmployees },
    { icon: Star, label: 'Avg Rating', value: stats.avgRating },
    { icon: AlertCircle, label: 'Negative', value: stats.negative },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold leading-tight">Admin Dashboard</h1>
              <p className="text-xs text-primary-foreground/50">Feedback Management System</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { store.adminLogout(); navigate('/admin/login'); }} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Primary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-card border border-border/50 rounded-2xl p-5 shadow-card card-hover"
              style={{ animation: `fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s forwards`, opacity: 0 }}
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="font-heading text-3xl font-extrabold text-foreground">{s.value}</div>
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-4 gap-3">
          {secondaryStats.map((s, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-3 shadow-card flex items-center gap-3">
              <s.icon className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-heading font-bold text-foreground text-lg leading-tight">{s.value}</div>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h3 className="font-heading font-bold text-foreground mb-5">Feedback by Status</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={statusData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,89%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(220,9%,46%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(220,9%,46%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(220,13%,89%)', boxShadow: '0 4px 20px hsla(222,47%,11%,0.08)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h3 className="font-heading font-bold text-foreground mb-5">Sentiment Analysis</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: 'hsl(220,9%,46%)' }}
                >
                  {sentimentData.map((_, i) => (
                    <Cell key={i} fill={SENTIMENT_COLORS[i]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(220,13%,89%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-card">
          <div className="p-6 border-b border-border/50">
            <h3 className="font-heading font-bold text-foreground text-lg">All Feedback</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{feedback.length} submissions total</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Feedback</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sentiment</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {feedback.map(fb => (
                  <tr key={fb.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap text-xs">
                      {new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-foreground max-w-xs">
                      <p className="truncate">{fb.comment}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{fb.userEmail}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-warning font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {fb.rating}
                      </div>
                    </td>
                    <td className="px-5 py-4">{getSentimentBadge(fb.sentiment)}</td>
                    <td className="px-5 py-4">{getStatusBadge(fb.status)}</td>
                    <td className="px-5 py-4">
                      <Select value={fb.status} onValueChange={(v) => handleStatusChange(fb.id, v as Feedback['status'])}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
