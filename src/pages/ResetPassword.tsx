import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiResetPassword, saveToken } from '@/lib/api';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    if (!requirements.every(r => r.met)) return toast.error('Password does not meet requirements');
    setLoading(true);
    try {
      const res = await apiResetPassword(token!, password);
      if (res.token) saveToken(res.token);
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/admin/login'), 2500);
    } catch (err: any) {
      toast.error(err.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl text-foreground leading-tight">GovFeedback Hub</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">1.0 PRO · Secure Portal</p>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-card">
          {!done ? (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-foreground">Set New Password</h2>
                <p className="text-muted-foreground text-sm mt-1">Choose a strong, unique password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">New Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="h-12 pr-12"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength */}
                {password && (
                  <div className="space-y-1.5 p-3 bg-muted/30 rounded-xl">
                    {requirements.map(r => (
                      <div key={r.label} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${r.met ? 'bg-success' : 'bg-border'}`}>
                          {r.met && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={r.met ? 'text-success' : 'text-muted-foreground'}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className={`mt-1.5 h-12 ${confirm && confirm !== password ? 'border-destructive' : ''}`}
                    required
                  />
                  {confirm && confirm !== password && <p className="text-xs text-destructive mt-1">Passwords don't match</p>}
                </div>

                <Button type="submit" className="w-full h-12 gap-2 font-semibold" disabled={loading}>
                  {loading ? <span className="animate-pulse">Resetting password...</span> : <><Lock className="w-4 h-4" /> Reset Password</>}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success animate-bounce" />
              </div>
              <h2 className="font-heading font-bold text-xl text-foreground mb-2">Password Reset!</h2>
              <p className="text-muted-foreground text-sm">Redirecting you to login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
