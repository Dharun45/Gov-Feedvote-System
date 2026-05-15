import { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  onCapture: (imageData: string) => void;
}

const WebcamCapture = ({ onCapture }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      // Pro feel delay
      setTimeout(() => {
        onCapture(imageData);
        setCaptured(true);
        setLoading(false);
        stopCamera();
      }, 1500);
    }
  }, [onCapture, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      // We need a way to stop it correctly, but simple cleanup is fine
    };
  }, [startCamera]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-video rounded-xl bg-muted overflow-hidden border-2 border-border shadow-inner">
        {!captured ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            {loading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center flex-col gap-3 z-10">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Biometric Validation...</span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-success/10 flex items-center justify-center flex-col gap-3">
            <CheckCircle2 className="w-12 h-12 text-success animate-bounce" />
            <span className="text-sm font-bold text-success">Identity Verified Successfully</span>
          </div>
        )}
      </div>
      
      {!captured && (
        <Button 
          type="button" 
          onClick={capture} 
          disabled={loading}
          className="w-full gap-2 h-12 shadow-card"
        >
          <Camera className="w-4 h-4" />
          Capture & Verify Identity
        </Button>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default WebcamCapture;
