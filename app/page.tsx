'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1c0538' }}>
            NXT Abogados
          </h1>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#1c0538' }}></div>
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    </div>
  );
}
