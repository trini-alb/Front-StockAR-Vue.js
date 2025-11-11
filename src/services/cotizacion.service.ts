// Servicio de cotización USD
import { apiService } from './api.service';

export class CotizacionService {
  private readonly endpoint = '/cotizacion';

  async getUsdOficial(): Promise<number> {
    try {
      const cotizacion = await apiService.get<number>(this.endpoint);
      return cotizacion;
    } catch (error) {
      console.error('Error obteniendo cotización:', error);
      // Valor por defecto en caso de error
      return 1000;
    }
  }

  // Convertir USD a ARS
  convertirUsdToArs(montoUsd: number, cotizacion: number): number {
    return Number((montoUsd * cotizacion).toFixed(2));
  }

  // Convertir ARS a USD
  convertirArsToUsd(montoArs: number, cotizacion: number): number {
    return Number((montoArs / cotizacion).toFixed(2));
  }

  // Formatear moneda
  formatearPesos(monto: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  }

  formatearDolares(monto: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  }
}

// Instancia singleton
export const cotizacionService = new CotizacionService();