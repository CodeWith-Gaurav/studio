
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { generateDiseaseSummary, GenerateDiseaseSummaryOutput } from '@/ai/flows/generate-disease-summary';
import { suggestPreventativeMeasures, SuggestPreventativeMeasuresOutput } from '@/ai/flows/suggest-preventative-measures';
import type { DetectionResultType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, Zap, Leaf, Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';

interface AnalysisResultProps {
  imageUrl: string;
  detection: DetectionResultType;
}

export function AnalysisResult({ imageUrl, detection }: AnalysisResultProps) {
  const [aiData, setAiData] = useState<GenerateDiseaseSummaryOutput | SuggestPreventativeMeasuresOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detection) return;

    setIsLoading(true);
    setError(null);
    setAiData(null);

    const fetchData = async () => {
      try {
        if (detection === 'Healthy') {
          const result = await suggestPreventativeMeasures({ plantType: 'potato' });
          setAiData(result);
        } else { // Early Blight or Late Blight
          const result = await generateDiseaseSummary({ diseaseName: detection });
          setAiData(result);
        }
      } catch (err) {
        console.error("Error fetching AI data:", err);
        setError('Failed to get detailed information from AI. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [detection]);

  const renderStatus = () => {
    switch (detection) {
      case 'Healthy':
        return {
          text: 'Healthy',
          icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
          badgeVariant: 'default',
          badgeClass: 'bg-green-500 hover:bg-green-600',
          titleColor: 'text-green-700 dark:text-green-400'
        };
      case 'Early Blight':
        return {
          text: 'Early Blight Detected',
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          badgeVariant: 'destructive',
          badgeClass: 'bg-red-500 hover:bg-red-600',
          titleColor: 'text-red-700 dark:text-red-400'
        };
      case 'Late Blight':
        return {
          text: 'Late Blight Detected',
          icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
          badgeVariant: 'destructive',
          badgeClass: 'bg-orange-500 hover:bg-orange-600',
          titleColor: 'text-orange-700 dark:text-orange-400'
        };
      default:
        return { text: 'Unknown', icon: <Leaf className="h-6 w-6 text-muted-foreground" />, badgeVariant: 'secondary', titleColor: 'text-muted-foreground' };
    }
  };

  const status = renderStatus();

  return (
    <Card className="w-full shadow-xl rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/30 p-6">
        <div className="flex items-center space-x-3 mb-3">
          {status.icon}
          <CardTitle className={`text-2xl font-bold ${status.titleColor}`}>{status.text}</CardTitle>
        </div>
        <div className="aspect-video relative rounded-md overflow-hidden border-2 border-border shadow-inner">
          <Image src={imageUrl} alt="Analyzed potato leaf" layout="fill" objectFit="contain" className="bg-white" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && aiData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Brain className="h-5 w-5" />
              <h3 className="text-xl font-semibold">AI Insights:</h3>
            </div>
            {('summary' in aiData && aiData.summary) && (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background p-4 rounded-md border border-border shadow-sm">
                <p className="font-medium text-foreground">Disease Summary:</p>
                <p className="text-muted-foreground whitespace-pre-line">{aiData.summary}</p>
              </div>
            )}
            {('suggestions' in aiData && aiData.suggestions) && (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background p-4 rounded-md border border-border shadow-sm">
                 <p className="font-medium text-foreground">Preventative Measures:</p>
                <p className="text-muted-foreground whitespace-pre-line">{aiData.suggestions}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
