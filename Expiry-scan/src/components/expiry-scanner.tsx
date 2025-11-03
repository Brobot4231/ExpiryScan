
'use client';

import { useState, useTransition } from 'react';
import type { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { getExpiryDateAction } from '@/lib/actions';
import type { CalculateExpiryDateOutput } from '@/ai/flows/calculate-expiry-date';
import ScanForm from './scan-form';
import ScanResultCard from './scan-result-card';
import type { scanFormSchema } from './scan-form';
import ExpiryAlertHandler from './expiry-alert-handler';
import { Card, CardContent } from './ui/card';
import { Icons } from './icons';

export default function ExpiryScanner() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<CalculateExpiryDateOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 10MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setScanResult(null); // Reset result when new image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: z.infer<typeof scanFormSchema>) => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please select an image to scan.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await getExpiryDateAction({
          photoDataUri: imagePreview,
          manufactureDate: values.manufactureDate,
          bestBeforeDuration: values.bestBeforeDuration,
        });
        setScanResult(result);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Scan Failed',
          description: (error as Error).message || 'An unknown error occurred.',
        });
        setScanResult(null);
      }
    });
  };

  const handleReset = () => {
    setImagePreview(null);
    setScanResult(null);
  };

  return (
    <div className="w-full space-y-6">
      {!isPending && !scanResult && (
        <ScanForm
          isPending={isPending}
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
        />
      )}

      {isPending && (
        <Card className="w-full animate-pulse">
          <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
            <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing product image...</p>
          </CardContent>
        </Card>
      )}

      {!isPending && scanResult && imagePreview && (
        <>
          <ScanResultCard
            result={scanResult}
            imagePreview={imagePreview}
            onReset={handleReset}
          />
          <ExpiryAlertHandler result={scanResult} />
        </>
      )}
    </div>
  );
}
