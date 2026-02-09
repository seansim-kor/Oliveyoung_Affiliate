import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  onUpload: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, onUpload }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    stopCamera();
    setError(null);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions or use upload.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror image if in user mode to feel like a mirror
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            stopCamera();
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-rose-500" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Camera Unavailable</h3>
        <p className="text-slate-400 mb-8 max-w-xs">{error}</p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={onUpload} variant="secondary" fullWidth>
            <Upload size={20} />
            Upload Photo Instead
          </Button>
          <Button onClick={onClose} variant="outline" fullWidth className="text-slate-300 border-slate-700 hover:bg-slate-800">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-black/50 text-white rounded-full backdrop-blur-md z-10"
        >
          <X size={24} />
        </button>

        {/* Camera Overlay Guide */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-80 border border-white/30 rounded-[50%] box-border shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]"></div>
        </div>
      </div>

      <div className="h-32 bg-slate-900 flex items-center justify-around px-8 pb-4">
        <button
          onClick={toggleCamera}
          className="p-4 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw size={24} />
        </button>

        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          <div className="w-16 h-16 rounded-full bg-rose-500"></div>
        </button>

        <button
          onClick={onUpload}
          className="p-4 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Upload Photo"
        >
          <Upload size={24} />
        </button>
      </div>
    </div>
  );
};