
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from '@/components/potato-pal/ImageUploader';
import { CameraCapture } from '@/components/potato-pal/CameraCapture';
import { AnalysisResult } from '@/components/potato-pal/AnalysisResult';
import type { DetectionResultType, SimulatedDetectionResult } from '@/lib/types';
import { Zap, RotateCcw, AlertTriangle, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const possibleDetections: DetectionResultType[] = ["Early Blight", "Late Blight", "Healthy"];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<SimulatedDetectionResult>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (file: File, dataUrl: string) => {
    setSelectedImageFile(file);
    setImageDataUrl(dataUrl);
    setDetectionResult(null); // Reset previous result
  };

  const handleImageCapture = (dataUrl: string) => {
    setImageDataUrl(dataUrl);
    setSelectedImageFile(null); // Clear file if image came from camera
    setDetectionResult(null); // Reset previous result
  };
  
  const simulateAnalysis = () => {
    if (!imageDataUrl) {
      toast({
        title: "No Image Selected",
        description: "Please upload or capture an image first.",
        variant: "destructive",
      });
      return;
    }
    setIsAnalyzing(true);
    setDetectionResult(null);

    // Simulate network delay and analysis
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * possibleDetections.length);
      const result = possibleDetections[randomIndex];
      setDetectionResult(result);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `Detected: ${result}`,
      });
    }, 1500); // Simulate 1.5 seconds of analysis
  };

  const resetState = () => {
    setActiveTab('upload');
    setSelectedImageFile(null);
    setImageDataUrl(null);
    setDetectionResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-2">
             <Leaf className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Potato Leaf Disease Detection</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Upload or capture an image of a potato leaf to check its health status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!detectionResult && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'camera')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="camera">Use Camera</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-6">
                <ImageUploader onImageSelect={handleImageSelect} disabled={isAnalyzing} />
              </TabsContent>
              <TabsContent value="camera" className="mt-6">
                <CameraCapture onImageCapture={handleImageCapture} disabled={isAnalyzing} />
              </TabsContent>
            </Tabs>
          )}

          {imageDataUrl && !detectionResult && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">Selected Image:</p>
              <div className="w-full max-w-md aspect-video relative rounded-lg overflow-hidden border-2 border-primary shadow-md">
                <Image src={imageDataUrl} alt="Selected leaf" layout="fill" objectFit="contain" />
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            {!detectionResult ? (
              <Button 
                onClick={simulateAnalysis} 
                disabled={!imageDataUrl || isAnalyzing} 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Zap className="mr-2 h-5 w-5" /> 
                {isAnalyzing ? 'Analyzing...' : 'Analyze Leaf'}
              </Button>
            ) : (
              <Button onClick={resetState} size="lg" variant="outline" className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-5 w-5" /> 
                Analyze Another Leaf
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="w-full max-w-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg font-semibold text-primary">Analyzing your potato leaf...</p>
          <p className="text-muted-foreground">This may take a few moments.</p>
        </Card>
      )}

      {detectionResult && imageDataUrl && (
        <div className="w-full max-w-2xl mt-8">
          <AnalysisResult imageUrl={imageDataUrl} detection={detectionResult} />
        </div>
      )}
    </div>
  );
}
