
'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Camera, Upload, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

export const scanFormSchema = z.object({
  manufactureDate: z.string().optional(),
  bestBeforeDuration: z.string().optional(),
});

type ScanFormProps = {
  isPending: boolean;
  imagePreview: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (values: z.infer<typeof scanFormSchema>) => void;
};

export default function ScanForm({ isPending, imagePreview, onFileChange, onSubmit }: ScanFormProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof scanFormSchema>>({
    resolver: zodResolver(scanFormSchema),
    defaultValues: {
      manufactureDate: '',
      bestBeforeDuration: '',
    },
  });

  return (
    <Card className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Scan a Product</CardTitle>
            <CardDescription>
              Capture or upload an image of the product label. For better accuracy, provide the manufacturing date if available.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={cn(
                'w-full aspect-video rounded-lg border-2 border-dashed flex flex-col justify-center items-center transition-colors',
                imagePreview ? 'border-primary' : 'border-border'
              )}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  width={400}
                  height={225}
                  className="object-contain w-full h-full rounded-md"
                />
              ) : (
                <div className="text-center p-4 text-muted-foreground flex flex-col items-center justify-center gap-4 w-full">
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                        <Button type="button" variant="outline" className="w-full" onClick={() => cameraInputRef.current?.click()}>
                            <Camera /> Use Camera
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={() => uploadInputRef.current?.click()}>
                            <Upload /> Upload Image
                        </Button>
                    </div>
                  <p className="text-xs mt-2">Max file size: 10MB</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={onFileChange}
              className="hidden"
              aria-label="Use camera"
            />
             <input
              type="file"
              accept="image/*"
              ref={uploadInputRef}
              onChange={onFileChange}
              className="hidden"
              aria-label="Upload product image"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufactureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturing Date (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2023-01-15 or Jan 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bestBeforeDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best Before (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 18 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending || !imagePreview}>
              {isPending ? (
                <Icons.spinner className="animate-spin" />
              ) : (
                <ScanLine />
              )}
              Scan Product
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
