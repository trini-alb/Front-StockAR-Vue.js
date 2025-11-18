// Tipos para el módulo de productos - Alineados con backend NestJS

export interface TipoProducto {
  idTipoProducto: number;
  nombre: string;
  descripcion: string;
}

export interface Moneda {
  idMoneda: number;
  nombre: string;
  cotizacion: number;
  tipoMoneda: {
    idTipoMoneda: number;
    nombre: string;
  };
}

export interface Producto {
  idProducto: number;
  codigo: number;
  nombre: string;
  descripcion: string;
  marca: string;
  precioNeto: number;
  precioVenta: number;
  iva: number;
  ganancia: number;
  stock: number;
  tipoProducto: TipoProducto;
  moneda: Moneda;
}

export interface CreateProductoDto {
  codigo: number;
  nombre: string;
  descripcion: string;
  marca: string;
  precioNeto: number;
  precioVenta?: number;
  iva: number;
  ganancia: number;
  stock: number;
  idTipoProducto: number;
  idMoneda: number;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {}

// Para filtros y búsquedas
export interface ProductoFilter {
  search?: string;
  tipoProducto?: number;
  moneda?: number;
  stockMinimo?: number;
}