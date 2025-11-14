// Tipos para el sistema de autenticación y casos

export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Caso {
  id: string;
  title: string;
  description: string;
  status: 'A' | 'P' | 'C' | 'S';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCasoData {
  title: string;
  description: string;
  status?: 'A' | 'P' | 'C' | 'S';
}

export interface UpdateCasoData {
  title?: string;
  description?: string;
  status?: 'A' | 'P' | 'C' | 'S';
}
