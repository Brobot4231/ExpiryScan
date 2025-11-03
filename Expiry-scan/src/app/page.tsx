import ExpiryScanner from '@/components/expiry-scanner';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto flex w-full max-w-3xl flex-col items-center p-4 md:p-8">
        <ExpiryScanner />
      </main>
    </div>
  );
}
