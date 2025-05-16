
"use client";

import { useEffect, useState } from 'react';
import { generateDiseaseSummary, GenerateDiseaseSummaryOutput } from '@/ai/flows/generate-disease-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DiseaseInfoProps {
  diseaseName: "Early Blight" | "Late Blight";
}

export function DiseaseInfo({ diseaseName }: DiseaseInfoProps) {
  const [data, setData] = useState<GenerateDiseaseSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateDiseaseSummary({ diseaseName });
        setData(result);
      } catch (err) {
        console.error(`Error fetching summary for ${diseaseName}:`, err);
        setError(`Could not load information for ${diseaseName}. Please try again later.`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [diseaseName]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <article className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Info className="h-5 w-5 text-accent" />
        <h3>About {diseaseName} / {diseaseName === "Early Blight" ? "अगेती झुलसा" : "पछेती झुलसा"} के बारे में</h3>
      </div>
      
      {data.summary && (
        <div>
          <h4 className="text-md font-semibold mt-2 text-foreground/90">English Summary:</h4>
          <p className="text-muted-foreground whitespace-pre-line">{data.summary}</p>
        </div>
      )}
      
      {data.summaryHindi && (
        <div className="mt-3">
          <h4 className="text-md font-semibold text-foreground/90">हिन्दी सारांश (Hindi Summary):</h4>
          <p className="text-muted-foreground whitespace-pre-line">{data.summaryHindi}</p>
        </div>
      )}
    </article>
  );
}
