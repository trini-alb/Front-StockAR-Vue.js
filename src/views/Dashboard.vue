<template>
  <div class="dashboard-container">
    <section class="u-clearfix u-section-1" id="sec-dashboard">
      <div class="u-clearfix u-sheet u-sheet-1">
        <h1 class="u-text u-text-default u-text-1">Dashboard</h1>

        <!-- Contenedor de estadísticas -->
        <div v-if="!loading" class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-content">
              <h3>{{ stats.totalProductos }}</h3>
              <p>Total Productos</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⚠️</div>
            <div class="stat-content">
              <h3>{{ stats.stockBajo }}</h3>
              <p>Stock Bajo</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>{{ stats.ventasHoy }}</h3>
              <p>Ventas Hoy</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💵</div>
            <div class="stat-content">
              <h3>{{ formatCurrency(cotizacionUsd) }}</h3>
              <p>USD Oficial</p>
            </div>
          </div>
        </div>
        <div v-else class="loading-container">
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService, productoService, ventaService, cotizacionService } from '@/services';
import type { Usuario, Producto, Venta } from '@/services';
import { formatCurrency } from '@/components/formatters';

const router = useRouter();
// Estado reactivo
const loading = ref(false);
const productos = ref<Producto[]>([]); // Cambiado a productos
const ventas = ref<Venta[]>([]); // Cambiado a ventas
const cotizacionUsd = ref(0);

const stats = computed(() => ({
  totalProductos: productos.value.length,
  stockBajo: productos.value.filter(p => p.stock <= 5).length,
  ventasHoy: ventas.value.filter(v => 
    new Date(v.fechaHora).toDateString() === new Date().toDateString()
  ).length
}));

// Métodos
const loadData = async () => {
  loading.value = true;
  try {
    // Cargar datos en paralelo
    const [productosData, ventasData, cotizacion] = await Promise.all([
      productoService.getAll(),
      ventaService.getAll(),
      cotizacionService.getUsdOficial()
    ]);
    
    productos.value = productosData;
    ventas.value = ventasData;
    cotizacionUsd.value = cotizacion;
    
  } catch (error) {
    console.error('Error cargando datos del dashboard:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>
 
<style scoped>
/* Importar CSS originales */

.u-text-1 {
  margin: 20px auto 0;
  font-size: 2.25rem;
  color: #1f2937;
  text-align: center;
}

.stats-section {
  background: #f5f7fa;
  padding: 40px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5rem;
  background: #f0f9ff;
  padding: 15px;
  border-radius: 12px;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: bold;
  color: #1e40af;
  margin: 0;
}

.stat-content p {
  color: #6b7280;
  margin: 5px 0 0 0;
}

.loading-container {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>