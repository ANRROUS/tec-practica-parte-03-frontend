'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function HomePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }
        setUser(authService.getUser());
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#1c0538' }}></div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6" style={{ color: '#1c0538' }}>
                        Bienvenido, {user.full_name}
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Gestiona tus expedientes legales de manera eficiente y profesional
                    </p>
                </div>
            </section>

            {/* Por qué elegirnos */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12" style={{ color: '#1c0538' }}>
                        ¿Por qué elegirnos?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Característica 1 */}
                        <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c053810' }}>
                                <svg className="w-8 h-8" style={{ color: '#1c0538' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold mb-3" style={{ color: '#1c0538' }}>
                                Seguridad Total
                            </h4>
                            <p className="text-gray-600">
                                Tus datos están protegidos con los más altos estándares de seguridad y encriptación
                            </p>
                        </div>

                        {/* Característica 2 */}
                        <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c053810' }}>
                                <svg className="w-8 h-8" style={{ color: '#1c0538' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold mb-3" style={{ color: '#1c0538' }}>
                                Rápido y Eficiente
                            </h4>
                            <p className="text-gray-600">
                                Accede a tus expedientes en segundos y gestiona tus casos con facilidad
                            </p>
                        </div>

                        {/* Característica 3 */}
                        <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c053810' }}>
                                <svg className="w-8 h-8" style={{ color: '#1c0538' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold mb-3" style={{ color: '#1c0538' }}>
                                Organización Total
                            </h4>
                            <p className="text-gray-600">
                                Mantén todos tus casos organizados y accesibles desde cualquier lugar
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl font-bold mb-6" style={{ color: '#1c0538' }}>
                        Comienza a gestionar tus expedientes
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                        Todo lo que necesitas para administrar tus casos legales en un solo lugar
                    </p>
                    <button
                        onClick={() => router.push('/expedientes')}
                        className="px-8 py-4 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition text-lg"
                        style={{ backgroundColor: '#1c0538' }}
                    >
                        Ir a Expedientes
                    </button>
                </div>
            </section>
        </div>
    );
}
