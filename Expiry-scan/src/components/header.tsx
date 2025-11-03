import { ScanSearch } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-start px-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2 text-primary">
            <ScanSearch className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground">
            ExpiryScan
          </h1>
        </div>
      </div>
    </header>
  );
}
