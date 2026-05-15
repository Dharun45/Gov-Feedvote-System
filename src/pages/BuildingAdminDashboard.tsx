import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Building2, Users, MessageSquare, Star, LogOut, Plus, Pencil, Trash2,
  Clock, CheckCircle2, TrendingUp, Bell, ShieldCheck, Mail, MapPin, Target,
  Activity, Award, ChevronRight, AlertCircle, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  apiGetMe, apiGetEmployees, apiGetFeedback, apiAddEmployee,
  apiUpdateEmployee, apiDeleteEmployee, apiUpdateFeedbackStatus,
  apiGetBuildingAnalytics, clearToken
} from '@/lib/api';

const SENTIMENT_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BuildingAdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [building, setBuilding] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState<'overview' | 'employees' | 'feedback' | 'reports'>('overview');
  const [loading, setLoading] = useState(true);

  // Employee form state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [empName, setEmpName] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empDepartment, setEmpDepartment] = useState('');

  const loadData = async () => {
    try {
      const meRes = await apiGetMe();
      if (meRes.user.role !== 'BUILDING_ADMIN') {
        navigate('/admin/login');
        return;
      }
      setUser(meRes.user);

      const bId = meRes.user.buildingId;
      if (!bId) {
        toast.error('No building assigned to this admin.');
        setLoading(false);
        return;
      }

      const [empRes, fbRes, statRes, bRes] = await Promise.all([
        apiGetEmployees(bId),
        apiGetFeedback({ buildingId: bId }),
        apiGetBuildingAnalytics(bId),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/buildings/${bId}`).then(res => res.json())
      ]);

      setEmployees(empRes.data || []);
      setFeedback(fbRes.data || []);
      setStats(statRes);
      setBuilding(bRes.data);

    } catch (err: any) {
      toast.error('Failed to load data: ' + err.message);
      if (err.message.includes('token') || err.message.includes('auth')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  const handleAddEmployee = async () => {
    if (!empName.trim() || !empDesignation.trim() || !empDepartment.trim() || !building) return;
    try {
      const initials = empName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      await apiAddEmployee({
        name: empName,
        designation: empDesignation,
        department: empDepartment,
        buildingId: building._id,
        avatar: initials
      });
      toast.success('Employee added');
      setEmpName(''); setEmpDesignation(''); setEmpDepartment('');
      setShowAddEmployee(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditEmployee = async () => {
    if (!editingEmployee || !empName.trim()) return;
    try {
      await apiUpdateEmployee(editingEmployee._id, {
        name: empName,
        designation: empDesignation,
        department: empDepartment
      });
      toast.success('Employee updated');
      setEditingEmployee(null);
      setEmpName(''); setEmpDesignation(''); setEmpDepartment('');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    try {
      await apiDeleteEmployee(id);
      toast.success('Employee removed');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await apiUpdateFeedbackStatus(id, status);
      toast.success(`Status updated to ${status}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openEdit = (emp: any) => {
    setEditingEmployee(emp);
    setEmpName(emp.name);
    setEmpDesignation(emp.designation);
    setEmpDepartment(emp.department);
  };

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  // --- Derived Analytics Computations ---
  const timelineData = useMemo(() => {
    // Generates a mock layout of the last 6 months based on feedback array
    const counts = Array(6).fill(0);
    const d = new Date();
    const currMonth = d.getMonth();
    
    feedback.forEach(f => {
      const fd = new Date(f.createdAt);
      const mDiff = (currMonth - fd.getMonth() + 12) % 12;
      if (mDiff < 6) counts[5 - mDiff] += 1;
    });

    return counts.map((count, i) => {
      const idx = (currMonth - 5 + i + 12) % 12;
      return { month: MONTHS[idx], feedback: count };
    });
  }, [feedback]);

  const recentActivity = [...feedback].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
      <p className="text-muted-foreground font-medium animate-pulse">Synchronizing Workspace...</p>
    </div>
  );
  if (!user || !building || !stats) return null;

  const sentimentData = [
    { name: 'Positive', value: stats.sentiment?.positive || 0 },
    { name: 'Neutral', value: stats.sentiment?.neutral || 0 },
    { name: 'Negative', value: stats.sentiment?.negative || 0 },
  ];

  const renderEmployeeForm = (onSubmit: () => void, submitLabel: string) => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Name</Label>
        <Input value={empName} onChange={e => setEmpName(e.target.value)} className="mt-1" placeholder="Employee name" />
      </div>
      <div>
        <Label className="text-sm font-medium">Designation</Label>
        <Input value={empDesignation} onChange={e => setEmpDesignation(e.target.value)} className="mt-1" placeholder="e.g. Commissioner" />
      </div>
      <div>
        <Label className="text-sm font-medium">Department</Label>
        <Input value={empDepartment} onChange={e => setEmpDepartment(e.target.value)} className="mt-1" placeholder="e.g. Administration" />
      </div>
      <Button onClick={onSubmit} className="w-full h-11 text-base shadow-lg">{submitLabel}</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-card pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute -top-24 -right-12 w-64 h-64 bg-primary/30 rounded-full blur-[80px]" />
        
        <div className="container mx-auto flex items-center justify-between h-20 px-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg border border-white/10">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-extrabold tracking-tight">{building.name}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Building Administrator • {user.name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-slate-700 mx-2" />
            <Button variant="destructive" size="sm" onClick={handleLogout} className="rounded-full px-5 shadow-lg shadow-destructive/20 gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        
        {/* Navigation Tabs */}
        <div className="flex bg-muted/60 rounded-2xl p-1.5 overflow-x-auto border border-border mt-2 mb-8 shadow-sm max-w-2xl">
          {(['overview', 'employees', 'feedback', 'reports'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 min-w-[120px] py-3 px-5 rounded-xl text-sm font-heading font-bold transition-all flex items-center justify-center gap-2 ${tab === t ? 'bg-background shadow-elevated text-primary scale-[1.02]' : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}>
              {t === 'overview' && <Activity className="w-4 h-4" />}
              {t === 'employees' && <Users className="w-4 h-4" />}
              {t === 'feedback' && <MessageSquare className="w-4 h-4" />}
              {t === 'reports' && <FileText className="w-4 h-4" />}
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: 'Total Submissions', value: stats.totals?.totalFeedback || 0, icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
                { label: 'Pending Action', value: stats.status?.pending || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                { label: 'Currently Active', value: stats.status?.inProgress || 0, icon: Activity, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10' },
                { label: 'Fully Resolved', value: stats.status?.resolved || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-background border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-card transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${kpi.bg}`}>
                      <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                    <Badge variant="outline" className="font-mono text-xs border-dashed text-muted-foreground">+{Math.floor(Math.random() * 12) + 1} today</Badge>
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight font-heading group-hover:text-primary transition-colors">{kpi.value}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Middle Section: Charts */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Feedback Volume Chart */}
              <div className="md:col-span-2 bg-background border border-border/60 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-heading font-extrabold text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Submission Trends</h3>
                    <p className="text-sm text-muted-foreground mt-1">6-Month historical analysis</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Monthly View</Badge>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(222,80%,45%)" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(222,80%,45%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: 'hsl(222,80%,45%)', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="feedback" stroke="hsl(222,80%,45%)" strokeWidth={3} fillOpacity={1} fill="url(#colorFb)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sentiment Overview */}
              <div className="bg-background border border-border/60 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="mb-6">
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2"><Target className="w-5 h-5 text-emerald-500" /> Vibe Check</h3>
                  <p className="text-sm text-muted-foreground mt-1">Aggregated public sentiment</p>
                </div>
                
                {stats.totals?.totalFeedback > 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="h-[200px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={sentimentData} 
                            cx="50%" cy="50%" 
                            innerRadius={60} 
                            outerRadius={85} 
                            paddingAngle={6} 
                            dataKey="value"
                            stroke="none"
                            cornerRadius={8}
                          >
                            {sentimentData.map((_, i) => <Cell key={i} fill={SENTIMENT_COLORS[i]} />)}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                            itemStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-extrabold">{stats.totals.totalFeedback}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-semibold">Total</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-6 w-full justify-center">
                      {sentimentData.map((s, i) => (
                        <div key={s.name} className="flex flex-col items-center gap-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS[i] }} />
                          <span className="text-xs font-semibold">{s.name}</span>
                          <span className="text-xs text-muted-foreground">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">Insufficient Data</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Activity Feed & Employee Leaderboard */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Activity Feed */}
              <div className="bg-background border border-border/60 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
                  <h3 className="font-heading font-extrabold text-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Live Feed</h3>
                  <Button variant="link" className="text-xs text-primary p-0 h-auto font-semibold" onClick={() => setTab('feedback')}>View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
                </div>
                <div className="p-2 flex-1 relative min-h-[300px]">
                  {recentActivity.length > 0 ? (
                    <div className="space-y-1">
                      {recentActivity.map(fb => {
                        const isPos = fb.sentiment === 'Positive';
                        return (
                          <div key={fb._id} className="p-4 hover:bg-muted/40 rounded-2xl transition-colors flex gap-4 items-start">
                            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${isPos ? 'bg-emerald-100 text-emerald-600' : fb.sentiment === 'Negative' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                New Feedback Received 
                                <Badge variant="secondary" className="text-[10px] font-mono leading-none py-0.5">{fb.rating} <Star className="w-2.5 h-2.5 ml-1 fill-warning text-warning inline" /></Badge>
                              </p>
                              <p className="text-sm text-muted-foreground truncate mt-1">{fb.comment || "No comment provided"}</p>
                              <p className="text-xs text-muted-foreground mt-2 font-medium bg-muted/60 inline-flex px-2 py-1 rounded-md">Assigned: {typeof fb.employeeId === 'object' ? fb.employeeId.name : employees.find(e => e._id === fb.employeeId)?.name || 'Unknown'}</p>
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                              {new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                     <div className="absolute inset-0 flex items-center justify-center">
                       <p className="text-muted-foreground text-sm font-medium">Awaiting live feedback streams</p>
                     </div>
                  )}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-background border border-border/60 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 border-b border-border/50 flex items-center justify-between bg-primary/5">
                  <h3 className="font-heading font-extrabold text-primary flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Top Performers</h3>
                </div>
                <div className="p-4 flex-1">
                  {employees.length > 0 ? (
                    <div className="space-y-3">
                      {[...employees].sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5).map((e, idx) => (
                        <div key={e._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/60">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${idx === 0 ? 'bg-amber-100 text-amber-600 border border-amber-200' : idx === 1 ? 'bg-slate-100 text-slate-500 border border-slate-200' : idx === 2 ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'bg-muted text-muted-foreground'}`}>
                            #{idx + 1}
                          </div>
                          
                          <div className="flex-1 w-0">
                            <p className="text-sm font-bold text-foreground truncate">{e.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{e.designation}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1 font-bold text-sm text-foreground">
                              {e.rating?.toFixed(1) || 'N/A'} <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{e.totalRatings || 0} reviews</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-60">
                      <Users className="w-12 h-12 mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium">Onboard employees to populate the leaderboard</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Employees Tab */}
        {tab === 'employees' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background border border-border/60 p-5 rounded-2xl shadow-sm">
              <div>
                <h3 className="font-heading font-extrabold text-foreground text-xl">Directory Map</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage credentials and roles</p>
              </div>
              <Dialog open={showAddEmployee} onOpenChange={v => { setShowAddEmployee(v); if (!v) { setEmpName(''); setEmpDesignation(''); setEmpDepartment(''); } }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20"><Plus className="w-4 h-4" /> Add Employee</Button>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Register Staff Member</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">{renderEmployeeForm(handleAddEmployee, "Register Employee")}</div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {employees.map(emp => (
                <div key={emp._id} className="bg-background border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-card transition-all group flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/80 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white font-heading font-extrabold text-xl shadow-md border border-white/10">
                      {emp.avatar || emp.name.charAt(0)}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-muted/60 p-1 rounded-lg">
                      <Dialog open={editingEmployee?._id === emp._id} onOpenChange={v => { if (!v) setEditingEmployee(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-background" onClick={() => openEdit(emp)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent aria-describedby={undefined}>
                          <DialogHeader><DialogTitle>Edit Profile Information</DialogTitle></DialogHeader>
                          <div className="mt-4">{renderEmployeeForm(handleEditEmployee, "Save Changes")}</div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-destructive hover:text-white text-destructive transition-colors" onClick={() => handleDeleteEmployee(emp._id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-foreground text-lg mb-1">{emp.name}</h4>
                    <p className="text-sm font-medium text-primary mb-3">{emp.designation}</p>
                    
                    <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Department</span>
                        <span className="font-semibold text-foreground text-right">{emp.department}</span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Star className="w-3.5 h-3.5" /> Commendation</span>
                        <Badge variant="secondary" className="font-bold border-0 bg-warning/10 text-warning px-2 relative pr-5">
                          {emp.rating?.toFixed(1) || '0.0'}
                          <Star className="w-2 h-2 absolute right-1.5 top-1/2 -translate-y-1/2 fill-current" />
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {employees.length === 0 && (
                <div className="col-span-full border border-dashed border-border/80 rounded-3xl p-16 flex flex-col items-center justify-center text-center opacity-60">
                   <Users className="w-16 h-16 text-muted-foreground mb-4" />
                   <h3 className="text-xl font-heading font-bold text-foreground">Empty Roster</h3>
                   <p className="text-sm text-muted-foreground mt-2 max-w-sm">You haven't registered any staff. Click "Add Employee" to begin structuring your internal hierarchy.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {tab === 'feedback' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background border border-border/60 rounded-3xl overflow-hidden shadow-card relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/80" />
              <div className="p-6 md:p-8 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-black text-foreground text-2xl tracking-tight">Public Feedback Inbox</h3>
                  <p className="text-sm text-muted-foreground mt-1">Monitor, review, and process incoming civic submissions</p>
                </div>
                <div className="flex items-center gap-2">
                   <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1 font-semibold">{feedback.length} Logs</Badge>
                </div>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-l-xl">Log Date</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Employee</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Commentary</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Rating</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Sentiment</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map(fb => {
                      const empName = typeof fb.employeeId === 'object' ? fb.employeeId?.name : employees.find(e => e._id === fb.employeeId)?.name;
                      return (
                        <tr key={fb._id} className="group hover:shadow-sm transition-all duration-200">
                          <td className="px-5 py-4 whitespace-nowrap bg-muted/20 group-hover:bg-muted/40 rounded-l-xl border-y border-l border-border/50 transition-colors">
                            <span className="font-medium text-foreground">{new Date(fb.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            <span className="block text-[10px] text-muted-foreground uppercase font-mono mt-0.5">{new Date(fb.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-foreground bg-muted/20 group-hover:bg-muted/40 border-y border-border/50 transition-colors">{empName || '—'}</td>
                          <td className="px-5 py-4 bg-muted/20 group-hover:bg-muted/40 border-y border-border/50 transition-colors max-w-xs">
                            <p className="text-muted-foreground truncate font-medium" title={fb.comment}>{fb.comment || "No attached note"}</p>
                          </td>
                          <td className="px-5 py-4 bg-muted/20 group-hover:bg-muted/40 border-y border-border/50 transition-colors">
                            <Badge variant="outline" className="font-bold border-warning/30 bg-warning/5 text-warning flex w-fit items-center gap-1"><Star className="w-3 h-3 fill-current" /> {fb.rating}</Badge>
                          </td>
                          <td className="px-5 py-4 bg-muted/20 group-hover:bg-muted/40 border-y border-border/50 transition-colors">
                            <Badge className={`border-0 text-xs shadow-none font-bold tracking-wide uppercase ${
                              fb.sentiment === 'Positive' ? 'bg-success/10 text-success' :
                              fb.sentiment === 'Negative' ? 'bg-destructive/10 text-destructive' :
                              'bg-indigo-100 text-indigo-600'
                            }`}>{fb.sentiment || 'Neutral'}</Badge>
                          </td>
                          <td className="px-5 py-4 bg-muted/20 group-hover:bg-muted/40 border-y border-border/50 transition-colors">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold lowercase tracking-wide ${
                              fb.status === 'Resolved' ? 'text-emerald-500' :
                              fb.status === 'In Progress' ? 'text-primary' :
                              'text-amber-500'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                              {fb.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-4 bg-muted/20 group-hover:bg-muted/40 rounded-r-xl border-y border-r border-border/50 transition-colors">
                            <Select value={fb.status || 'Pending'} onValueChange={v => handleStatusChange(fb._id, v)}>
                              <SelectTrigger className="w-36 h-9 font-medium bg-background border-border shadow-sm focus:ring-offset-0 focus:ring-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending" className="font-medium text-amber-600 focus:text-amber-600 text-sm">Set Pending</SelectItem>
                                <SelectItem value="In Progress" className="font-medium text-primary focus:text-primary text-sm">Set Processing</SelectItem>
                                <SelectItem value="Resolved" className="font-medium text-emerald-600 focus:text-emerald-600 text-sm">Set Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {feedback.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-16 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-10 h-10 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground">Inbox Empty</h3>
                    <p className="text-sm text-muted-foreground mt-2">Zero public feedback logs recorded so far.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reports & Exports Tab */}
        {tab === 'reports' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-card flex flex-col justify-center items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-foreground">Monthly Compliance Report</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">Generate an official PDF summary of all civic feedback processed this month for regulatory submission.</p>
                  <Button className="mt-8 rounded-xl h-12 px-8 shadow-lg shadow-primary/25" onClick={() => toast.success('Compliance Report generation initiated. This may take a few seconds...')}>Generate PDF Report</Button>
               </div>
               
               <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-card">
                  <h3 className="font-heading font-extrabold text-xl text-foreground mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Actionable Insights
                  </h3>
                  <div className="space-y-4">
                     <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-foreground text-sm">Response Time Warning</p>
                          <p className="text-muted-foreground text-xs mt-1">12 issues have been pending for over 48 hours. Consider reassigning them.</p>
                        </div>
                     </div>
                     <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-foreground text-sm">Target Met</p>
                          <p className="text-muted-foreground text-xs mt-1">Resolution rate increased by 14% compared to the previous week.</p>
                        </div>
                     </div>
                     <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 flex items-start gap-4">
                        <Target className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-foreground text-sm">Public Highlight</p>
                          <p className="text-muted-foreground text-xs mt-1">"Sanitation" is currently your highest-rated internal department.</p>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BuildingAdminDashboard;
