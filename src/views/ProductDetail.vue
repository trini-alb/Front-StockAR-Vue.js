<template>
  <div class="product-detail-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando producto...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">❌</div>
      <h3>Error al cargar el producto</h3>
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="loadProduct" class="u-btn u-btn-primary">Reintentar</button>
        <router-link to="/productos" class="u-btn u-btn-secondary">Volver</router-link>
      </div>
    </div>

    <!-- Product details -->
    <section v-else-if="producto" class="u-clearfix u-section-1">
      <!-- Header -->
      <div class="u-clearfix u-sheet u-sheet-1">
        <div class="detail-header">
          <div class="header-info">
            <h1>{{ producto.nombre }}</h1>
            <div class="product-meta">
              <span v-if="producto.codigo" class="product-code">
                Código: {{ producto.codigo }}
              </span>
              <span class="product-status active">
                Activo
              </span>
            </div>
          </div>
          
          <div class="header-actions">
            <router-link to="/productos" class="u-btn u-btn-secondary">
              ← Volver
            </router-link>
            <button 
              v-if="canEdit" 
              @click="editProduct" 
              class="u-btn u-btn-primary"
            >
              ✏️ Editar
            </button>
          </div>
        </div>

        <!-- Product info grid -->
        <div class="product-grid">
          <!-- Basic Information -->
          <div class="info-card">
            <h3>Información Básica</h3>
            <div class="info-list">
              <div class="info-item">
                <label>Nombre:</label>
                <span>{{ producto.nombre }}</span>
              </div>
              <div class="info-item">
                <label>Código:</label>
                <span>{{ producto.codigo }}</span>
              </div>
              <div v-if="producto.descripcion" class="info-item">
                <label>Descripción:</label>
                <span>{{ producto.descripcion }}</span>
              </div>
              <div class="info-item">
                <label>Marca:</label>
                <span>{{ producto.marca }}</span>
              </div>
            </div>
          </div>

          <!-- Classification -->
          <div class="info-card">
            <h3>Clasificación</h3>
            <div class="info-list">
              <div class="info-item">
                <label>Tipo:</label>
                <span>{{ producto.tipoProducto?.nombre || 'No especificado' }}</span>
              </div>
              <div class="info-item">
                <label>Moneda:</label>
                <span>{{ producto.moneda?.nombre || 'No especificado' }}</span>
              </div>
              <div class="info-item">
                <label>Cotización:</label>
                <span>{{ producto.moneda?.cotizacion || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Prices -->
          <div class="info-card highlight">
            <h3>Precios</h3>
            <div class="price-grid">
              <div class="price-item"> 
                <label>Precio Neto</label>
                <div class="price-value cost">
                  {{ formatCurrency(producto.precioNeto, producto.moneda?.nombre === 'Dolar' ? 'USD' : 'ARS') }}
                </div>
              </div>
              <div class="price-item">
                <label>Precio de Venta</label>
                <div class="price-value sale">
                  {{ formatCurrency(producto.precioVenta, 'ARS') }}
                </div>
              </div>
              <div class="price-item profit">
                <label>Margen de Ganancia</label>
                <div class="profit-info">
                  <div class="profit-percentage">{{ profitMargin }}%</div>
                  <div class="profit-amount">{{ formatCurrency(profitAmount, 'ARS') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock -->
          <div class="info-card" :class="{ 'warning': isLowStock }">
            <h3>
              Stock
              <span v-if="isLowStock" class="stock-warning">⚠️ Stock Bajo</span>
            </h3>
            <div class="stock-grid">
              <div class="stock-item">
                <label>Stock Actual</label>
                <div class="stock-value" :class="stockStatusClass">
                  {{ producto.stock }} unidades
                </div>
              </div>
              <div class="stock-item">
                <label>Stock Mínimo</label>
                <div class="stock-value">
                  5 unidades
                </div>
              </div>
              <div class="stock-item">
                <label>Estado</label>
                <div class="stock-status" :class="stockStatusClass">
                  {{ stockStatus }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-actions">
          <router-link to="/productos" class="u-btn u-btn-secondary">
            Volver a la Lista
          </router-link>
          <button 
            v-if="canEdit" 
            @click="editProduct" 
            class="u-btn u-btn-primary"
          >
            Editar Producto
          </button>
          <button 
            v-if="canDelete" 
            @click="confirmDelete" 
            class="u-btn u-btn-danger"
          >
            Eliminar Producto
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productoService, authService, type Producto } from '@/services';


// Router
const route = useRoute();
const router = useRouter();

// State
const loading = ref(true);
const error = ref('');
const producto = ref<Producto | null>(null);

// Computed
const productId = computed(() => route.params.id as string);

const canEdit = computed(() => 
  authService.hasPermission('editar_producto') || authService.hasRole('admin')
);

const canDelete = computed(() => 
  authService.hasPermission('eliminar_producto') || authService.hasRole('admin')
);

const profitAmount = computed(() => {
  if (!producto.value || producto.value.precioVenta == null || producto.value.precioNeto == null) return 0;
  return producto.value.precioVenta - producto.value.precioNeto;
});

const profitMargin = computed(() => {
  if (!producto.value || !producto.value.precioNeto) return '0.00';
  const margin = (profitAmount.value / producto.value.precioNeto) * 100;
  return margin.toFixed(2);
});

const isLowStock = computed(() => {
  if (!producto.value) return false;
  return producto.value.stock <= 5; // Stock mínimo fijo por ahora
});

const stockStatus = computed(() => {
  if (!producto.value) return 'Desconocido';
  
  if (producto.value.stock === 0) return 'Sin Stock';
  if (isLowStock.value) return 'Stock Bajo';
  return 'Stock Normal';
});

const stockStatusClass = computed(() => {
  if (!producto.value) return '';
  
  if (producto.value.stock === 0) return 'no-stock';
  if (isLowStock.value) return 'low-stock';
  return 'normal-stock';
});

// Methods
const formatCurrency = (amount: number, currency: 'ARS' | 'USD' = 'ARS'): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const loadProduct = async (): Promise<void> => {
  try {
    loading.value = true;
    error.value = '';
    
    producto.value = await productoService.getById(Number(productId.value));
  } catch (err) {
    console.error('Error al cargar producto:', err);
    error.value = 'No se pudo cargar la información del producto';
  } finally {
    loading.value = false;
  }
};

const editProduct = (): void => {
  router.push(`/productos/${productId.value}/editar`);
};

const confirmDelete = async (): Promise<void> => {
  if (!producto.value) return;

  // CORRECCIÓN: Añadir un mensaje de confirmación para evitar borrados accidentales.
  if (confirm(
    `¿Está seguro que desea eliminar el producto "${producto.value.nombre}"?\n\nEsta acción no se puede deshacer.`
  )) {
    try {
      await productoService.delete(Number(productId.value));
      alert('Producto eliminado exitosamente');
      router.push('/productos');
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto. Verifique que no esté asociado a ninguna venta.');
    }
  }
};

// Lifecycle
onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
/* Estilos copiados de tu ProductDetail.vue original para mantener la consistencia */
.product-detail-container { 
  background: #3b82f6;
  color: white;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: #333;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.u-btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

/* Agrega aquí el resto de los estilos de ProductDetail.vue */
.u-sheet-1 {
  padding: 2rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.header-info h1 {
  margin: 0;
  font-size: 2.25rem;
  color: #1f2937;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  color: #6b7280;
}

.product-code {
  background-color: #eef2ff;
  color: #4338ca;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.product-status.active {
  background-color: #dcfce7;
  color: #166534;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  color: #374151;
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 0.75rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
}

.info-item label {
  font-weight: 500;
  color: #6b7280;
}

.info-item span {
  text-align: right;
}

.info-card.highlight {
  background-color: #f0f9ff;
  border: 1px solid #bfdbfe;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.price-item {
  text-align: center;
}

.price-item label {
  font-size: 0.875rem;
  color: #6b7280;
}

.price-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.price-value.cost { color: #dc2626; }
.price-value.sale { color: #16a34a; }

.price-item.profit {
  grid-column: 1 / -1;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}

.profit-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.profit-percentage {
  font-size: 1.75rem;
  font-weight: bold;
  color: #16a34a;
}

.profit-amount {
  font-size: 1.25rem;
  color: #6b7280;
}

.info-card.warning {
  background-color: #fefce8;
  border: 1px solid #fde047;
}

.stock-warning {
  font-size: 1rem;
  margin-left: 0.5rem;
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.stock-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stock-status {
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.normal-stock { color: #166534; background-color: #dcfce7; }
.low-stock { color: #92400e; background-color: #fef3c7; }
.no-stock { color: #991b1b; background-color: #fef2f2; }

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.u-btn {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
</style>