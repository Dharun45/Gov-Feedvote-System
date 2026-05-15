import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Success = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <div className="text-center max-w-md" style={{ animation: 'fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}>
      <div className="relative mx-auto mb-8 w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-secondary/10 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="relative w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-secondary" />
        </div>
      </div>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">Feedback Submitted!</h1>
      <p className="text-muted-foreground mb-3">
        Thank you for your valuable input. The concerned admin has been notified.
      </p>
      <div className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mb-8">
        <Sparkles className="w-4 h-4" /> AI sentiment analysis complete
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/buildings">
          <Button className="gap-2 shadow-lg">
            Submit Another <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <Home className="w-4 h-4" /> Home
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default Success;
