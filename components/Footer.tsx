'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function Footer() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setCurrentYear(new Date().getFullYear());
    setIsReady(true);
  }, []);

  // No mostrar footer en la página de login
  if (pathname === '/login') {
    return null;
  }

  if (!isReady || !isAuthenticated || currentYear === null) {
    return null;
  }

  return (
    <footer className="bg-gray-50 border-t mt-auto" style={{ borderColor: '#e5e7eb' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">
          © {currentYear} NXT Abogados - Parte 03 - Andrés Pineda
        </p>
      </div>
    </footer>
  );
}
