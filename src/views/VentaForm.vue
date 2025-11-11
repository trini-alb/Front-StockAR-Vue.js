<template>
  <!-- Basado en Registrar-Venta.html con funcionalidad completa -->
  <div class="venta-form-container">
    <!-- Header con navegación -->
    <header class="u-black u-clearfix u-header u-header" id="header">
      <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
        <div class="custom-expanded u-clearfix u-custom-html u-custom-html-1">
          <div class="menu-usuario">
            <div class="menu-desplegable">
              <span>{{ currentUser?.empleado?.nombre }}</span>
              <a @click="handleLogout" href="#">Cerrar sesión</a>
            </div>
          </div>
        </div>
        <p class="u-text u-text-default u-text-1">
          <span style="font-size: 1.875rem;">Registrar Venta</span>
        </p>
        
        <!-- Navegación simplificada -->
        <nav class="drawer-nav">
          <router-link to="/dashboard">Inicio</router-link>
          <router-link to="/productos">Lista de repuestos</router-link>
          <router-link to="/productos/nuevo">Agregar repuesto</router-link>
          <router-link to="/ventas">Lista de ventas</router-link>
          <router-link to="/calcular-precio">Calcular precio</router-link>
        </nav>
      </div>
    </header>

    <!-- Sección principal -->
    <section class="u-clearfix u-section-1" id="block-2">
      <div class="u-clearfix u-sheet u-sheet-1">
        
        <!-- Búsqueda de productos -->
        <div class="u-form u-form-1">
          <div class="search-products">
            <label class="u-label">Buscar producto por código o nombre:</label>
            <div class="search-input-container">
              <input 
                v-model.trim="searchProduct"
                @keyup.enter="searchProducts"
                type="text" 
                placeholder="Ingrese código o nombre del producto"
                class="u-input u-input-rectangle search-input"
              />
              <button 
                @click="searchProducts"
                class="u-btn u-btn-submit search-btn"
                :disabled="loading"
              >
                🔍 Buscar
              </button>
            </div>
            
            <!-- Resultados de búsqueda -->
            <div v-if="searchResults.length > 0" class="search-results">
              <div 
                v-for="producto in searchResults" 
                :key="producto.idProducto"
                @click="selectProduct(producto)"
                class="search-result-item"
                :class="{ 'out-of-stock': producto.stock <= 0 }"
              >
                <div class="product-info">
                  <span class="product-code">{{ producto.codigo }}</span>
                  <span class="product-name">{{ producto.nombre }}</span>
                  <span class="product-price">${{ producto.precioVenta.toFixed(2) }}</span>
                  <span class="product-stock" :class="getStockClass(producto.stock)">
                    Stock: {{ producto.stock }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Componente del Carrito de Compras -->
        <ShoppingCart
          v-model:items="ventaItems"
          v-model:observaciones="ventaData.observaciones"
          :loading="loading"
          @finalizar="finalizarVenta"
          @anular="anularVenta"
          @show-message="showMessage"
        />

        <!-- Mensajes de error/éxito -->
        <div v-if="message" class="message" :class="messageType">
          {{ message }}
        </div>

      </div>
    </section>

    <!-- Footer -->
    <footer class="u-align-center u-black u-clearfix u-container-align-center u-footer u-footer" id="footer">
      <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
        <router-link to="/dashboard" class="u-image u-logo u-image-1">
          <img src="/images/logo-Photoroom.png" class="u-logo-image u-logo-image-1" alt="StockAR">
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService, productoService, ventaService } from '@/services';
import type { Usuario, Producto } from '@/services';
import ShoppingCart from '@/components/ShoppingCart.vue';

const router = useRouter();

// Interfaces
interface VentaItem {
  producto: Producto;
  cantidad: number;
}

interface VentaData {
  observaciones: string;
  empleadoId: number;
  total: number;
  items: Array<{
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
}

// Estado reactivo
const currentUser = ref<Usuario | null>(null);
const loading = ref(false);
const searchProduct = ref('');
const searchResults = ref<Producto[]>([]);
const ventaItems = ref<VentaItem[]>([]);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const ventaData = ref<Partial<VentaData>>({
  observaciones: ''
});

// Métodos
const searchProducts = async () => {
  if (searchProduct.value.trim().length < 2) {
    searchResults.value = [];
    return;
  }

  loading.value = true;
  try {
    // CORRECCIÓN: Delegar la búsqueda al servicio en lugar de traer todos los productos.
    // Esto es mucho más eficiente si la base de datos es grande.
    // El servicio simulará el filtrado por ahora.
    searchResults.value = await productoService.search(searchProduct.value);
    
  } catch (error) {
    console.error('Error buscando productos:', error);
    showMessage('Error al buscar productos', 'error');
  } finally {
    loading.value = false;
  }
};

const selectProduct = (producto: Producto) => {
  if (producto.stock <= 0) {
    showMessage('Producto sin stock disponible', 'error');
    return;
  }

  // Verificar si ya está en el carrito
  const existingIndex = ventaItems.value.findIndex(item => 
    item.producto.idProducto === producto.idProducto
  );

  if (existingIndex >= 0) {
    // Si ya existe, aumentar cantidad
    if (ventaItems.value[existingIndex].cantidad < producto.stock) {
      ventaItems.value[existingIndex].cantidad++;
    } else {
      showMessage('No hay más stock disponible', 'error');
    }
  } else {
    // Agregar nuevo item
    ventaItems.value.push({
      producto,
      cantidad: 1
    });
  }

  // Limpiar búsqueda
  searchProduct.value = '';
  searchResults.value = [];
  showMessage('Producto agregado al carrito', 'success');
};

const finalizarVenta = async () => {
  if (ventaItems.value.length === 0) {
    showMessage('No hay productos en el carrito', 'error');
    return;
  }

  if (!currentUser.value?.empleado?.idEmpleado) {
    showMessage('Error: Usuario no válido', 'error');
    return;
  }

  loading.value = true;
  try {
    const totalVenta = ventaItems.value.reduce((total, item) => {
      return total + (item.cantidad * item.producto.precioVenta);
    }, 0);
    // Preparar datos de la venta
    const ventaCompleta: VentaData = {
      observaciones: ventaData.value.observaciones || '',
      empleadoId: currentUser.value.empleado.idEmpleado,
      total: totalVenta,
      items: ventaItems.value.map(item => ({
        productoId: item.producto.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precioVenta,
        subtotal: item.cantidad * item.producto.precioVenta
      }))
    };

    // Enviar al backend
    const venta = await ventaService.create(ventaCompleta);
    
    showMessage('Venta registrada exitosamente', 'success');
    
    // Limpiar carrito
    ventaItems.value = [];
    ventaData.value.observaciones = '';
    
    // Redirigir a la lista de ventas o mostrar detalles
    setTimeout(() => {
      router.push(`/ventas/${venta.idVenta}`);
    }, 2000);
    
  } catch (error) {
    console.error('Error registrando venta:', error);
    showMessage('Error al registrar la venta', 'error');
  } finally {
    loading.value = false;
  }
};

const anularVenta = () => {
  if (confirm('¿Está seguro que desea anular la venta? Se perderán todos los datos.')) {
    ventaItems.value = [];
    ventaData.value.observaciones = '';
    searchProduct.value = '';
    searchResults.value = [];
    showMessage('Venta anulada', 'success');
  }
};

const getStockClass = (stock: number) => {
  if (stock <= 0) return 'no-stock';
  if (stock <= 5) return 'low-stock';
  return 'good-stock';
};

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const handleLogout = async () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      router.push('/login');
    }
  }
};

// Lifecycle
onMounted(() => {
  currentUser.value = authService.getCurrentUser();
  
  // CORRECCIÓN: Precargar producto si viene desde la lista de productos
  const route = useRoute();
  const productoId = route.query.productoId;
  if (productoId) {
    const loadInitialProduct = async () => {
      try {
        const producto = await productoService.getById(Number(productoId));
        if (producto) {
          selectProduct(producto);
        }
      } catch (error) {
        console.error("Error al precargar el producto:", error);
        showMessage('No se pudo cargar el producto inicial', 'error');
      }
    };
    loadInitialProduct();
  }
});
</script>

<style scoped>
/* Importar CSS originales */
@import '/css/nicepage.css';
@import '/css/Registrar-Venta.css';

/* Estilos adicionales para la funcionalidad de ventas */
.search-input-container {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.search-input {
  flex: 1;
}

.search-btn {
  background: #1e40af;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.search-btn:hover:not(:disabled) {
  background: #1e3a8a;
}

.search-results {
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-result-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-result-item:hover:not(.out-of-stock) {
  background: #f0f9ff;
}

.search-result-item.out-of-stock {
  background: #fef2f2;
  cursor: not-allowed;
  opacity: 0.7;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.product-code {
  font-weight: bold;
  color: #1e40af;
}

.product-name {
  flex: 1;
}

.product-price {
  font-weight: bold;
  color: #059669;
}

.product-stock {
  font-size: 0.9rem;
  padding: 2px 6px;
  border-radius: 3px;
}

.good-stock {
  background: #dcfce7;
  color: #166534;
}

.low-stock {
  background: #fef3c7;
  color: #92400e;
}

.no-stock {
  background: #fecaca;
  color: #991b1b;
}

.message {
  padding: 12px 20px;
  border-radius: 6px;
  margin: 20px 0;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.message.error {
  background: #fecaca;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Navegación simplificada */
.drawer-nav {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.drawer-nav a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.drawer-nav a:hover {
  background: rgba(255,255,255,0.1);
}

.menu-usuario {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.menu-desplegable {
  display: flex;
  gap: 15px;
  align-items: center;
}

.menu-desplegable a {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.menu-desplegable a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .drawer-nav {
    flex-direction: column;
    gap: 10px;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>