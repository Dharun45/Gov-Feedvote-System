import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { Feedback, User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star, Clock, CheckCircle2, TrendingUp, LogOut, User as UserIcon, ArrowLeft } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const currentUser = store.getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setFeedback(store.getFeedbackByUser(currentUser.id));
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Pending': 'bg-warning/10 text-warning border-warning/20',
      'In Progress': 'bg-primary/10 text-primary border-primary/20',
      'Resolved': 'bg-success/10 text-success border-success/20',
    };
    return <Badge variant="outline" className={styles[status] || ''}>{status}</Badge>;
  };

  const canVote = user ? store.canUserVote(user.id) : false;

  const stats = [
    { icon: MessageSquare, label: 'My Feedback', value: feedback.length, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Clock, label: 'Pending', value: feedback.filter(f => f.status === 'Pending').length, color: 'text-warning', bg: 'bg-warning/10' },
    { icon: TrendingUp, label: 'In Progress', value: feedback.filter(f => f.status === 'In Progress').length, color: 'text-info', bg: 'bg-info/10' },
    { icon: CheckCircle2, label: 'Resolved', value: feedback.filter(f => f.status === 'Resolved').length, color: 'text-success', bg: 'bg-success/10' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold leading-tight">My Dashboard</h1>
              <p className="text-xs text-primary-foreground/50">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/buildings')} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="w-4 h-4 mr-1" /> Buildings
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { store.logout(); navigate('/'); }} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Vote Status */}
        <div className={`rounded-2xl p-5 border ${canVote ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}>
          <p className={`font-heading font-bold ${canVote ? 'text-success' : 'text-warning'}`}>
            {canVote ? '✅ You can submit feedback' : '⏳ Voting restricted — try again after 14 days'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-5 shadow-card card-hover"
              style={{ animation: `fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s forwards`, opacity: 0 }}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="font-heading text-3xl font-extrabold text-foreground">{s.value}</div>
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Feedback History */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-card">
          <div className="p-6 border-b border-border/50">
            <h3 className="font-heading font-bold text-foreground text-lg">My Feedback History</h3>
          </div>
          {feedback.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-heading font-semibold">No feedback submitted yet</p>
              <Button className="mt-4" onClick={() => navigate('/buildings')}>Submit Feedback</Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {feedback.map(fb => {
                const emp = store.getEmployee(fb.employeeId);
                const building = store.getBuilding(fb.buildingId);
                return (
                  <div key={fb.id} className="p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium">{fb.comment}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{emp?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{building?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1 text-warning font-semibold text-sm">
                          <Star className="w-3.5 h-3.5 fill-current" /> {fb.rating}
                        </div>
                        {getStatusBadge(fb.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
