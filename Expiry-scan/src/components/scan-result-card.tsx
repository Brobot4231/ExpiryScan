
'use client';

import Image from 'next/image';
import { Calendar, Package, Clock, RotateCcw, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CalculateExpiryDateOutput } from '@/ai/flows/calculate-expiry-date';

type ScanResultCardProps = {
    result: CalculateExpiryDateOutput;
    imagePreview: string;
    onReset: () => void;
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
            <Icon className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="font-semibold text-foreground">{value}</p>
            </div>
        </div>
    );
};


export default function ScanResultCard({ result, imagePreview, onReset }: ScanResultCardProps) {
  const isExpired = result.status.toLowerCase().includes('expired');

  return (
    <Card className={cn('w-full transition-all', isExpired ? 'border-destructive bg-destructive/5' : 'border-emerald-500 bg-emerald-500/5')}>
      <CardContent className="space-y-4">
        <div className="w-full aspect-video rounded-lg overflow-hidden border mt-6">
            <Image
                src={imagePreview}
                alt="Scanned product"
                width={400}
                height={225}
                className="object-contain w-full h-full bg-white"
            />
        </div>
        
        {result.status && (
             <div className={cn(
                "text-center font-semibold p-3 rounded-md flex items-center justify-center gap-2", 
                isExpired 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-emerald-500/10 text-emerald-700'
                )}>
                {isExpired ? <ShieldX /> : <ShieldCheck />}
                {result.status}
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailItem icon={Package} label="Manufacture Date" value={result.manufactureDate} />
            <DetailItem icon={Calendar} label="Expiry Date" value={result.expiryDate} />
            <DetailItem icon={Clock} label="Current Date" value={result.currentDate} />
        </div>

        {result.message && (
            <div className="mt-4 bg-accent text-accent-foreground/80 p-3 text-sm rounded-md border border-primary/10">
                <strong>AI Note:</strong> {result.message}
            </div>
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw />
            Scan Another Product
        </Button>
      </CardFooter>
    </Card>
  );
}

