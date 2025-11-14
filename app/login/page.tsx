'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { authService } from '@/lib/auth';
import { loginSchema, registerSchema } from '@/lib/validations';
import { z } from 'zod';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Estados para login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estados para registro
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  
  // Estados compartidos
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});
    setLoading(true);

    try {
      // Validar con Zod
      const validatedData = loginSchema.parse({
        email: loginEmail,
        password: loginPassword
      });

      const response = await apiService.login(validatedData.email, validatedData.password);
      authService.setAuth(response.token, response.user);
      setSuccess('¡Inicio de sesión exitoso!');
      setTimeout(() => router.push('/home'), 500);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});
    setLoading(true);

    try {
      // Validar con Zod
      const validatedData = registerSchema.parse({
        fullName: registerFullName,
        email: registerEmail,
        password: registerPassword
      });

      const response = await apiService.register(
        validatedData.email, 
        validatedData.password, 
        validatedData.fullName
      );
      authService.setAuth(response.token, response.user);
      setSuccess('¡Registro exitoso! Redirigiendo...');
      setTimeout(() => router.push('/home'), 500);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
      } else {
        setError(err.message || 'Error al registrarse');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-2" style={{ borderColor: '#1c0538' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1c0538' }}>
            NXT Abogados
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b-2" style={{ borderColor: '#1c053820' }}>
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccess('');
              setValidationErrors({});
            }}
            className={`flex-1 py-3 text-center font-semibold transition-all ${
              activeTab === 'login'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'login' ? { color: '#1c0538', borderColor: '#1c0538' } : {}}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccess('');
              setValidationErrors({});
            }}
            className={`flex-1 py-3 text-center font-semibold transition-all ${
              activeTab === 'register'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'register' ? { color: '#1c0538', borderColor: '#1c0538' } : {}}
          >
            Registrarse
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">Éxito</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                style={{ color: '#0f0228' }}
                onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="usuario@nxtabogados.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                style={{ color: '#0f0228' }}
                onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="••••••••"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1c0538' }}
            >
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="register-fullname" className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                Nombre Completo
              </label>
              <input
                id="register-fullname"
                type="text"
                value={registerFullName}
                onChange={(e) => setRegisterFullName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                style={{ color: '#0f0228' }}
                onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="Juan Pérez García"
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                style={{ color: '#0f0228' }}
                onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="tu@email.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                Contraseña
              </label>
              <input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                style={{ color: '#0f0228' }}
                onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="••••••••"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p>• Mínimo 8 caracteres</p>
                <p>• Una letra mayúscula y una minúscula</p>
                <p>• Un número y un carácter especial</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1c0538' }}
            >
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
