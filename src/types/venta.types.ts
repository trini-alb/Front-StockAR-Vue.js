// Tipos para el módulo de ventas - Alineados con backend NestJS
import type { Producto } from './producto.types';

export interface Empleado {
  idEmpleado: number;
  nombre: string;
  apellido: string;
  rol: {
    idRol: number;
    nombre: string;
  };
}

export interface DetalleVenta {
  idDetalle: number;
  cantidad: number;
  subtotal: number;
  producto: Producto;
}

export interface Venta {
  idVenta: number;
  fechaHora: Date;
  total: number;
  empleado: Empleado;
  detalles: DetalleVenta[];
}

export interface CreateVentaDto {
  empleadoId: number;
  observaciones?: string;
  total: number;
  items: Array<{
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
}

export interface UpdateVentaDto extends Partial<CreateVentaDto> {}

// Para filtros
export interface VentaFilter {
  fechaDesde?: string;
  fechaHasta?: string;
  empleado?: number;
}