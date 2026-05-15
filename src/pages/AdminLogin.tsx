import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LogIn, ArrowLeft, Lock, Building2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiAdminLogin, saveToken } from '@/lib/api';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiAdminLogin(email, password);
      saveToken(res.token);
      toast.success(`Welcome, ${res.user.name}!`);
      if (res.user.role === 'SUPER_ADMIN') {
        navigate('/superadmin/dashboard');
      } else if (res.user.role === 'BUILDING_ADMIN') {
        navigate('/building-admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots" />
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-secondary/5 blur-3xl" />

      <div className="w-full max-w-sm relative">
        <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-elevated" style={{ animation: 'fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-hero mx-auto mb-5 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Role-based access for administrators</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-foreground text-sm font-medium">Email Address</Label>
              <Input placeholder="admin@gov.in" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label className="text-foreground text-sm font-medium">Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <Button type="submit" className="w-full gap-2 h-11 shadow-lg" disabled={loading}>
              {loading ? <span className="animate-pulse">Signing in...</span> : <><LogIn className="w-4 h-4" /> Sign In</>}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
              <div className="flex items-center gap-2 mb-1.5">
                <Crown className="w-3.5 h-3.5 text-destructive" />
                <p className="font-heading font-semibold text-xs text-foreground">Super Admin</p>
              </div>
              
            </div>
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <p className="font-heading font-semibold text-xs text-foreground">Building Admin</p>
              </div>
              
            </div>
            <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="font-heading font-semibold text-xs text-foreground">Building Admin 2</p>
              </div>
           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
