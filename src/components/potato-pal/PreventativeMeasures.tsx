"use client";

import { useEffect, useState } from 'react';
import { suggestPreventativeMeasures, SuggestPreventativeMeasuresOutput } from '@/ai/flows/suggest-preventative-measures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, AlertTriangle, LifeBuoy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PreventativeMeasures() {
  const [data, setData] = useState<SuggestPreventativeMeasuresOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await suggestPreventativeMeasures({ plantType: 'potato' });
        setData(result);
      } catch (err) {
        console.error("Error fetching preventative measures:", err);
        setError("Could not load preventative measures. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
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
        <LifeBuoy className="h-5 w-5 text-primary" />
        <h3>General Potato Health Tips / आलू के स्वास्थ्य के लिए सामान्य सुझाव</h3>
      </div>

      {data.suggestions && (
        <div>
          <h4 className="text-md font-semibold mt-2 text-foreground/90">English Suggestions:</h4>
          <p className="text-muted-foreground whitespace-pre-line">{data.suggestions}</p>
        </div>
      )}
      
      {data.suggestionsHindi && (
        <div className="mt-3">
          <h4 className="text-md font-semibold text-foreground/90">हिन्दी सुझाव (Hindi Suggestions):</h4>
          <p className="text-muted-foreground whitespace-pre-line">{data.suggestionsHindi}</p>
        </div>
      )}
    </article>
  );
}
