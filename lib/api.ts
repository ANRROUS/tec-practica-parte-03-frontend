// Servicio para llamadas a la API

import { authService } from './auth';
import { LoginResponse, Caso, CreateCasoData, UpdateCasoData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Función auxiliar para hacer peticiones
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = authService.getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error: ${response.status}`);
  }

  return response.json();
}

export const apiService = {
  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register
  async register(email: string, password: string, full_name: string): Promise<LoginResponse> {
    return fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
  },

  // Obtener todos los casos
  async getCasos(): Promise<Caso[]> {
    return fetchAPI('/api/casos');
  },

  // Obtener un caso por ID
  async getCaso(id: string): Promise<Caso> {
    return fetchAPI(`/api/casos/${id}`);
  },

  // Crear caso
  async createCaso(data: CreateCasoData): Promise<Caso> {
    return fetchAPI('/api/casos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar caso
  async updateCaso(id: string, data: UpdateCasoData): Promise<Caso> {
    return fetchAPI(`/api/casos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar caso
  async deleteCaso(id: string): Promise<{ message: string }> {
    return fetchAPI(`/api/casos/${id}`, {
      method: 'DELETE',
    });
  },
};
