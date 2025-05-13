"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Camera, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface CameraCaptureProps {
  onImageCapture: (imageDataUrl: string) => void;
  disabled?: boolean;
}

export function CameraCapture({ onImageCapture, disabled }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    if (stream) return; // Camera already started
    setIsCameraInitializing(true);
    setError(null);
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      let message = "Could not access camera. Please check permissions.";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          message = "Camera permission denied. Please allow camera access in your browser settings.";
        } else if (err.name === "NotFoundError") {
          message = "No camera found. Please ensure a camera is connected and enabled.";
        }
      }
      setError(message);
      toast({
        title: "Camera Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsCameraInitializing(false);
    }
  }, [stream, toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  useEffect(() => {
    // Clean up camera stream when component unmounts or is disabled
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (disabled && stream) {
      stopCamera();
    }
  }, [disabled, stream, stopCamera]);


  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        onImageCapture(imageDataUrl);
        stopCamera(); // Stop camera after capture
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  if (disabled) {
     return (
      <div className="p-4 border border-dashed border-border rounded-lg aspect-video bg-muted/50 flex flex-col items-center justify-center text-muted-foreground">
        <Camera className="h-16 w-16 mb-2 opacity-50" />
        <p>Camera is disabled</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Use Camera</Label>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video relative bg-black flex items-center justify-center">
            {error && !isCameraInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-destructive-foreground p-4 text-center">
                <AlertTriangle className="w-12 h-12 mb-2 text-destructive" />
                <p className="font-semibold">Camera Error</p>
                <p className="text-sm">{error}</p>
                <Button onClick={startCamera} variant="secondary" size="sm" className="mt-4">Try Again</Button>
              </div>
            )}
            {isCameraInitializing && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                 <Zap className="w-12 h-12 mb-2 animate-pulse" />
                 <p>Initializing Camera...</p>
               </div>
            )}
            {capturedImage ? (
              <Image src={capturedImage} alt="Captured image" layout="fill" objectFit="contain" />
            ) : (
              <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${stream ? '' : 'hidden'}`} />
            )}
            {!stream && !capturedImage && !error && !isCameraInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
                <Camera className="w-16 h-16 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Click "Start Camera" to begin</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2 justify-center">
        {!stream && !capturedImage && (
          <Button onClick={startCamera} disabled={isCameraInitializing || disabled} className="w-full sm:w-auto">
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        )}
        {stream && !capturedImage && (
          <Button onClick={handleCapture} disabled={disabled || !stream} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
            <Zap className="mr-2 h-4 w-4" /> Capture Photo
          </Button>
        )}
        {capturedImage && (
          <Button onClick={retakePhoto} variant="outline" disabled={disabled} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Retake Photo
          </Button>
        )}
      </div>
    </div>
  );
}
// Add Label to imports
import { Label } from '@/components/ui/label';
