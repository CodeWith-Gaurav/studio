
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DiseaseInfo } from '@/components/potato-pal/DiseaseInfo';
import { PreventativeMeasures } from '@/components/potato-pal/PreventativeMeasures';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy } from 'lucide-react';

export const metadata = {
  title: 'Help - Potato Pal / सहायता - पोटैटो पाल',
  description: 'Learn about potato leaf diseases and how to keep your plants healthy. / आलू की पत्ती के रोगों और अपने पौधों को स्वस्थ रखने के तरीके के बारे में जानें।',
};

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-2">
            <LifeBuoy className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Help Center / सहायता केंद्र</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find information about common potato leaf diseases and preventative care.
            <br />
            आलू की पत्ती के आम रोगों और निवारक देखभाल के बारे में जानकारी प्राप्त करें।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="early-blight" className="border border-border rounded-lg shadow-sm bg-card">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-accent">
                Early Blight / अगेती झुलसा
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <DiseaseInfo diseaseName="Early Blight" />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="late-blight" className="border border-border rounded-lg shadow-sm bg-card">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-accent">
                Late Blight / पछेती झुलसा
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <DiseaseInfo diseaseName="Late Blight" />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="preventative-measures" className="border border-border rounded-lg shadow-sm bg-card">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-primary">
                Preventative Measures / निवारक उपाय
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <PreventativeMeasures />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
