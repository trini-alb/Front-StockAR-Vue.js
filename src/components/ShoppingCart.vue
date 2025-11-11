<template>
  <div>
    <!-- Carrito de compras -->
    <div v-if="items.length > 0" class="u-group u-group-1">
      <div class="u-container-layout u-container-layout-1">
        <h3>Carrito de Compras</h3>
        
        <!-- Lista de items -->
        <div class="cart-items">
          <div 
            v-for="(item, index) in items" 
            :key="index"
            class="cart-item"
          >
            <div class="item-details">
              <span class="item-code">{{ item.producto.codigo }}</span>
              <span class="item-name">{{ item.producto.nombre }}</span>
              <span class="item-price">${{ item.producto.precioVenta.toFixed(2) }}</span>
            </div>
            
            <!-- Cantidad -->
            <div class="quantity-controls">
              <button 
                @click="decreaseQuantity(index)"
                class="qty-btn"
                :disabled="item.cantidad <= 1"
              >
                -
              </button>
              <input 
                :value="item.cantidad"
                @change="updateQuantity(index, $event)"
                type="number" 
                min="1" 
                :max="item.producto.stock"
                class="qty-input"
              />
              <button 
                @click="increaseQuantity(index)"
                class="qty-btn"
                :disabled="item.cantidad >= item.producto.stock"
              >
                +
              </button>
            </div>
            
            <!-- Subtotal -->
            <div class="item-subtotal">
              <span>Subtotal: ${{ (item.cantidad * item.producto.precioVenta).toFixed(2) }}</span>
            </div>
            
            <!-- Eliminar -->
            <button 
              @click="removeItem(index)"
              class="remove-btn"
              title="Eliminar producto"
            >
              🗑️
            </button>
          </div>
        </div>

        <!-- Totales -->
        <div class="cart-totals">
          <div class="total-items">
            <strong>Total Items: {{ totalItems }}</strong>
          </div>
          <div class="total-amount">
            <strong>Total: ${{ totalAmount.toFixed(2) }}</strong>
          </div>
        </div>
        
        <!-- Información adicional de la venta -->
        <div class="sale-info">
          <div class="u-form-group">
            <label class="u-label">Observaciones (opcional):</label>
            <textarea 
              :value="observaciones" 
              @input="$emit('update:observaciones', ($event.target as HTMLTextAreaElement).value)"
              placeholder="Observaciones adicionales de la venta..."
              class="u-input u-input-rectangle"
              rows="3"
            ></textarea>
          </div>
        </div>

      </div>
    </div>

    <!-- Botones de acción -->
    <div v-if="items.length > 0" class="action-buttons">
      <button 
        @click="$emit('finalizar')"
        class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-3"
        :disabled="loading || items.length === 0"
      >
        {{ loading ? 'Procesando...' : 'Finalizar Venta' }}
      </button>
      
      <button 
        @click="$emit('anular')"
        class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-4"
        :disabled="loading"
      >
        Anular Venta
      </button>
    </div>

    <!-- Mensaje si no hay items -->
    <div v-else class="empty-cart">
      <p>No hay productos en el carrito. Busque y seleccione productos para comenzar la venta.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Producto } from '@/services';

// Interfaces
interface VentaItem {
  producto: Producto;
  cantidad: number;
}

const props = defineProps<{
  items: VentaItem[];
  observaciones: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:items', value: VentaItem[]): void;
  (e: 'update:observaciones', value: string): void;
  (e: 'finalizar'): void;
  (e: 'anular'): void;
  (e: 'show-message', text: string, type: 'success' | 'error'): void;
}>();

// Computed properties
const totalItems = computed(() => {
  return props.items.reduce((total, item) => total + item.cantidad, 0);
});

const totalAmount = computed(() => {
  return props.items.reduce((total, item) => {
    return total + (item.cantidad * item.producto.precioVenta);
  }, 0);
});

// Métodos
const increaseQuantity = (index: number) => {
  const newItems = [...props.items];
  const item = newItems[index];
  if (item.cantidad < item.producto.stock) {
    item.cantidad++;
    emit('update:items', newItems);
  } else {
    emit('show-message', 'No hay más stock disponible', 'error');
  }
};

const decreaseQuantity = (index: number) => {
  const newItems = [...props.items];
  const item = newItems[index];
  if (item.cantidad > 1) {
    item.cantidad--;
    emit('update:items', newItems);
  }
};

const updateQuantity = (index: number, event: Event) => {
  const newItems = [...props.items];
  const item = newItems[index];
  const target = event.target as HTMLInputElement;
  const newQuantity = parseInt(target.value);
  
  if (newQuantity > 0 && newQuantity <= item.producto.stock) {
    item.cantidad = newQuantity;
  } else if (newQuantity > item.producto.stock) {
    item.cantidad = item.producto.stock;
    emit('show-message', 'Cantidad ajustada al stock disponible', 'error');
  } else {
    item.cantidad = 1;
  }
  emit('update:items', newItems);
};

const removeItem = (index: number) => {
  const newItems = [...props.items];
  newItems.splice(index, 1);
  emit('update:items', newItems);
  emit('show-message', 'Producto eliminado del carrito', 'success');
};
</script>

<style scoped>
/* Los estilos del carrito que estaban en VentaForm.vue se mueven aquí */
.cart-items { margin: 20px 0; }
.cart-item { display: flex; align-items: center; gap: 15px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 10px 0; background: white; }
.item-details { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.item-code { font-weight: bold; color: #1e40af; font-size: 0.9rem; }
.item-name { font-weight: 500; }
.item-price { color: #059669; font-size: 0.9rem; }
.quantity-controls { display: flex; align-items: center; gap: 5px; }
.qty-btn { background: #f3f4f6; border: 1px solid #d1d5db; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover:not(:disabled) { background: #e5e7eb; }
.qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.qty-input { width: 60px; text-align: center; border: 1px solid #d1d5db; border-radius: 4px; padding: 5px; }
.item-subtotal { font-weight: bold; color: #1e40af; min-width: 120px; text-align: right; }
.remove-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #dc2626; padding: 8px; border-radius: 4px; cursor: pointer; }
.remove-btn:hover { background: #fecaca; }
.cart-totals { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: right; }
.total-items { margin-bottom: 10px; font-size: 1.1rem; }
.total-amount { font-size: 1.3rem; color: #1e40af; }
.sale-info { margin: 20px 0; }
.action-buttons { display: flex; gap: 20px; justify-content: center; margin: 30px 0; }
.empty-cart { text-align: center; padding: 60px 20px; color: #6b7280; background: #f9fafb; border-radius: 12px; margin: 20px 0; }

@media (max-width: 768px) {
  .cart-item { flex-direction: column; align-items: flex-start; gap: 10px; }
  .quantity-controls { align-self: center; }
  .action-buttons { flex-direction: column; align-items: center; }
}
</style>