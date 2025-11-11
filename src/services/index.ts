// Barrel exports - Facilita las importaciones
export { apiService } from './api.service';
export { authService } from './auth.service';
export { productoService } from './producto.service';
export { ventaService } from './venta.service';
export { cotizacionService } from './cotizacion.service';

// Re-export de tipos para conveniencia
export type { 
  LoginCredentials, 
  AuthResponse, 
  Usuario 
} from '@/types/auth.types';

export type { 
  Producto, 
  TipoProducto, 
  CreateProductoDto, 
  UpdateProductoDto 
} from '@/types/producto.types';

export type { 
  Venta, 
  DetalleVenta, 
  CreateVentaDto 
} from '@/types/venta.types';