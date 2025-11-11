// Servicio de ventas
import { apiService } from './api.service';
import type { 
  Venta, 
  CreateVentaDto 
} from '@/types/venta.types';

export class VentaService {
  private readonly endpoints = {
    ventas: '/ventas',
    detalleVentas: '/detalle-ventas'
  };

  // CRUD Ventas
  async getAll(): Promise<Venta[]> {
    return apiService.get<Venta[]>(this.endpoints.ventas);
  }

  async getById(id: number): Promise<Venta> {
    return apiService.get<Venta>(`${this.endpoints.ventas}/${id}`);
  }

  async create(venta: CreateVentaDto): Promise<Venta> {
    return apiService.post<Venta>(this.endpoints.ventas, venta);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.endpoints.ventas}/${id}`);
  }

  // Métodos de utilidad
  async getVentasByDateRange(fechaInicio: string, fechaFin: string): Promise<Venta[]> {
    const ventas = await this.getAll();
    return ventas.filter(v => {
      const fechaVenta = new Date(v.fechaHora);
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });
  }

  async getVentasDelMes(): Promise<Venta[]> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return this.getVentasByDateRange(
      firstDay.toISOString().split('T')[0],
      lastDay.toISOString().split('T')[0]
    );
  }

  async getTotalVentasPorPeriodo(fechaInicio: string, fechaFin: string): Promise<number> {
    const ventas = await this.getVentasByDateRange(fechaInicio, fechaFin);
    return ventas.reduce((total, venta) => total + venta.total, 0);
  }

  // Calcular subtotal de detalle
  calcularSubtotal(cantidad: number, precioUnitario: number): number {
    return cantidad * precioUnitario;
  }

  // Calcular total de venta
  calcularTotalVenta(detalles: Array<{cantidad: number, precioUnitario: number}>): number {
    return detalles.reduce((total, detalle) => 
      total + this.calcularSubtotal(detalle.cantidad, detalle.precioUnitario), 0
    );
  }
}

// Instancia singleton
export const ventaService = new VentaService();