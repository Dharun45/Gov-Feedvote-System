import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Phone, Mail, Save, ArrowLeft, Shield, Eye, EyeOff, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiGetMe, apiUpdateProfile, apiChangePassword, clearToken } from '@/lib/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'profile' | 'security'>('profile');

  // Profile form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Password form
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdChanged, setPwdChanged] = useState(false);

  useEffect(() => {
    apiGetMe()
      .then(res => {
        setUser(res.user);
        setName(res.user.name || '');
        setPhone(res.user.phone || '');
      })
      .catch(() => navigate('/admin/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiUpdateProfile({ name, phone });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) return toast.error('New passwords do not match');
    if (newPwd.length < 8) return toast.error('Password must be at least 8 characters');
    setSaving(true);
    try {
      await apiChangePassword({ currentPassword: currentPwd, newPassword: newPwd });
      setPwdChanged(true);
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      toast.success('Password changed successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-yellow-100 text-yellow-800',
    BUILDING_ADMIN: 'bg-blue-100 text-blue-800',
    USER: 'bg-green-100 text-green-800',
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-muted-foreground animate-pulse">Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container mx-auto max-w-3xl px-4 pt-6 pb-16">
          <Link to={user?.role === 'SUPER_ADMIN' ? '/superadmin/dashboard' : user?.role === 'BUILDING_ADMIN' ? '/building-admin/dashboard' : '/'} className="inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center shadow-lg">
              <span className="font-heading font-black text-3xl text-white">{name?.[0]?.toUpperCase() || '?'}</span>
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold mb-1">{name}</h1>
              <p className="text-primary-foreground/60 text-sm">{user?.email}</p>
              <span className={`mt-2 inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${roleColors[user?.role] || 'bg-white/20 text-white'}`}>
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 -mt-8 pb-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-muted/50 rounded-2xl p-1.5 max-w-xs">
          {['profile', 'security'].map(t => (
            <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t === 'profile' ? <><User className="w-3.5 h-3.5 inline mr-1.5" />Profile</> : <><Shield className="w-3.5 h-3.5 inline mr-1.5" />Security</>}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h2 className="font-heading font-bold text-lg mb-5">Profile Information</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={name} onChange={e => setName(e.target.value)} className="pl-10 h-11" placeholder="Your name" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={phone} onChange={e => setPhone(e.target.value)} className="pl-10 h-11" placeholder="+91 9999999999" />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={user?.email} disabled className="pl-10 h-11 opacity-60 cursor-not-allowed" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="outline" onClick={handleLogout} className="text-destructive border-destructive/30 hover:bg-destructive/5">Logout</Button>
                <Button type="submit" className="gap-2" disabled={saving}>
                  {saving ? 'Saving...' : <><Save className="w-4 h-4" />Save Changes</>}
                </Button>
              </div>
            </form>
          </div>
        )}

        {tab === 'security' && (
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
            <h2 className="font-heading font-bold text-lg mb-5">Change Password</h2>
            {pwdChanged && (
              <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl mb-5">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <p className="text-sm text-success font-medium">Password changed successfully!</p>
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type={showPwd ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} className="pl-10 pr-10 h-11" placeholder="Enter current password" required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="pl-10 h-11" placeholder="Minimum 8 characters" required />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className={`pl-10 h-11 ${confirmPwd && confirmPwd !== newPwd ? 'border-destructive' : ''}`} placeholder="Repeat new password" required />
                </div>
                {confirmPwd && confirmPwd !== newPwd && <p className="text-xs text-destructive mt-1">Passwords don't match</p>}
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" className="gap-2" disabled={saving}>
                  {saving ? 'Changing...' : <><Shield className="w-4 h-4" />Change Password</>}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Forgot your current password?</p>
              <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">Reset via email instead →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
