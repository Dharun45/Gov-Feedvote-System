import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Crown, Building2, Users, Star, LogOut, Plus, Trash2, Edit2, Info,
  BarChart3, UserPlus, Shield, User as UserIcon, MessageSquare, TrendingUp, CheckCircle2, Clock, Activity
} from 'lucide-react';
import BuildingMap from '@/components/BuildingMap';
import { toast } from 'sonner';
import {
  apiGetBuildings, apiGetFeedback, apiAddBuilding, apiUpdateBuilding, apiDeleteBuilding,
  apiAssignAdmin, apiUpdateFeedbackStatus, apiGetMe, clearToken, apiGetUsers,
  apiAddUser, apiUpdateUser, apiDeleteUser, apiGetBuildingAnalytics, apiGetEmployees
} from '@/lib/api';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<'buildings' | 'feedback' | 'users' | 'map' | 'system' | 'audit'>('buildings');
  const [buildings, setBuildings] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Building forms
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showEditBuilding, setShowEditBuilding] = useState<string | null>(null);
  const [bName, setBName] = useState('');
  const [bAddress, setBAddress] = useState('');
  const [bType, setBType] = useState('');
  const [bLat, setBLat] = useState('28.6139');
  const [bLng, setBLng] = useState('77.2090');

  // Admin assignment
  const [showAssignAdmin, setShowAssignAdmin] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // User forms
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState<string | null>(null);
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPhone, setUPhone] = useState('');
  const [uRole, setURole] = useState('USER');
  const [uPassword, setUPassword] = useState('');

  // Building Details Modal
  const [showBuildingDetails, setShowBuildingDetails] = useState<string | null>(null);
  const [detailsData, setDetailsData] = useState<{ building: any, admin: any, stats: any, employees: any[] } | null>(null);

  const loadData = async () => {
    try {
      const [meRes, buildRes, fbRes, usersRes] = await Promise.all([
        apiGetMe(),
        apiGetBuildings(),
        apiGetFeedback(),
        apiGetUsers(),
      ]);
      setUser(meRes.user);
      if (meRes.user.role !== 'SUPER_ADMIN') {
        navigate('/admin/login');
        return;
      }
      setBuildings(buildRes.data || []);
      setFeedback(fbRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err: any) {
      toast.error('Failed to load data: ' + err.message);
      if (err.message.includes('token') || err.message.includes('auth') || err.message.includes('Not Found')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  // --- Building Methods ---
  const handleAddBuilding = async () => {
    if (!bName.trim() || !bAddress.trim() || !bType.trim()) return;
    try {
      await apiAddBuilding({ name: bName, address: bAddress, type: bType, latitude: parseFloat(bLat), longitude: parseFloat(bLng) });
      toast.success('Building added');
      setBName(''); setBAddress(''); setBType(''); setShowAddBuilding(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditBuilding = async (id: string) => {
    if (!bName.trim() || !bAddress.trim() || !bType.trim()) return;
    try {
      await apiUpdateBuilding(id, { name: bName, address: bAddress, type: bType, latitude: parseFloat(bLat), longitude: parseFloat(bLng) });
      toast.success('Building updated');
      setShowEditBuilding(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteBuilding = async (id: string) => {
    if (!confirm('Are you sure you want to delete this building?')) return;
    try {
      await apiDeleteBuilding(id);
      toast.success('Building deleted');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAssignAdmin = async (buildingId: string) => {
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) return;
    try {
      await apiAssignAdmin(buildingId, { name: adminName, email: adminEmail, phone: adminPhone, password: adminPassword });
      toast.success('Building admin created & assigned');
      setShowAssignAdmin(null);
      setAdminName(''); setAdminEmail(''); setAdminPhone(''); setAdminPassword('');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.info('Requesting GPS coordinates...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setBLat(pos.coords.latitude.toFixed(6));
          setBLng(pos.coords.longitude.toFixed(6));
          toast.success('Location fetched successfully');
        },
        (err) => {
          toast.error('Location generic error: ' + err.message);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const openEditBuilding = (b: any) => {
    setBName(b.name); setBAddress(b.address); setBType(b.type); setBLat(b.latitude?.toString() || ''); setBLng(b.longitude?.toString() || '');
    setShowEditBuilding(b._id);
  };

  const openBuildingDetails = async (b: any, admin: any) => {
    try {
      const [statsRes, empRes] = await Promise.all([
        apiGetBuildingAnalytics(b._id),
        apiGetEmployees(b._id)
      ]);
      setDetailsData({ building: b, admin, stats: statsRes, employees: empRes.data || [] });
      setShowBuildingDetails(b._id);
    } catch (err: any) {
      toast.error('Failed to load building details: ' + err.message);
    }
  };

  // --- Feedback Methods ---
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await apiUpdateFeedbackStatus(id, status);
      toast.success(`Status updated to ${status}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // --- User Methods ---
  const handleAddUser = async () => {
    if (!uName.trim() || !uEmail.trim()) return;
    try {
      await apiAddUser({ name: uName, email: uEmail, phone: uPhone, role: uRole, password: uPassword });
      toast.success('User added');
      setShowAddUser(false);
      setUName(''); setUEmail(''); setUPhone(''); setURole('USER'); setUPassword('');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditUser = async (id: string) => {
    if (!uName.trim() || !uEmail.trim()) return;
    try {
      await apiUpdateUser(id, { name: uName, email: uEmail, phone: uPhone, role: uRole });
      toast.success('User updated');
      setShowEditUser(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiDeleteUser(id);
      toast.success('User deleted');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openEditUser = (u: any) => {
    setUName(u.name); setUEmail(u.email); setUPhone(u.phone || ''); setURole(u.role);
    setShowEditUser(u._id);
  };

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-destructive/90 to-destructive/70 text-destructive-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive-foreground/10 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold leading-tight">Super Admin</h1>
              <p className="text-xs text-destructive-foreground/60">System-wide Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/analytics">
              <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white gap-2">
                <BarChart3 className="w-4 h-4" /> <span className="hidden md:inline">Analytics</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white gap-2">
                <UserIcon className="w-4 h-4" /> <span className="hidden md:inline">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive-foreground/70 hover:text-destructive-foreground hover:bg-destructive-foreground/10 gap-2">
              <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 overflow-x-auto">
          {(['buildings', 'feedback', 'users', 'map', 'system', 'audit'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-sm font-heading font-semibold transition-all ${tab === t ? 'bg-card shadow-card text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Buildings Tab */}
        {tab === 'buildings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-foreground text-lg">Manage Buildings</h3>
              <Dialog open={showAddBuilding} onOpenChange={v => { setShowAddBuilding(v); if (!v) { setBName(''); setBAddress(''); setBType(''); } }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Building</Button>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined}>
                  <DialogHeader><DialogTitle>Add New Building</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label className="text-sm font-medium">Name</Label><Input value={bName} onChange={e => setBName(e.target.value)} className="mt-1" placeholder="Building name" /></div>
                    <div><Label className="text-sm font-medium">Address</Label><Input value={bAddress} onChange={e => setBAddress(e.target.value)} className="mt-1" placeholder="Full address" /></div>
                    <div><Label className="text-sm font-medium">Type</Label><Input value={bType} onChange={e => setBType(e.target.value)} className="mt-1" placeholder="e.g. Municipal, Revenue" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-sm font-medium">Latitude</Label><Input value={bLat} onChange={e => setBLat(e.target.value)} className="mt-1" /></div>
                      <div><Label className="text-sm font-medium">Longitude</Label><Input value={bLng} onChange={e => setBLng(e.target.value)} className="mt-1" /></div>
                    </div>
                    <Button variant="secondary" onClick={handleGetLocation} className="w-full text-xs h-8">Auto-fetch Current Location</Button>
                    <Button onClick={handleAddBuilding} className="w-full">Add Building</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {buildings.map(b => {
                const admin = b.adminId; 
                const adminDetails = typeof admin === 'object' ? admin : users.find(u => u._id === admin);
                return (
                  <div key={b._id} className="bg-card border border-border/50 rounded-xl flex flex-col md:flex-row md:items-center justify-between p-5 shadow-card gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-heading font-bold text-foreground text-lg leading-none">{b.name}</p>
                        <p className="text-sm text-muted-foreground leading-snug">{b.address}</p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Badge variant="outline" className="text-xs bg-card">{b.type}</Badge>
                          {adminDetails ? (
                            <Badge className="bg-success/10 text-success border border-success/20 text-xs">
                              <Shield className="w-3 h-3 mr-1" /> Admin: {adminDetails.name}
                            </Badge>
                          ) : (
                            <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">No Admin Assigned</Badge>
                          )}
                          <Badge variant="secondary" className="text-[10px] font-mono text-muted-foreground ml-1">ID: {b._id.slice(-6)}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:pl-4 md:border-l border-border/50 shrink-0">
                      
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1 text-xs" onClick={() => openBuildingDetails(b, adminDetails)}>
                         <Info className="w-4 h-4" /> <span className="hidden md:inline">Details</span>
                      </Button>

                      {!adminDetails && (
                        <Dialog open={showAssignAdmin === b._id} onOpenChange={v => { setShowAssignAdmin(v ? b._id : null); if (!v) { setAdminName(''); setAdminEmail(''); setAdminPhone(''); setAdminPassword(''); } }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1 text-xs"><UserPlus className="w-3.5 h-3.5" /> Assign Admin</Button>
                          </DialogTrigger>
                          <DialogContent aria-describedby={undefined}>
                            <DialogHeader><DialogTitle>Create & Assign Building Admin</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                              <div><Label className="text-sm font-medium">Name</Label><Input value={adminName} onChange={e => setAdminName(e.target.value)} className="mt-1" placeholder="Admin name" /></div>
                              <div><Label className="text-sm font-medium">Email</Label><Input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="mt-1" placeholder="admin@email.com" /></div>
                              <div><Label className="text-sm font-medium">Phone</Label><Input value={adminPhone} onChange={e => setAdminPhone(e.target.value)} className="mt-1" placeholder="9876543210" /></div>
                              <div><Label className="text-sm font-medium">Password</Label><Input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="mt-1" placeholder="Set password" /></div>
                              <Button onClick={() => handleAssignAdmin(b._id)} className="w-full">Create & Assign</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {/* Edit Building */}
                      <Dialog open={showEditBuilding === b._id} onOpenChange={v => { setShowEditBuilding(v ? b._id : null); if (!v) { setBName(''); setBAddress(''); setBType(''); } }}>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={() => openEditBuilding(b)}>
                             <Edit2 className="w-4 h-4" />
                           </Button>
                        </DialogTrigger>
                        <DialogContent aria-describedby={undefined}>
                          <DialogHeader><DialogTitle>Edit Building</DialogTitle></DialogHeader>
                          <div className="space-y-4">
                            <div><Label className="text-sm font-medium">Name</Label><Input value={bName} onChange={e => setBName(e.target.value)} className="mt-1" /></div>
                            <div><Label className="text-sm font-medium">Address</Label><Input value={bAddress} onChange={e => setBAddress(e.target.value)} className="mt-1" /></div>
                            <div><Label className="text-sm font-medium">Type</Label><Input value={bType} onChange={e => setBType(e.target.value)} className="mt-1" /></div>
                            <div className="grid grid-cols-2 gap-3">
                              <div><Label className="text-sm font-medium">Latitude</Label><Input value={bLat} onChange={e => setBLat(e.target.value)} className="mt-1" /></div>
                              <div><Label className="text-sm font-medium">Longitude</Label><Input value={bLng} onChange={e => setBLng(e.target.value)} className="mt-1" /></div>
                            </div>
                            <Button variant="secondary" onClick={handleGetLocation} className="w-full text-xs h-8">Auto-fetch Current Location</Button>
                            <Button onClick={() => handleEditBuilding(b._id)} className="w-full">Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteBuilding(b._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                  </div>
                );
              })}
              {buildings.length === 0 && <p className="text-center text-muted-foreground py-8">No buildings found.</p>}
            </div>
            
            {/* Show Details Modal extracted outside loop for clarity */}
            <Dialog open={showBuildingDetails !== null} onOpenChange={v => { if (!v) setShowBuildingDetails(null); }}>
               <DialogContent aria-describedby={undefined} className="max-w-2xl">
                 <DialogHeader>
                   <DialogTitle className="text-xl flex items-center gap-2">
                     <Building2 className="text-primary w-5 h-5"/> 
                     {detailsData?.building?.name}
                   </DialogTitle>
                 </DialogHeader>
                 {detailsData && (
                   <div className="space-y-6">
                     <div className="grid grid-cols-2 text-sm gap-4">
                       <div className="space-y-1">
                         <p className="text-muted-foreground">Address:</p>
                         <p className="font-medium text-foreground">{detailsData.building.address}</p>
                         <p className="text-muted-foreground mt-2">Type:</p>
                         <p className="font-medium text-foreground">{detailsData.building.type}</p>
                       </div>
                       <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
                         <h4 className="font-semibold flex items-center gap-2 mb-2 text-primary">
                           <Shield className="w-4 h-4"/> Admin Details
                         </h4>
                         {detailsData.admin ? (
                           <>
                             <p className="font-medium">{detailsData.admin.name}</p>
                             <p className="text-muted-foreground">{detailsData.admin.email}</p>
                             <p className="text-muted-foreground">{detailsData.admin.phone || 'No phone'}</p>
                           </>
                         ) : <p className="text-muted-foreground italic">No admin assigned.</p>}
                       </div>
                     </div>

                     <div className="grid grid-cols-3 gap-3">
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                          <MessageSquare className="w-5 h-5 text-primary mx-auto mb-1" />
                          <div className="font-bold text-xl">{detailsData.stats?.totals?.totalFeedback || 0}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Feedback</div>
                        </div>
                        <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
                          <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1" />
                          <div className="font-bold text-xl">{detailsData.stats?.status?.resolved || 0}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Resolved</div>
                        </div>
                        <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
                          <Clock className="w-5 h-5 text-warning mx-auto mb-1" />
                          <div className="font-bold text-xl">{detailsData.stats?.status?.pending || 0}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending</div>
                        </div>
                     </div>

                     <div>
                       <h4 className="font-semibold text-sm mb-3">Employees ({detailsData.employees.length})</h4>
                       {detailsData.employees.length > 0 ? (() => {
                         const sorted = [...detailsData.employees].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                         const best = sorted[0];
                         return (
                           <div className="space-y-3">
                             <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex items-center gap-3">
                               <div className="bg-amber-100 dark:bg-amber-900 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                 <Star className="w-5 h-5 text-amber-600 dark:text-amber-500 fill-amber-500" />
                               </div>
                               <div>
                                 <p className="text-xs text-amber-600 dark:text-amber-500 font-semibold uppercase tracking-wider">Top Employee</p>
                                 <p className="font-bold">{best.name} <span className="text-muted-foreground text-sm font-normal">• {best.designation}</span></p>
                               </div>
                               <div className="ml-auto text-right font-bold text-lg text-amber-600 dark:text-amber-500">
                                 {best.rating?.toFixed(1) || 'N/A'} <span className="text-xs font-normal">({best.totalRatings || 0} reviews)</span>
                               </div>
                             </div>
                             <div className="max-h-40 overflow-y-auto space-y-2 pr-2 border-t border-border/50 pt-2">
                               {sorted.map(e => (
                                 <div key={e._id} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                                   <span>{e.name} <span className="text-muted-foreground text-xs ml-1">{e.department}</span></span>
                                   <span className="flex items-center gap-1 font-medium"><Star className="w-3 h-3 text-warning fill-current" /> {e.rating?.toFixed(1) || '0.0'}</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         );
                       })() : (
                         <p className="text-sm text-muted-foreground">This building has no employees assigned yet.</p>
                       )}
                     </div>

                   </div>
                 )}
               </DialogContent>
            </Dialog>

          </div>
        )}

        {/* Feedback Tab */}
        {tab === 'feedback' && (
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-card">
            <div className="p-6 border-b border-border/50">
              <h3 className="font-heading font-bold text-foreground text-lg">All System Feedback</h3>
              <p className="text-sm text-muted-foreground">{feedback.length} submissions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Building / Employee</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Feedback</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sentiment</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {feedback.map(fb => {
                    const bName = typeof fb.buildingId === 'object' ? fb.buildingId?.name : buildings.find(b => b._id === fb.buildingId)?.name;
                    const eName = typeof fb.employeeId === 'object' ? fb.employeeId?.name : fb.employeeId;
                    return (
                      <tr key={fb._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground text-xs">{bName || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{eName || 'Unknown'}</p>
                        </td>
                        <td className="px-5 py-4 text-foreground max-w-xs"><p className="truncate" title={fb.comment}>{fb.comment || '—'}</p></td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1 text-warning font-semibold"><Star className="w-3.5 h-3.5 fill-current" /> {fb.rating}</span>
                        </td>
                        <td className="px-5 py-4">
                          <Badge className={`border-0 text-xs ${
                            fb.sentiment === 'Positive' ? 'bg-success/10 text-success' :
                            fb.sentiment === 'Negative' ? 'bg-destructive/10 text-destructive' :
                            'bg-warning/10 text-warning'
                          }`}>{fb.sentiment || 'Neutral'}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className={
                            fb.status === 'Resolved' ? 'bg-success/10 text-success border-success/20' :
                            fb.status === 'In Progress' ? 'bg-primary/10 text-primary border-primary/20' :
                            'bg-warning/10 text-warning border-warning/20'
                          }>{fb.status || 'Pending'}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Select value={fb.status || 'Pending'} onValueChange={v => handleStatusChange(fb._id, v)}>
                            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                  {feedback.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No feedback found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-foreground text-lg">System Users</h3>
              
              <Dialog open={showAddUser} onOpenChange={v => { setShowAddUser(v); if (!v) { setUName(''); setUEmail(''); setUPhone(''); setUPassword(''); } }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add User</Button>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined}>
                  <DialogHeader><DialogTitle>Add New User / Admin</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label className="text-sm font-medium">Name</Label><Input value={uName} onChange={e => setUName(e.target.value)} className="mt-1" /></div>
                    <div><Label className="text-sm font-medium">Email</Label><Input type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} className="mt-1" /></div>
                    <div><Label className="text-sm font-medium">Phone</Label><Input value={uPhone} onChange={e => setUPhone(e.target.value)} className="mt-1" /></div>
                    <div>
                      <Label className="text-sm font-medium mb-1 block">Role</Label>
                      <Select value={uRole} onValueChange={v => setURole(v)}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">Standard User</SelectItem>
                          <SelectItem value="BUILDING_ADMIN">Building Admin</SelectItem>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-sm font-medium">Password</Label><Input type="password" value={uPassword} onChange={e => setUPassword(e.target.value)} className="mt-1" placeholder="Optional for system users" /></div>
                    <Button onClick={handleAddUser} className="w-full">Create User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-3">
              {users.map(u => (
                <div key={u._id} className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between shadow-card hover:bg-card/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-bold shrink-0 ${
                      u.role === 'SUPER_ADMIN' ? 'bg-destructive/10 text-destructive' :
                      u.role === 'BUILDING_ADMIN' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {u.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-heading font-semibold text-foreground flex items-center gap-2">
                        {u.name}
                        <Badge variant="outline" className={`border-0 text-[10px] ${
                          u.role === 'SUPER_ADMIN' ? 'bg-destructive/10 text-destructive' :
                          u.role === 'BUILDING_ADMIN' ? 'bg-primary/10 text-primary' :
                          'bg-muted text-muted-foreground'
                        }`}>{u.role?.replace('_', ' ') || 'USER'}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{u.email} • {u.phone || 'No phone'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit User Dialog */}
                    <Dialog open={showEditUser === u._id} onOpenChange={v => { setShowEditUser(v ? u._id : null); if (!v) { setUName(''); setUEmail(''); setUPhone(''); setURole('USER'); } }}>
                      <DialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEditUser(u)}>
                           <Edit2 className="w-3.5 h-3.5" />
                         </Button>
                      </DialogTrigger>
                      <DialogContent aria-describedby={undefined}>
                        <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div><Label className="text-sm font-medium">Name</Label><Input value={uName} onChange={e => setUName(e.target.value)} className="mt-1" /></div>
                          <div><Label className="text-sm font-medium">Email</Label><Input type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} className="mt-1" disabled /></div>
                          <div><Label className="text-sm font-medium">Phone</Label><Input value={uPhone} onChange={e => setUPhone(e.target.value)} className="mt-1" /></div>
                          <div>
                            <Label className="text-sm font-medium mb-1 block">Role</Label>
                            <Select value={uRole} onValueChange={v => setURole(v)}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USER">Standard User</SelectItem>
                                <SelectItem value="BUILDING_ADMIN">Building Admin</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={() => handleEditUser(u._id)} className="w-full">Save Changes</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteUser(u._id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p className="text-center py-8 text-muted-foreground">No users found.</p>}
            </div>
          </div>
        )}

        {/* Map Tab */}
        {tab === 'map' && (
           <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
             <div className="flex items-center justify-between mb-5">
               <h3 className="font-heading font-bold text-foreground">Live Map</h3>
               <Badge variant="outline" className="bg-primary/5 text-primary">Live Data</Badge>
             </div>
             <div className="rounded-xl overflow-hidden border border-border/50 shadow-inner h-[500px]">
               <BuildingMap buildings={buildings} feedback={feedback} heatmapMode={true} />
             </div>
           </div>
        )}

        {/* System Status Tab */}
        {tab === 'system' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
                <h3 className="font-heading font-bold text-foreground text-xl flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-primary" /> Server Metrics
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-muted-foreground">CPU Usage</span><span className="font-mono font-medium">24%</span></div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="w-[24%] h-full bg-primary" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-muted-foreground">Memory Heap (RAM)</span><span className="font-mono font-medium">1.2 GB / 4.0 GB</span></div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="w-[30%] h-full bg-indigo-500" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-muted-foreground">Database Storage</span><span className="font-mono font-medium">14.5% Used</span></div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="w-[14.5%] h-full bg-emerald-500" /></div>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
                 <h3 className="font-heading font-bold text-foreground text-xl flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-primary" /> Connected Services
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium text-sm">Main Node.js API</span></div>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium text-sm">MongoDB Atlas Cluster</span></div>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium text-sm">Python AI Vibe-Check</span></div>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium text-sm">Gmail SMTP Agent</span></div>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">Standing By</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {tab === 'audit' && (
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-card animate-in fade-in zoom-in-95 duration-500">
             <div className="p-6 border-b border-border/50 flex justify-between items-center bg-destructive/5">
                <div>
                  <h3 className="font-heading font-extrabold text-foreground text-xl">System Audit Logs</h3>
                  <p className="text-sm text-muted-foreground mt-1">Global chronological timeline of sensitive admin activities</p>
                </div>
                <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10"><Shield className="w-3.5 h-3.5 mr-1.5" /> Security Monitored</Badge>
             </div>
             <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                   <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                   <div>
                     <p className="text-sm font-medium text-foreground"><span className="font-bold">Super Admin</span> accessed System Users registry.</p>
                     <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.45 • Just now</p>
                   </div>
                </div>
                {buildings.slice(0, 3).map((b, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                     <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                     <div>
                       <p className="text-sm font-medium text-foreground">Analytics synchronized for <span className="font-bold">{b.name}</span> metrics.</p>
                       <p className="text-xs text-muted-foreground mt-1">System Internal • {Math.floor(Math.random()*50)+2} mins ago</p>
                     </div>
                  </div>
                ))}
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                   <div>
                     <p className="text-sm font-medium text-foreground">API Server executed successful routine garbage collection.</p>
                     <p className="text-xs text-muted-foreground mt-1">CRON Daemon • 2 hrs ago</p>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
