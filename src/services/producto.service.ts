// Servicio de productos - Similar a tu estructura anterior
import { apiService } from './api.service';
import type { 
  Producto, 
  TipoProducto, 
  CreateProductoDto, 
  UpdateProductoDto 
} from '@/types/producto.types';

export class ProductoService {
  private readonly endpoints = {
    productos: '/producto',
    tiposProducto: '/tipo-producto'
  };

  // CRUD Productos
  async getAll(): Promise<Producto[]> {
    return apiService.get<Producto[]>(this.endpoints.productos);
  }

  async getById(id: number): Promise<Producto> {
    return apiService.get<Producto>(`${this.endpoints.productos}/${id}`);
  }

  async create(producto: CreateProductoDto): Promise<Producto> {
    return apiService.post<Producto>(this.endpoints.productos, producto);
  }

  async update(id: number, producto: UpdateProductoDto): Promise<Producto> {
    return apiService.put<Producto>(`${this.endpoints.productos}/${id}`, producto);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.endpoints.productos}/${id}`);
  }

  // Tipos de producto
  async getTiposProducto(): Promise<TipoProducto[]> {
    return apiService.get<TipoProducto[]>(this.endpoints.tiposProducto);
  }

  async createTipoProducto(tipo: Omit<TipoProducto, 'idTipoProducto'>): Promise<TipoProducto> {
    return apiService.post<TipoProducto>(this.endpoints.tiposProducto, tipo);
  }

  // Métodos de utilidad
  async searchByName(nombre: string): Promise<Producto[]> {
    const productos = await this.getAll();
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  async getByTipo(idTipoProducto: number): Promise<Producto[]> {
    const productos = await this.getAll();
    return productos.filter(p => p.tipoProducto.idTipoProducto === idTipoProducto);
  }

  async getStockBajo(): Promise<Producto[]> {
    const productos = await this.getAll();
    return productos.filter(p => p.stock <= 5); // Usar stock mínimo default
  }
}

// Instancia singleton
export const productoService = new ProductoService();