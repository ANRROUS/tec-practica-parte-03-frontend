'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    setIsAuthenticated(authService.isAuthenticated());
  }, [pathname, isReady]);

  // No mostrar header en la página de login
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm border-b" style={{ borderColor: '#e5e7eb' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold cursor-pointer" style={{ color: '#1c0538' }} onClick={() => router.push('/home')}>
              NXT Abogados
            </h1>
          </div>

          {/* Navegación Central */}
          <nav className="flex items-center gap-8">
            <button
              onClick={() => router.push('/home')}
              className="pb-2 text-base font-medium transition-all relative hover:cursor-pointer"
              style={
                pathname === '/home'
                  ? { color: '#1c0538', borderBottom: '2px solid #1c0538' }
                  : { color: '#6b7280' }
              }
            >
              Home
            </button>
            <button
              onClick={() => router.push('/expedientes')}
              className="pb-2 text-base font-medium transition-all relative hover:cursor-pointer"
              style={
                pathname === '/expedientes'
                  ? { color: '#1c0538', borderBottom: '2px solid #1c0538' }
                  : { color: '#6b7280' }
              }
            >
              Expedientes
            </button>
          </nav>

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition hover:cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
