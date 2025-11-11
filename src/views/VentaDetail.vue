<template>
  <!-- Basado en Detalle-venta.html con funcionalidad completa -->
  <div class="venta-detail-container">
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
          <span style="font-size: 1.875rem;">Detalle de venta</span>
        </p>
        
        <!-- Navegación -->
        <nav class="drawer-nav">
          <router-link to="/dashboard">Inicio</router-link>
          <router-link to="/productos">Lista de repuestos</router-link>
          <router-link to="/productos/nuevo">Agregar repuesto</router-link>
          <router-link to="/ventas/nueva">Registrar venta</router-link>
          <router-link to="/calcular-precio">Calcular precio</router-link>
          <router-link to="/ventas">Lista de ventas</router-link>
        </nav>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading">Cargando detalle de venta...</div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <h3>Error al cargar la venta</h3>
        <p>{{ error }}</p>
        <div class="error-actions">
          <router-link to="/ventas" class="u-btn u-btn-primary">
            ⬅️ Volver a Lista de Ventas
          </router-link>
          <button @click="() => loadVenta()" class="u-btn u-btn-secondary">
            🔄 Reintentar
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <section v-else-if="venta" class="u-clearfix u-section-1" id="block-3">
      <div class="u-clearfix u-sheet u-sheet-1">
        
        <!-- Información general de la venta -->
        <div class="venta-header">
          <div class="venta-info-card">
            <h2 class="venta-title">Venta #{{ venta.idVenta }}</h2>
            <div class="venta-meta">
              <div class="meta-item">
                <strong>Fecha:</strong> {{ formatDate(venta.fechaHora) }}
              </div>
              <div class="meta-item">
                <strong>Hora:</strong> {{ formatTime(venta.fechaHora) }}
              </div>
              <div class="meta-item">
                <strong>Empleado:</strong> {{ venta.empleado.nombre }} {{ venta.empleado.apellido }}
              </div>
              <div class="meta-item">
                <strong>Rol:</strong> {{ venta.empleado.rol.nombre }}
              </div>
            </div>
          </div>

          <!-- Estadísticas rápidas -->
          <div class="venta-stats">
            <div class="stat-card">
              <div class="stat-number">{{ venta.detalles.length }}</div>
              <div class="stat-label">Productos</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ totalQuantity }}</div>
              <div class="stat-label">Unidades</div>
            </div>
            <div class="stat-card total-card">
              <div class="stat-number">${{ venta.total.toFixed(2) }}</div>
              <div class="stat-label">Total</div>
            </div>
          </div>
        </div>

        <!-- Búsqueda rápida (opcional para buscar otra venta) -->
        <div class="search-section">
          <div class="u-form u-form-1">
            <div class="search-container">
              <input 
                v-model="searchVentaId"
                type="number" 
                placeholder="Buscar otra venta por ID"
                class="u-input u-input-rectangle search-input"
                @keyup.enter="searchVenta"
              />
              <button 
                @click="searchVenta"
                class="u-border-2 u-border-black u-btn u-btn-submit u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-1"
                :disabled="!searchVentaId || searching"
              >
                {{ searching ? 'Buscando...' : 'Buscar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de detalles de venta -->
        <div class="table-container">
          <div class="u-table u-table-responsive u-table-1">
            <table class="u-table-entity">
              <thead>
                <tr>
                  <th class="u-border-1 u-border-grey-dark-1 u-table-cell header-cell">
                    Código / Nombre del producto
                  </th>
                  <th class="u-border-1 u-border-grey-dark-1 u-table-cell header-cell">
                    Cantidad
                  </th>
                  <th class="u-border-1 u-border-grey-dark-1 u-table-cell header-cell">
                    Precio unitario
                  </th>
                  <th class="u-border-1 u-border-grey-dark-1 u-table-cell header-cell">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody class="u-table-body">
                <tr 
                  v-for="detalle in venta.detalles" 
                  :key="detalle.idDetalle"
                  class="detail-row"
                >
                  <td class="u-border-1 u-border-grey-dark-1 u-table-cell product-cell">
                    <div class="product-info">
                      <div class="product-code">Código: {{ detalle.producto.codigo }}</div>
                      <div class="product-name">{{ detalle.producto.nombre }}</div>
                      <div class="product-description">{{ detalle.producto.descripcion }}</div>
                    </div>
                  </td>
                  <td class="u-border-1 u-border-grey-dark-1 u-table-cell quantity-cell">
                    <span class="quantity">{{ detalle.cantidad }}</span>
                  </td>
                  <td class="u-border-1 u-border-grey-dark-1 u-table-cell price-cell">
                    <span class="price">${{ getPrecioUnitario(detalle).toFixed(2) }}</span>
                  </td>
                  <td class="u-border-1 u-border-grey-dark-1 u-table-cell subtotal-cell">
                    <span class="subtotal">${{ detalle.subtotal.toFixed(2) }}</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="3" class="u-border-1 u-border-grey-dark-1 u-table-cell total-label">
                    <strong>Total de la venta:</strong>
                  </td>
                  <td class="u-border-1 u-border-grey-dark-1 u-table-cell total-amount">
                    <strong>${{ venta.total.toFixed(2) }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="additional-info">
          <div class="info-section">
            <h4>Información de la transacción</h4>
            <div class="transaction-details">
              <div class="detail-item">
                <span class="label">ID de venta:</span>
                <span class="value">#{{ venta.idVenta }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Fecha completa:</span>
                <span class="value">{{ formatFullDate(venta.fechaHora) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Empleado responsable:</span>
                <span class="value">{{ venta.empleado.nombre }} {{ venta.empleado.apellido }} ({{ venta.empleado.rol.nombre }})</span>
              </div>
              <div class="detail-item">
                <span class="label">Cantidad total de productos:</span>
                <span class="value">{{ venta.detalles.length }} tipo(s) diferentes</span>
              </div>
              <div class="detail-item">
                <span class="label">Unidades vendidas:</span>
                <span class="value">{{ totalQuantity }} unidad(es)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="action-section">
          <div class="action-buttons">
            <button 
              @click="downloadReceipt"
              class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-hover-palette-2-base action-btn"
              :disabled="downloading"
            >
              {{ downloading ? 'Generando...' : '📄 Descargar Recibo' }}
            </button>
            
            <button 
              @click="printReceipt"
              class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-hover-palette-2-base action-btn"
            >
              🖨️ Imprimir
            </button>
            
            <router-link 
              to="/ventas"
              class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-hover-palette-2-base action-btn"
            >
              ⬅️ Volver a Lista
            </router-link>
            
            <button 
              v-if="canDelete"
              @click="deleteVenta"
              class="u-border-2 u-border-red u-btn u-button-style u-red u-hover-palette-2-base action-btn delete-btn"
              :disabled="deleting"
            >
              {{ deleting ? 'Eliminando...' : '🗑️ Anular Venta' }}
            </button>
          </div>
        </div>

        <!-- Mensajes -->
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


const router = useRouter();
const route = useRoute();

// Estado reactivo
const currentUser = ref<Usuario | null>(null);
const loading = ref(false);
const searching = ref(false);
const downloading = ref(false);
const deleting = ref(false);
const venta = ref<Venta | null>(null);
const error = ref('');
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const searchVentaId = ref<number | null>(null);

// Computed properties
const totalQuantity = computed(() => {
  return venta.value?.detalles.reduce((total, detalle) => total + detalle.cantidad, 0) || 0;
});

const canDelete = computed(() => {
  if (!venta.value || !currentUser.value) return false;
  
  // Solo permitir eliminar ventas del mismo día o si es admin
  const today = new Date().toISOString().split('T')[0];
  const ventaDate = new Date(venta.value.fechaHora).toISOString().split('T')[0];
  
  return ventaDate === today || currentUser.value.empleado?.rol?.nombre === 'admin';
});

// Métodos
const loadVenta = async (ventaId?: number) => {
  const id = ventaId || parseInt(route.params.id as string);
  
  if (!id || isNaN(id)) {
    error.value = 'ID de venta inválido';
    return;
  }

  loading.value = true;
  error.value = '';
  
  try {
    venta.value = await ventaService.getById(id);
  } catch (err: any) {
    console.error('Error cargando venta:', err);
    if (err.response?.status === 404) {
      error.value = `No se encontró la venta con ID ${id}`;
    } else {
      error.value = 'Error al cargar los detalles de la venta';
    }
  } finally {
    loading.value = false;
  }
};

const searchVenta = async () => {
  if (!searchVentaId.value) {
    showMessage('Ingrese un ID de venta válido', 'error');
    return;
  }

  searching.value = true;
  try {
    await loadVenta(searchVentaId.value);
    if (venta.value) {
      // Actualizar la URL sin recargar la página
      router.replace(`/ventas/${searchVentaId.value}`);
      showMessage('Venta cargada correctamente', 'success');
    }
  } catch (err) {
    showMessage('Error al buscar la venta', 'error');
  } finally {
    searching.value = false;
    searchVentaId.value = null;
  }
};

const getPrecioUnitario = (detalle: DetalleVenta): number => {
  return detalle.cantidad > 0 ? detalle.subtotal / detalle.cantidad : 0;
};

const downloadReceipt = async () => {
  if (!venta.value) return;
  
  downloading.value = true;
  try {
    // Crear contenido del recibo
    const receiptContent = generateReceiptContent();
    
    // Crear y descargar archivo
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recibo-venta-${venta.value.idVenta}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    showMessage('Recibo descargado correctamente', 'success');
  } catch (err) {
    console.error('Error descargando recibo:', err);
    showMessage('Error al descargar el recibo', 'error');
  } finally {
    downloading.value = false;
  }
};

const printReceipt = () => {
  if (!venta.value) return;
  
  const printContent = generatePrintContent();
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

const deleteVenta = async () => {
  if (!venta.value || !canDelete.value) return;
  
  const confirmMessage = `¿Está seguro que desea anular la venta #${venta.value.idVenta}?\n\nEsta acción no se puede deshacer.`;
  
  if (!confirm(confirmMessage)) return;
  
  deleting.value = true;
  try {
    await ventaService.delete(venta.value.idVenta);
    showMessage('Venta anulada correctamente', 'success');
    
    // Redirigir a la lista de ventas después de 2 segundos
    setTimeout(() => {
      router.push('/ventas');
    }, 2000);
    
  } catch (err) {
    console.error('Error anulando venta:', err);
    showMessage('Error al anular la venta', 'error');
  } finally {
    deleting.value = false;
  }
};

const generateReceiptContent = (): string => {
  if (!venta.value) return '';
  
  let content = `
====================================
           STOCKAR RECIBO
====================================

Venta #: ${venta.value.idVenta}
Fecha: ${formatFullDate(venta.value.fechaHora)}
Empleado: ${venta.value.empleado.nombre} ${venta.value.empleado.apellido}

====================================
            PRODUCTOS
====================================

`;

  venta.value.detalles.forEach(detalle => {
    const precioUnitario = getPrecioUnitario(detalle);
    content += `
${detalle.producto.nombre}
Código: ${detalle.producto.codigo}
Cantidad: ${detalle.cantidad}
Precio unitario: $${precioUnitario.toFixed(2)}
Subtotal: $${detalle.subtotal.toFixed(2)}
------------------------------------
`;
  });

  content += `
====================================
TOTAL: $${venta.value.total.toFixed(2)}
====================================

Cantidad de productos: ${venta.value.detalles.length}
Unidades totales: ${totalQuantity.value}

¡Gracias por su compra!
`;

  return content;
};

const generatePrintContent = (): string => {
  if (!venta.value) return '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Recibo - Venta #${venta.value.idVenta}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
    .info { margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table th, .table td { border: 1px solid #000; padding: 8px; text-align: left; }
    .table th { background-color: #f0f0f0; }
    .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>STOCKAR</h1>
    <h2>Recibo de Venta #${venta.value.idVenta}</h2>
  </div>
  
  <div class="info">
    <p><strong>Fecha:</strong> ${formatFullDate(venta.value.fechaHora)}</p>
    <p><strong>Empleado:</strong> ${venta.value.empleado.nombre} ${venta.value.empleado.apellido}</p>
    <p><strong>Rol:</strong> ${venta.value.empleado.rol.nombre}</p>
  </div>
  
  <table class="table">
    <thead>
      <tr>
        <th>Producto</th>
        <th>Código</th>
        <th>Cantidad</th>
        <th>Precio Unit.</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${venta.value.detalles.map(detalle => `
        <tr>
          <td>${detalle.producto.nombre}</td>
          <td>${detalle.producto.codigo}</td>
          <td>${detalle.cantidad}</td>
          <td>$${getPrecioUnitario(detalle).toFixed(2)}</td>
          <td>$${detalle.subtotal.toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="total">
    <p>Total: $${venta.value.total.toFixed(2)}</p>
  </div>
  
  <div class="info">
    <p><strong>Resumen:</strong></p>
    <p>Productos diferentes: ${venta.value.detalles.length}</p>
    <p>Unidades totales: ${totalQuantity.value}</p>
  </div>
</body>
</html>
`;
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

const formatFullDate = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

const handleLogout = async () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    try {

      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
    
      router.push('/login');
    }
  }
};

// Lifecycle
onMounted(() => {
  loadVenta();
});
</script>

<style>
/* Importar CSS originales */
@import '/css/nicepage.css';
@import '/css/Detalle-venta.css';

/* Estilos adicionales para VentaDetail */
.venta-detail-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.loading-container, .error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.loading {
  font-size: 1.1rem;
  color: #6b7280;
}

.error-content {
  text-align: center;
  padding: 40px;
}

.error-content h3 {
  color: #dc2626;
  margin: 0 0 10px 0;
}

.error-content p {
  color: #6b7280;
  margin: 0 0 20px 0;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.venta-header {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.venta-info-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex: 1;
  min-width: 300px;
}

.venta-title {
  color: #1e40af;
  margin: 0 0 15px 0;
  font-size: 1.8rem;
}

.venta-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.meta-item {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.meta-item strong {
  color: #374151;
  margin-right: 8px;
}

.venta-stats {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  min-width: 100px;
}

.stat-card.total-card {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.total-card .stat-number {
  color: white;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

.total-card .stat-label {
  color: rgba(255,255,255,0.9);
}

.search-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-container {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.table-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.u-table-1 {
  width: 100%;
  border-collapse: collapse;
}

.header-cell {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  padding: 15px 12px;
  text-align: left;
}

.detail-row:hover {
  background: #f9fafb;
}

.product-cell {
  padding: 15px 12px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-code {
  font-size: 0.9rem;
  color: #6b7280;
  font-family: monospace;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
}

.product-description {
  font-size: 0.9rem;
  color: #6b7280;
}

.quantity-cell, .price-cell, .subtotal-cell {
  padding: 15px 12px;
  text-align: center;
  vertical-align: middle;
}

.quantity {
  font-weight: 600;
  color: #059669;
  background: #dcfce7;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.price, .subtotal {
  font-weight: 600;
  color: #1f2937;
}

.total-row {
  background: #f9fafb;
}

.total-label, .total-amount {
  padding: 15px 12px;
  font-size: 1.1rem;
}

.total-amount {
  text-align: center;
  color: #059669;
}

.additional-info {
  background: white;
  border-radius: 8px;
  padding: 25px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.additional-info h4 {
  color: #374151;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
}

.transaction-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item .label {
  font-weight: 500;
  color: #6b7280;
}

.detail-item .value {
  font-weight: 600;
  color: #1f2937;
  text-align: right;
}

.action-section {
  background: white;
  border-radius: 8px;
  padding: 25px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.delete-btn {
  background: #fef2f2 !important;
  border-color: #dc2626 !important;
  color: #dc2626 !important;
}

.delete-btn:hover {
  background: #fecaca !important;
}

.message {
  padding: 15px 20px;
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

/* Responsive design */
@media (max-width: 768px) {
  .venta-header {
    flex-direction: column;
  }
  
  .venta-info-card {
    min-width: auto;
  }
  
  .venta-stats {
    justify-content: center;
  }
  
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .transaction-details {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detail-item .value {
    text-align: left;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .u-table-1 {
    font-size: 0.9rem;
  }
  
  .header-cell, .u-table-cell {
    padding: 10px 8px;
  }
  
  .product-info {
    gap: 2px;
  }
  
  .product-code, .product-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    min-width: 80px;
    padding: 15px 10px;
  }
  
  .stat-number {
    font-size: 1.4rem;
  }
  
  .u-table-1 {
    font-size: 0.8rem;
  }
  
  .action-btn {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>