// Servicio base HTTP - Similar a tu ApiService de Angular
import type { ErrorResponse } from '@/types/api.types';

export class ApiService {
  private readonly baseURL = 'http://localhost:3000';
  
  constructor() {}

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('stockar_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
        statusCode: response.status
      }));
      
      // Si es error 401, limpiar token y redirigir
      if (response.status === 401) {
        localStorage.removeItem('stockar_token');
        localStorage.removeItem('stockar_user');
        window.location.href = '/login';
      }
      
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as any;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<T>(response);
  }
}

// Instancia singleton
export const apiService = new ApiService();