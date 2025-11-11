// Servicio de autenticación - Similar a tu AuthService de Angular
import { apiService } from './api.service';
import type { LoginCredentials, AuthResponse, Usuario } from '@/types/auth.types';

// Interfaz para el registro de usuario
interface RegisterData {
  email: string;
  contraseña: string;
  empleado: {
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
    fechaNacimiento: string;
  };
}

export class AuthService {
  private readonly STORAGE_KEYS = {
    TOKEN: 'stockar_token',
    USER: 'stockar_user'
  };

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/usuario/login', credentials);
      
      // Guardar en localStorage
      localStorage.setItem(this.STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(response.usuario));
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<Usuario> {
    try {
      const response = await apiService.post<Usuario>('/usuario/register', userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/usuario/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar localStorage siempre
      this.clearStorage();
    }
  }

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem(this.STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined;
  }

  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.USER);
  }

  // Método para verificar permisos (útil para guards)
  hasPermission(_permissionName: string): boolean {
    // Por ahora siempre retorna true ya que el backend no tiene sistema de permisos implementado
    return true;
  }

  // Verificar si tiene rol específico
  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user?.empleado?.rol?.nombre === roleName;
  }
}

// Instancia singleton
export const authService = new AuthService();