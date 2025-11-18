<template> 
  <!-- Usar el diseño original con tabla -->
  <section class="u-clearfix u-section-1" id="sec-e069">
    <div class="u-clearfix u-sheet u-sheet-1">
      
      <!-- Encabezado y búsqueda -->
      <div class="search-container">
        <h1>Lista de Repuestos</h1>
        <div class="search-form">
          <input 
            v-model="searchTerm"
            type="text" 
            @input="resetPage"
            placeholder="Buscar productos..."
            class="search-input"
          />
          <router-link to="/productos/nuevo" class="btn-nueva-venta">
            ➕ Agregar Producto
          </router-link>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-container">
        <select v-model="selectedTipo" @change="resetPage" class="filter-select">
          <option value="">Todos los tipos</option>
          <option v-for="tipo in tiposProducto" :key="tipo.idTipoProducto" :value="tipo.idTipoProducto">
            {{ tipo.nombre }}
          </option>
        </select>
        
        <select v-model="stockFilter" @change="resetPage" class="filter-select">
          <option value="">Todo el stock</option>
          <option value="bajo">Stock bajo</option>
          <option value="disponible">Con stock</option>
          <option value="agotado">Sin stock</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">Cargando productos...</div>

      <!-- Mensaje sin datos -->
      <div v-else-if="filteredProductos.length === 0" class="no-data">
        <p>No se encontraron productos</p>
      </div>
      
      <!-- Tabla de productos -->
      <table v-else class="u-table u-table-1">
        <thead class="u-table-header">
          <tr class="u-table-row">
            <th class="u-table-cell">Código</th>
            <th class="u-table-cell">Nombre</th>
            <th class="u-table-cell">Tipo</th>
            <th class="u-table-cell">Precio USD</th>
            <th class="u-table-cell">Precio ARS</th>
            <th class="u-table-cell">Stock</th>
            <th class="u-table-cell">Acciones</th>
          </tr>
        </thead>
        <tbody class="u-table-body">
          <tr 
            v-for="producto in paginatedProductos" 
            :key="producto.idProducto"
            class="u-table-row"
            :class="{ 'stock-bajo': producto.stock <= 5 }"
          >
            <td class="u-table-cell">{{ producto.codigo }}</td>
            <td class="u-table-cell">
              <strong>{{ producto.nombre }}</strong>
              <br>
              <small>{{ producto.descripcion }}</small>
            </td>
            <td class="u-table-cell">{{ producto.tipoProducto.nombre }}</td>
            <td class="u-table-cell">${{ producto.precioNeto.toFixed(2) }}</td>
            <td class="u-table-cell">{{ formatCurrency(producto.precioVenta) }}</td>
            <td class="u-table-cell">
              <span :class="getStockClass(producto.stock)">
                {{ producto.stock }}
              </span>
              <div v-if="producto.stock <= 5" class="stock-warning-small">
                ⚠️ Bajo
              </div>
            </td>
            <td class="u-table-cell acciones">
              <div class="acciones">
                <button 
                  @click="viewProduct(producto)" 
                  class="btn-accion btn-ver"
                  title="Ver detalles"
                >
                  👁️
                </button>
                <button 
                  @click="editProduct(producto)" 
                  class="btn-accion btn-editar"
                  title="Editar producto"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteProduct(producto)" 
                  class="btn-accion btn-eliminar"
                  title="Eliminar producto"
                >
                  🗑️
                </button>
                <router-link 
                  :to="{ name: 'venta-new', query: { productoId: producto.idProducto } }"
                  class="btn-accion btn-venta"
                  title="Nueva venta"
                >
                  🛒
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="filteredProductos.length > itemsPerPage" class="pagination">
        <button 
          @click="currentPage = 1" 
          :disabled="currentPage === 1"
        >
          ⏮️
        </button>
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
        >
          ⏪
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
        >
          ⏩
        </button>
        <button 
          @click="currentPage = totalPages" 
          :disabled="currentPage === totalPages"
        >
          ⏭️
        </button>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productoService } from '@/services';
import { usePagination } from '@/views/usePagination'; // Asegúrate de que esta ruta sea correcta
import type { Producto, TipoProducto } from '@/services';

const router = useRouter();

// Estado reactivo
const loading = ref(false);
const productos = ref<Producto[]>([]);
const tiposProducto = ref<TipoProducto[]>([]);
const searchTerm = ref('');
const selectedTipo = ref<number | ''>('');
const stockFilter = ref<string>('');
const itemsPerPage = 10;

// Computed
const filteredProductos = computed(() => {
  let result = productos.value;
  
  // Filtro por búsqueda
  if (searchTerm.value) {
    result = result.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      p.codigo.toString().toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  
  // Filtro por tipo
  if (selectedTipo.value) {
    result = result.filter(p => p.tipoProducto.idTipoProducto === selectedTipo.value);
  }
  
  // Filtro por stock
  if (stockFilter.value) {
    switch (stockFilter.value) {
      case 'bajo':
        result = result.filter(p => p.stock <= 5);
        break;
      case 'disponible':
        result = result.filter(p => p.stock > 0);
        break;
      case 'agotado':
        result = result.filter(p => p.stock === 0);
        break;
    }
  }
  
  return result;
});

const { currentPage, totalPages, paginatedItems: paginatedProductos } = usePagination(filteredProductos, ref(itemsPerPage));

// Métodos
const loadData = async () => {
  loading.value = true;
  try {
    const [productosData, tiposData] = await Promise.all([
      productoService.getAll(),
      productoService.getTiposProducto()
    ]);
    
    productos.value = productosData;
    tiposProducto.value = tiposData;
    
  } catch (error) {
    console.error('Error cargando productos:', error);
    alert('Error al cargar los productos');
  } finally {
    loading.value = false;
  }
};

const resetPage = () => {
  currentPage.value = 1;
};

const getStockStatus = (producto: Producto) => {
  if (producto.stock === 0) return 'agotado';
  if (producto.stock <= 5) return 'bajo';
  return 'disponible';
};

const editProduct = (producto: Producto) => {
  router.push(`/productos/${producto.idProducto}/editar`);
};

const viewProduct = (producto: Producto) => {
  router.push(`/productos/${producto.idProducto}`);
};

const deleteProduct = async (producto: Producto) => {
  if (!confirm(`¿Está seguro que desea eliminar el producto "${producto.nombre}"?`)) {
    return;
  }
  
  try {
    await productoService.delete(producto.idProducto);
    productos.value = productos.value.filter(p => p.idProducto !== producto.idProducto);
    alert('Producto eliminado correctamente');
  } catch (error) {
    console.error('Error eliminando producto:', error);
    alert('Error al eliminar el producto');
  }
};

const getStockClass = (stock: number) => {
  if (stock === 0) return 'stock-agotado';
  if (stock <= 5) return 'stock-bajo';
  return 'stock-normal';
};

import { formatCurrency } from '@/components/formatters';

// Comentado porque no se usa
// const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString('es-AR');
// };

// Lifecycle
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Importar CSS originales */

/* Estilos adicionales para Vue */
.search-container {
  margin: 20px 0 30px 0;
  text-align: center;
}

.search-container h1 {
  margin: 0 0 20px 0;
  color: #1e40af;
}

.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 300px;
  max-width: 100%;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.filters-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0 30px 0;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.loading, .no-data {
  text-align: center;
  padding: 40px 20px;
  margin: 20px 0;
  background: #f9fafb;
  border-radius: 8px;
}

.no-data {
  color: #6b7280;
}

.stock-bajo {
  background-color: #fef3c7 !important;
}

.stock-normal {
  color: #059669;
  font-weight: bold;
}

.stock-bajo {
  color: #d97706;
  font-weight: bold;
}

.stock-agotado {
  color: #dc2626;
  font-weight: bold;
}

.stock-warning-small {
  font-size: 0.8rem;
  color: #d97706;
  margin-top: 2px;
}

.btn-nueva-venta {
  background: #2ed573;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
  transition: background 0.3s ease;
}

.btn-nueva-venta:hover {
  background: #26d865;
  color: white;
  text-decoration: none;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 30px 0 20px 0;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.pagination button:hover:not(:disabled) {
  background: #f0f9ff;
  border-color: #1e40af;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-weight: 500;
  color: #374151;
}

/* Responsive */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-select {
    width: 200px;
  }
  
  .u-table-1 {
    font-size: 0.8rem;
  }
  
  .u-table-1 th,
  .u-table-1 td {
    padding: 6px 4px;
  }
  
  .acciones {
    flex-direction: column !important;
    gap: 4px !important;
  }
  
  .btn-accion {
    width: 100% !important;
  }
}

@media (max-width: 480px) {
  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .pagination button {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}
</style>