import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiForgotPassword } from '@/lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await apiForgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
          {!sent ? (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-foreground">Forgot Password?</h2>
                <p className="text-muted-foreground text-sm mt-1">Enter your email and we'll send a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-1.5 h-12"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 gap-2 font-semibold" disabled={loading}>
                  {loading ? <span className="animate-pulse">Sending reset link...</span> : <><Mail className="w-4 h-4" /> Send Reset Link</>}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success animate-bounce" />
              </div>
              <h2 className="font-heading font-bold text-xl text-foreground mb-2">Check Your Inbox</h2>
              <p className="text-muted-foreground text-sm mb-2">We sent a reset link to</p>
              <p className="text-primary font-semibold text-sm mb-6">{email}</p>
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">The link will expire in <strong>1 hour</strong>. Check your spam folder if you don't see it.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
