import { Link } from 'react-router-dom';
import { 
  MapPin, Star, Shield, BarChart3, ArrowRight, Building2, Users, 
  MessageSquare, ChevronRight, Sparkles, Globe, ScanFace, 
  TrendingUp, Award, Clock, Fingerprint, Lock, Zap, FileText, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-hidden">
      {/* Dynamic Nav */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/40 backdrop-blur-md bg-background/80 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform cursor-pointer">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl text-foreground tracking-tight hidden sm:block">GovFeedback<span className="text-primary">.ai</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground font-semibold">
                Administrator Portal
              </Button>
            </Link>
            <Link to="/buildings">
              <Button size="sm" className="gap-2 shadow-lg shadow-primary/20 rounded-xl h-10 px-6 font-bold glow-primary">
                Civic Hub <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 min-h-[90vh] flex items-center border-b border-border/40">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-extrabold mb-8 shadow-sm tracking-wide uppercase cursor-default hover:bg-primary/20 transition-colors">
            <Sparkles className="w-4 h-4" />
            State-of-the-Art Civic Tech
          </div>

          <h1 className="font-heading text-6xl md:text-8xl font-black text-foreground leading-[1.05] mb-8 tracking-tight drop-shadow-sm">
            Demand Better <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-sky-400">Public Governance.</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Find your local civic branches, evaluate government employees, and force accountability via biometrically verified, AI-analyzed impact tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/buildings">
              <Button size="lg" className="w-full sm:w-auto gap-3 text-lg px-10 h-16 rounded-2xl shadow-xl shadow-primary/30 glow-primary transition-transform hover:-translate-y-1 hover:scale-105">
                <MapPin className="w-5 h-5 flex-shrink-0" /> Find Local Offices <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-3 text-lg px-10 h-16 rounded-2xl border-border/80 hover:bg-muted/50 transition-transform hover:-translate-y-1 bg-background/50 backdrop-blur-md">
                <BarChart3 className="w-5 h-5 text-muted-foreground" /> View Live Analytics
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 opacity-60 flex-wrap">
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Realtime Tracking</div>
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><ScanFace className="w-4 h-4 text-sky-500"/> Anti-Fraud Enabled</div>
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><TrendingUp className="w-4 h-4 text-primary"/> Algorithmic Scaling</div>
          </div>
        </div>
      </section>

      {/* Trusted By Strip */}
      <section className="py-10 border-b border-border/40 bg-muted/10">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-bold tracking-widest text-muted-foreground uppercase mb-6">Trusted Infrastructure Partner For</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="font-heading font-black text-xl flex items-center gap-2"><Building2 className="w-6 h-6"/> Municipal Corp</div>
             <div className="font-heading font-black text-xl flex items-center gap-2"><Globe className="w-6 h-6"/> Revenue Dept</div>
             <div className="font-heading font-black text-xl flex items-center gap-2"><FileText className="w-6 h-6"/> Planning Board</div>
             <div className="font-heading font-black text-xl flex items-center gap-2"><Zap className="w-6 h-6"/> Dept of Energy</div>
          </div>
        </div>
      </section>

      {/* Deep Dive Platform Capabilities */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-6xl">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-8">
                 <div className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                       <MapPin className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-heading font-extrabold text-foreground mb-2">Automated Geospatial Routing</h3>
                       <p className="text-muted-foreground leading-relaxed">Instantly connects citizens to the exact branch handling their district without requiring manual searches or knowing specific bureaucratic pipelines. The mapping core auto-detects and draws regional vectors.</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                       <Lock className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-heading font-extrabold text-foreground mb-2">SHA-256 Citizen Obfuscation</h3>
                       <p className="text-muted-foreground leading-relaxed">Submit feedback without fear of retaliation. Biometric face scans are locally converted into non-reversible mathematical hashes, allowing the system to verify your identity strictly to block bots, while permanently deleting the visual image.</p>
                    </div>
                 </div>

                 <div className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all">
                       <MessageSquare className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-heading font-extrabold text-foreground mb-2">NLP Sentiment Engines</h3>
                       <p className="text-muted-foreground leading-relaxed">Saying "It was okay" versus "Absolute disaster" is parsed by an internal Python Neural network which attaches weight modifiers to administrator dashboards, drastically automating complaint prioritization.</p>
                    </div>
                 </div>
              </div>
              
              <div className="order-1 lg:order-2 relative">
                 <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                 <div className="bg-card border border-border/80 rounded-[3rem] p-8 shadow-2xl relative z-10 hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-full h-64 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 overflow-hidden relative">
                       <div className="absolute inset-0 pattern-dots opacity-40 mix-blend-overlay" />
                       <Shield className="w-24 h-24 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <div className="h-4 bg-muted rounded-full w-3/4" />
                       <div className="h-4 bg-muted rounded-full w-full" />
                       <div className="h-4 bg-muted rounded-full w-5/6" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Feature Matrix Grids */}
      <section className="py-24 px-4 bg-muted/30 border-y border-border/40 relative">
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border/60 to-transparent hidden lg:block" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border/60 to-transparent hidden lg:block" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground tracking-tight">The Modern Bureaucracy Tech Stack</h2>
            <p className="text-muted-foreground mt-4 text-xl max-w-2xl mx-auto font-medium">We replaced the archaic complaint box with edge-computing.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Geospatial Radar', desc: 'Auto-detect your location using browser APIs to instantly filter infrastructure and offices inside your district boundaries.', c: 'from-blue-500 to-cyan-400' },
              { icon: ScanFace, title: 'Biometric Integrity', desc: 'Our SHA-256 facial hashing ensures citizens can only vote once per specific timeframe safely.', c: 'from-fuchsia-500 to-pink-400' },
              { icon: MessageSquare, title: 'AI Sentiment Parsing', desc: 'Feedback comments are autonomously parsed by natural language processors to grade community emotion natively.', c: 'from-emerald-500 to-teal-400' },
              { icon: BarChart3, title: 'Predictive Dashboards', desc: 'Admins receive beautifully rendered KPI matrices and line-graphs detailing internal performance over 6-month horizons.', c: 'from-orange-500 to-amber-400' },
              { icon: Award, title: 'Automated Leaderboards', desc: 'Top performing staff are algorithmically sorted and rewarded into department-specific leaderboards in real-time.', c: 'from-indigo-500 to-purple-400' },
              { icon: Clock, title: 'Status Timelines', desc: 'Hold administrators accountable. Issues transition from Pending to Processing visually until marked officially Resolved.', c: 'from-rose-500 to-red-400' }
            ].map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-[2rem] p-8 shadow-xl shadow-border/10 border border-border/50 hover:shadow-2xl hover:border-primary/50 transition-all group overflow-hidden relative cursor-default"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${f.c} opacity-[0.03] group-hover:opacity-10 transition-opacity rounded-bl-full`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${f.c} flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  <f.icon className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-base leading-loose font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Carousel */}
      <section className="py-32 px-4 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />
         <div className="container mx-auto max-w-6xl text-center relative z-10">
            <Badge className="bg-sky-500/20 text-sky-600 hover:bg-sky-500/30 border-none mb-6 px-4 py-1.5 text-xs font-black tracking-widest uppercase">Community Impact</Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground mb-16">What Citizens Are Saying</h2>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { quote: "I used to have to wait 4 hours just to submit a paper complaint about sanitation. With GovFeedback, I geo-located the exact officer handling my sector and submitted a tracked review in exactly 2 minutes.", author: "Arun K.", tag: "Verified Citizen" },
                 { quote: "The biometric lock gave me so much peace of mind. Knowing I could rate the building's infrastructure without my name being directly attached, while preventing spam, is incredible architecture.", author: "Priya S.", tag: "Local Resident" },
                 { quote: "As a regional manager, the dashboard analytics completely changed how we staff. We saw a massive spike in 'Negative' AI sentiment near the revenue department and immediately dispatched aid.", author: "Vikram R.", tag: "Super Administrator" }
               ].map((t, i) => (
                 <div key={i} className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-3xl p-8 text-left shadow-lg hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center gap-1 mb-6 text-warning">
                       <Star className="fill-warning w-5 h-5"/>
                       <Star className="fill-warning w-5 h-5"/>
                       <Star className="fill-warning w-5 h-5"/>
                       <Star className="fill-warning w-5 h-5"/>
                       <Star className="fill-warning w-5 h-5"/>
                    </div>
                    <p className="text-foreground text-lg font-medium leading-relaxed mb-8">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
                          {t.author.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-foreground">{t.author}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.tag}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Massive Data Statistics Segment */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-[#0f172a]" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none mb-6 px-4 py-1.5 text-xs font-black tracking-widest uppercase">System Scale</Badge>
                 <h2 className="font-heading text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6">Empowering Citizens. <br />Auditing The State.</h2>
                 <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10">
                   GovFeedback bridges the colossal gap between citizens and their regional workers. From municipal headquarters to sanitation logistics, our platform has processed thousands of data nodes to spotlight inefficiencies efficiently.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                    <div>
                      <div className="text-5xl font-heading font-black text-white mb-2">99.9%</div>
                      <div className="text-primary font-semibold text-sm uppercase tracking-widest">Server Uptime</div>
                    </div>
                    <div>
                      <div className="text-5xl font-heading font-black text-white mb-2">14-Day</div>
                      <div className="text-sky-400 font-semibold text-sm uppercase tracking-widest">Review Deadlines</div>
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-6 translate-y-12">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-700/50 shadow-2xl hover:border-primary/50 transition-colors">
                       <MapPin className="w-10 h-10 text-indigo-400 mb-6" />
                       <div className="text-4xl font-black text-white mb-2">Regional</div>
                       <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">Smart Dispatching</div>
                    </div>
                    <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-[2rem] p-8 shadow-2xl shadow-primary/30 transform hover:scale-105 transition-transform">
                       <Users className="w-10 h-10 text-white mb-6" />
                       <div className="text-4xl font-black text-white mb-2">Community</div>
                       <div className="text-white/80 text-sm font-bold uppercase tracking-wider">Backed Insights</div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-700/50 shadow-2xl hover:border-emerald-500/50 transition-colors">
                       <Fingerprint className="w-10 h-10 text-emerald-400 mb-6" />
                       <div className="text-4xl font-black text-white mb-2">Encrypted</div>
                       <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">Staff Identities</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-700/50 shadow-2xl hover:border-amber-400/50 transition-colors">
                       <TrendingUp className="w-10 h-10 text-amber-400 mb-6" />
                       <div className="text-4xl font-black text-white mb-2">Live DB</div>
                       <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">MERN Query Sync</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Massive CTA */}
      <section className="py-40 px-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/30 transform rotate-3 hover:scale-110 hover:rotate-6 transition-all">
            <Globe className="w-14 h-14 text-white drop-shadow-md" />
          </div>
          <h2 className="font-heading text-6xl md:text-7xl font-black text-foreground mb-8 tracking-tight">Deploy Civic Accountability Inside Your District.</h2>
          <p className="text-muted-foreground mb-16 text-2xl max-w-3xl mx-auto font-medium">
            It takes exactly 60 seconds to open your scanner, authenticate, and evaluate an official. Tap below to launch the live coordination map.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             <Link to="/buildings">
               <Button size="lg" className="w-full sm:w-auto gap-3 px-14 h-20 rounded-2xl shadow-2xl shadow-primary/30 text-xl glow-primary font-extrabold hover:scale-105 transition-transform">
                 Initialize Map Scan <ArrowRight className="w-6 h-6" />
               </Button>
             </Link>
             <Link to="/admin/login">
               <Button size="lg" variant="outline" className="w-full sm:w-auto gap-3 px-14 h-20 rounded-2xl text-xl font-bold bg-background/50 backdrop-blur hover:bg-muted/50 border-border/80">
                 Admin Sign-In
               </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="pt-20 pb-10 px-4 border-t border-border/60 bg-[#0f172a] text-slate-300">
        <div className="container mx-auto max-w-7xl">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shadow-lg">
                     <Shield className="w-5 h-5 text-white" />
                   </div>
                   <span className="font-heading font-black text-2xl text-white">GovFeedback<span className="text-primary">.ai</span></span>
                 </div>
                 <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                   A next-generation civic tech platform designed to eliminate bureaucracy through geospatial indexing, biometric verification, and autonomous feedback aggregation.
                 </p>
              </div>
              
              <div>
                 <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-6">Platform</h4>
                 <ul className="space-y-4 font-medium text-slate-400">
                    <li><Link to="/buildings" className="hover:text-primary transition-colors">Directory Map</Link></li>
                    <li><Link to="/admin/login" className="hover:text-primary transition-colors">Super Admins</Link></li>
                    <li><Link to="/admin/login" className="hover:text-primary transition-colors">Building Admins</Link></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Analytics Status</a></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-6">Legal & Core</h4>
                 <ul className="space-y-4 font-medium text-slate-400">
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Biometric Guidelines</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">AI Trust Center</a></li>
                 </ul>
              </div>
           </div>
           
           <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium">
             <p className="text-slate-500">© 2026 Smart Geo-Based Government Feedback System. All rights reserved.</p>
             <div className="flex items-center gap-2 text-slate-500">Built for scale. Deployed for citizens.</div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
