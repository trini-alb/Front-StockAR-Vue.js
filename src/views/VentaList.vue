<template>
  <div class="venta-list-container">
    
    <section class="u-clearfix u-section-1" id="block-2">
      <div class="u-clearfix u-sheet u-sheet-1">
        
        <div v-if="message" class="message" :class="messageType">
          {{ message }}
        </div>

        <div class="u-form u-form-1">
          <div class="filters-container">
            <div class="filter-row">
              <div class="filter-group">
                <label class="u-label">Filtrar por fecha:</label>
                <input 
                  v-model="filters.fechaDesde"
                  type="date" 
                  class="u-input u-input-rectangle filter-input"
                  placeholder="Fecha desde"
                />
                <input 
                  v-model="filters.fechaHasta"
                  type="date" 
                  class="u-input u-input-rectangle filter-input"
                  placeholder="Fecha hasta"
                />
              </div>
              
              <div class="filter-group">
                <label class="u-label">Empleado:</label>
                <select 
                  v-model="filters.empleado" 
                  class="u-input u-input-rectangle filter-select"
                >
                  <option value="">Todos los empleados</option>
                  <option 
                    v-for="empleado in empleados" 
                    :key="empleado.idEmpleado" 
                    :value="empleado.idEmpleado"
                  >
                    {{ empleado.nombre }} {{ empleado.apellido }}
                  </option>
                </select>
              </div>
              
              <div class="filter-actions">
                <button 
                  @click="applyFilters"
                  class="u-btn u-btn-submit filter-btn"
                  :disabled="loading"
                >
                  🔍 Filtrar
                </button>
                <button 
                  @click="clearFilters"
                  class="u-btn u-btn-secondary filter-btn"
                >
                  🗑️ Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-number">{{ totalVentas }}</div>
            <div class="stat-label">Total Ventas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${{ totalMonto.toFixed(2) }}</div>
            <div class="stat-label">Monto Total</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ ventasHoy }}</div>
            <div class="stat-label">Ventas Hoy</div>
          </div>
        </div>

        <div v-if="loading" class="table-container">
          <table class="u-table u-table-1">
            <thead class="u-table-header">
              <!-- Puedes dejar el header visible si lo prefieres -->
              </thead>
            <tbody class="u-table-body">
              <tr v-for="n in 5" :key="n" class="skeleton-row">
                <td v-for="i in 6" :key="i" class="u-table-cell">
                  <div class="skeleton-line"></div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="paginatedVentas.length > 0" class="table-container">
          <table class="u-table u-table-1">
            <thead class="u-table-header">
              <tr style="height: 52px;">
                <th class="u-table-cell">ID</th>
                <th class="u-table-cell">Fecha</th>
                <th class="u-table-cell">Empleado</th>
                <th class="u-table-cell">Items</th>
                <th class="u-table-cell">Total</th>
                <th class="u-table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody class="u-table-body">
              <tr 
                v-for="venta in paginatedVentas" 
                :key="venta.idVenta"
                style="height: 96px;"
              >
                <td class="u-table-cell">
                  <span class="venta-id">#{{ venta.idVenta }}</span>
                </td>
                <td class="u-table-cell">
                  <div class="date-info">
                    <span class="date">{{ formatDate(venta.fechaHora) }}</span>
                    <span class="time">{{ formatTime(venta.fechaHora) }}</span>
                  </div>
                </td>
                <td class="u-table-cell">
                  <div class="employee-info">
                    <span class="name">{{ venta.empleado.nombre }} {{ venta.empleado.apellido }}</span>
                    <span class="role">{{ venta.empleado.rol.nombre }}</span>
                  </div>
                </td>
                <td class="u-table-cell">
                  <div class="items-summary">
                    <span class="item-count">{{ venta.detalles.length }} productos</span>
                    <span class="total-quantity">{{ getTotalQuantity(venta.detalles) }} unidades</span>
                  </div>
                </td>
                <td class="u-table-cell">
                  <span class="total-amount">${{ venta.total.toFixed(2) }}</span>
                </td>
                <td class="u-table-cell acciones">
                  <div class="action-buttons">
                    <button 
                      @click="viewVenta(venta)"
                      class="btn-accion btn-ver"
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button 
                      @click="downloadVenta(venta)"
                      class="btn-accion btn-download"
                      title="Descargar recibo"
                    >
                      📄
                    </button>
                    <button 
                      @click="deleteVenta(venta)"
                      class="btn-accion btn-eliminar"
                      title="Anular venta"
                      v-if="canDelete(venta)"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="!loading && ventas.length === 0" class="no-data">
          <div class="no-data-content">
            <h3>Aún no hay ventas registradas</h3>
            <p>Comienza por registrar tu primera venta.</p>
            <router-link to="/ventas/nueva" class="u-btn u-btn-primary">➕ Registrar Venta</router-link>
          </div>
        </div>

        <div v-else-if="!loading && ventas.length === 0" class="no-data">
          <div class="no-data-content">
            <h3>Aún no hay ventas registradas</h3>
            <p>Comienza por registrar tu primera venta.</p>
            <router-link to="/ventas/nueva" class="u-btn u-btn-primary">➕ Registrar Venta</router-link>
          </div>
        </div>

        <div v-else class="no-data">
          <div class="no-data-content">
            <h3>No se encontraron ventas 😕</h3>
            <p>No hay ventas que coincidan con los filtros seleccionados.</p>
            <router-link to="/ventas/nueva" class="u-btn u-btn-primary">
              ➕ Registrar Primera Venta
            </router-link>
          </div>
        </div>

        <div v-if="filteredVentas.length > itemsPerPage" class="pagination">
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            ⏮️ Primera
          </button>
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            ⏪ Anterior
          </button>
          <span class="pagination-info">
            Página **{{ currentPage }}** de **{{ totalPages }}** ({{ filteredVentas.length }} ventas total)
          </span>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Siguiente ⏩
          </button>
          <button 
            @click="currentPage = totalPages" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Última ⏭️
          </button>
        </div>

        <div class="action-section">
          <router-link 
            to="/ventas/nueva" 
            class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-3"
          >
            ➕ Registrar Venta
          </router-link>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService, ventaService, empleadoService } from '@/services';
import type { Usuario, Venta, DetalleVenta, Empleado } from '@/services';
import { usePagination } from './usePagination';

const router = useRouter();

// Interfaces (No modificadas)
interface VentaFilter {
  fechaDesde: string;
  fechaHasta: string;
  empleado: string;
}

// Estado reactivo
const currentUser = ref<Usuario | null>(null);
const loading = ref(false);
const ventas = ref<Venta[]>([]);
const empleados = ref<Empleado[]>([]);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

// Filtros
const filters = ref<VentaFilter>({
  fechaDesde: '',
  fechaHasta: '',
  empleado: ''
});


// Computed properties
const filteredVentas = computed(() => {
  let result = ventas.value;

  // Filtro por fecha
  if (filters.value.fechaDesde && filters.value.fechaDesde.trim() !== '') {
    result = result.filter(venta => {
      // Comparamos como strings para evitar problemas de zona horaria.
      return venta.fechaHora.toString().split('T')[0] >= filters.value.fechaDesde;
    });
  }
  
  if (filters.value.fechaHasta && filters.value.fechaHasta.trim() !== '') {
    result = result.filter(venta => {
      return venta.fechaHora.toString().split('T')[0] <= filters.value.fechaHasta;
    });
  }

  // Filtro por empleado
  if (filters.value.empleado && filters.value.empleado.trim() !== '') {
    const idEmpleadoFiltro = parseInt(filters.value.empleado);
    result = result.filter(venta => 
      venta.empleado.idEmpleado === idEmpleadoFiltro
    );
  }

  // Ordenar por fecha más reciente
  return result.sort((a, b) => 
    new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
  );
});

// Paginación (debe definirse DESPUÉS de filteredVentas)
const itemsPerPage = ref(10);
const { currentPage, totalPages, paginatedItems: paginatedVentas } = usePagination(filteredVentas, itemsPerPage);

const totalVentas = computed(() => filteredVentas.value.length);

const totalMonto = computed(() => {
  return filteredVentas.value.reduce((sum, venta) => sum + venta.total, 0);
});

const ventasHoy = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return filteredVentas.value.filter(venta => 
    venta.fechaHora.toString().startsWith(today)
  ).length;
});

// Métodos
const loadVentas = async () => {
  loading.value = true;
  try {
    // Nota: El uso de Promise.all está bien para cargar en paralelo
    const [ventasData, empleadosData] = await Promise.all([ventaService.getAll(), empleadoService.getAll()]);
    ventas.value = ventasData;
    empleados.value = empleadosData;
  } catch (error) {
    console.error('Error cargando ventas:', error);
    showMessage('Error al cargar las ventas', 'error');
  } finally {
    loading.value = false;
  }
};

// Se agregó para manejar el @click del botón de filtrar
const applyFilters = () => {
  // CORRECCIÓN: Al aplicar un filtro, siempre volvemos a la primera página para evitar páginas vacías.
  currentPage.value = 1;
  showMessage('Filtros aplicados', 'success');
};

const clearFilters = () => {
  // CORRECCIÓN: Reiniciar el objeto de filtros a sus valores iniciales
  filters.value = {
    fechaDesde: '',
    fechaHasta: '',
    empleado: ''
  };
  currentPage.value = 1; // Volver a la página 1 al limpiar filtros
  showMessage('Filtros limpiados', 'success');
};

const viewVenta = (venta: Venta) => {
  router.push(`/ventas/${venta.idVenta}`);
};

const downloadVenta = (venta: Venta) => {
  // Implementar descarga de recibo
  showMessage('Función de descarga en desarrollo', 'error');
  console.log('Descargar venta:', venta.idVenta);
};

const deleteVenta = async (venta: Venta) => {
  if (!confirm(`¿Está seguro que desea eliminar la venta #${venta.idVenta}? Esta acción es irreversible.`)) {
    return;
  }

  try {
    await ventaService.delete(venta.idVenta);
    // Filtrar de la lista local
    ventas.value = ventas.value.filter(v => v.idVenta !== venta.idVenta);
    
    // CORRECCIÓN: Si la página actual queda vacía después de eliminar, retroceder.
    if (paginatedVentas.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
    }

    showMessage('Venta eliminada correctamente', 'success');
  } catch (error) {
    console.error('Error eliminando venta:', error);
    showMessage('Error al eliminar la venta. Verifique sus permisos.', 'error');
  }
};

const canDelete = (venta: Venta): boolean => {
  return authService.canDeleteVenta(venta);
};

const getTotalQuantity = (detalles: DetalleVenta[]): number => {
  return detalles.reduce((total, detalle) => total + detalle.cantidad, 0);
};

const formatDate = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleDateString('es-AR');
};

const formatTime = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

// Lifecycle
onMounted(() => {
  currentUser.value = authService.getCurrentUser();
  loadVentas();
});
</script>

<style scoped>

.filters-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* ... (El resto de tus estilos se mantuvieron en el bloque <style>) ... */
</style>