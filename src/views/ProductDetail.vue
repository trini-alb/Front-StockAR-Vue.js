<template>
  <div class="product-detail-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando producto...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h3>Error al cargar el producto</h3>
      <p>{{ error }}</p>
      <button @click="loadProduct" class="btn btn-primary">Reintentar</button>
      <router-link to="/productos" class="btn btn-secondary">Volver</router-link>
    </div>

    <!-- Product details -->
    <div v-else-if="producto" class="product-detail">
      <!-- Header -->
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
          <router-link to="/productos" class="btn btn-secondary">
            ← Volver
          </router-link>
          <button 
            v-if="canEdit" 
            @click="editProduct" 
            class="btn btn-primary"
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
                {{ formatCurrency(producto.precioNeto) }}
              </div>
            </div>
            <div class="price-item">
              <label>Precio de Venta</label>
              <div class="price-value sale">
                {{ formatCurrency(producto.precioVenta) }}
              </div>
            </div>
            <div class="price-item profit">
              <label>Margen de Ganancia</label>
              <div class="profit-info">
                <div class="profit-percentage">{{ profitMargin }}%</div>
                <div class="profit-amount">{{ formatCurrency(profitAmount) }}</div>
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
        <router-link to="/productos" class="btn btn-secondary">
          Volver a la Lista
        </router-link>
        <button 
          v-if="canEdit" 
          @click="editProduct" 
          class="btn btn-primary"
        >
          Editar Producto
        </button>
        <button 
          v-if="canDelete" 
          @click="confirmDelete" 
          class="btn btn-danger"
        >
          Eliminar Producto
        </button>
      </div>
    </div>
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
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
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

  const confirmed = confirm(
    `¿Está seguro que desea eliminar el producto "${producto.value.nombre}"?\n\nEsta acción no se puede deshacer.`
  );

  if (confirmed) {
    try {
      await productoService.delete(Number(productId.value));
      alert('Producto eliminado exitosamente');
      router.push('/productos');
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto. Por favor intente nuevamente.');
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state, .error-state {
  text-align: center;
  padding: 60px 20px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #3b82f6;
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
</style>