import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ChevronRight, Loader2 } from 'lucide-react';
import { apiGetEmployees } from '@/lib/api';

const EmployeeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const buildingId = location.state?.buildingId;
  const [employees, setEmployees] = useState<any[]>([]);
  const [building, setBuilding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buildingId) {
      navigate('/buildings');
      return;
    }

    const loadData = async () => {
      try {
        const [empRes, bRes] = await Promise.all([
          apiGetEmployees(buildingId),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/buildings/${buildingId}`).then(r => r.json())
        ]);
        
        setEmployees(empRes.data || []);
        setBuilding(bRes.data || null);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [buildingId]);

  const getRatingStyle = (r: number) => {
    if (r >= 4) return 'bg-success/10 text-success border-success/20';
    if (r >= 3) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-[#0f172a] text-white relative shadow-xl overflow-hidden pb-10 flex-shrink-0">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-primary/30 rounded-full blur-[80px]" />
        
        <div className="container mx-auto max-w-4xl px-4 pt-6 relative z-10">
          <Link to="/buildings" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-sm mb-6 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Return to Map
          </Link>
          
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : building?.name || 'Unknown Building'}
          </h1>
          <p className="text-primary-foreground/70 text-sm font-medium">
            {loading ? 'Discovering staff...' : `${employees.length} government employees stationed here. Select one to submit an evaluation.`}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-6 relative z-50 flex-1">
        
        {loading ? (
           <div className="flex justify-center py-20 text-muted-foreground animate-pulse">
             <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 opacity-50" />
                <p className="font-semibold text-sm">Searching internal directory...</p>
             </div>
           </div>
        ) : (
          <div className="grid gap-3">
            {employees.length > 0 ? employees.map((emp, i) => (
              <Link key={emp._id} to={`/feedback`} state={{ employeeId: emp._id }}>
                <div
                  className="bg-card border border-border/50 rounded-3xl p-5 hover:shadow-card hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden"
                  style={{ animation: `fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s forwards`, opacity: 0 }}
                >
                  <div className="absolute w-2 h-full bg-primary/0 group-hover:bg-primary/10 top-0 left-0 transition-colors" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shrink-0 shadow-md">
                        <span className="font-heading font-extrabold text-white text-xl">{emp.avatar || emp.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">{emp.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium truncate">{emp.designation} <span className="text-xs ml-1 font-normal opacity-70">• {emp.department}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pl-16 sm:pl-0">
                       <div className="w-full sm:w-32 hidden sm:flex flex-col items-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                         <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex justify-end">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${(emp.rating / 5) * 100}%` }} />
                         </div>
                         <span className="text-[10px] uppercase font-bold text-muted-foreground">{emp.totalRatings || 0} reviews</span>
                       </div>

                       <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-transparent font-bold text-sm ${getRatingStyle(emp.rating)}`}>
                         <Star className="w-3.5 h-3.5 fill-current" />
                         {(emp.rating || 0).toFixed(1)}
                       </div>
                       
                       <div className="w-8 h-8 rounded-full bg-muted/40 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                         <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="bg-card border border-dashed border-border/80 rounded-3xl p-16 flex flex-col items-center justify-center text-center opacity-70">
                 <h3 className="text-xl font-heading font-bold text-foreground">Empty Registry</h3>
                 <p className="text-sm text-muted-foreground mt-2 max-w-sm">No administrators or staff members have been officially assigned to handle feedback for this building yet.</p>
                 <Link to="/buildings">
                    <Button variant="outline" className="mt-6 rounded-xl shadow-sm">Explore other buildings</Button>
                 </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeList;
