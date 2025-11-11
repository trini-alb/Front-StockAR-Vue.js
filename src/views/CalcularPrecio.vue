<template>
  <!-- Basado en Calcular-Precio.html original -->
  <div class="calcular-precio-container">
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
          <span style="font-size: 1.875rem;">Calcular Precio</span>
        </p>
        
        <!-- Navegación simplificada -->
        <nav class="u-align-left u-menu u-menu-1">
          <div class="drawer-nav">
            <router-link to="/dashboard">Inicio</router-link>
            <router-link to="/productos">Lista de repuestos</router-link>
            <router-link to="/productos/nuevo">Agregar repuesto</router-link>
            <router-link to="/ventas/nueva">Registrar venta</router-link>
            <router-link to="/ventas">Lista de ventas</router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Sección principal -->
    <section class="u-clearfix u-section-1" id="block-2">
      <div class="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-sheet-1">
        
        <!-- Logos decorativos -->
        <img class="u-image u-image-contain u-image-default u-image-1" src="/images/StockAR1-Photoroom.png" alt="">
        <img class="u-image u-image-contain u-image-default u-image-2" src="/images/StockAR1-Photoroom.png" alt="">
        
        <!-- Formulario de cálculo -->
        <div class="u-form u-form-1">
          <form @submit.prevent="calcularPrecio" class="u-clearfix u-form-spacing-10 u-form-vertical u-inner-form">
            
            <!-- Seleccionar moneda de COMPRA -->
            <div class="u-form-group u-form-select u-form-group-1">
              <label for="monedaCompra" class="u-label">Seleccione moneda de COMPRA</label>
              <div class="u-form-select-wrapper">
                <select 
                  id="monedaCompra" 
                  v-model="formulario.monedaCompra" 
                  class="u-input u-input-rectangle"
                  @change="actualizarCotizaciones"
                >
                  <option value="USD">Dólar</option>
                  <option value="ARS">Peso Argentino</option>
                </select>
              </div>
            </div>

            <!-- Precio de compra -->
            <div class="u-form-group u-form-group-3">
              <label for="precioCompra" class="u-label">
                Precio de compra ({{ formulario.monedaCompra }})
              </label>
              <input 
                type="number" 
                step="0.01"
                id="precioCompra" 
                v-model="formulario.precioCompra"
                class="u-input u-input-rectangle"
                placeholder="Ingrese el precio de compra"
                required
              />
            </div>

            <!-- Seleccionar moneda de VENTA -->
            <div class="u-form-group u-form-select u-form-group-2">
              <label for="monedaVenta" class="u-label">Seleccione moneda de VENTA</label>
              <div class="u-form-select-wrapper">
                <select 
                  id="monedaVenta" 
                  v-model="formulario.monedaVenta" 
                  class="u-input u-input-rectangle"
                  @change="actualizarCotizaciones"
                >
                  <option value="USD">Dólar</option>
                  <option value="ARS">Peso Argentino</option>
                </select>
              </div>
            </div>

            <!-- Porcentaje de ganancia -->
            <div class="u-form-group u-form-group-3">
              <label for="porcentajeGanancia" class="u-label">Ingrese porcentaje de GANANCIA</label>
              <input 
                type="number" 
                step="0.01"
                id="porcentajeGanancia" 
                v-model="formulario.porcentajeGanancia"
                class="u-input u-input-rectangle"
                placeholder="Ej: 25 (para 25%)"
                required
              />
            </div>

            <!-- Cotización actual (informativa) -->
            <div v-if="cotizacionActual > 0" class="cotizacion-info">
              <p><strong>Cotización USD:</strong> ${{ cotizacionActual.toFixed(2) }}</p>
            </div>

            <!-- Botón calcular -->
            <div class="u-align-center u-form-group u-form-submit">
              <button 
                type="submit"
                class="u-border-2 u-border-black u-btn u-btn-submit u-button-style u-custom-color-1 u-hover-palette-2-base u-btn-1"
                :disabled="loading"
              >
                {{ loading ? 'Calculando...' : 'Calcular' }}
              </button>
            </div>

            <!-- Resultado del cálculo -->
            <div v-if="resultado" class="resultado-calculo">
              <h3>Resultado del Cálculo:</h3>
              <div class="resultado-detalle">
                <p><strong>Precio de compra:</strong> {{ formatearMoneda(formulario.precioCompra, formulario.monedaCompra) }}</p>
                <p><strong>Ganancia ({{ formulario.porcentajeGanancia }}%):</strong> {{ formatearMoneda(resultado.ganancia, formulario.monedaVenta) }}</p>
                <p class="precio-final"><strong>Precio de venta:</strong> {{ formatearMoneda(resultado.precioVenta, formulario.monedaVenta) }}</p>
                
                <div v-if="formulario.monedaCompra !== formulario.monedaVenta" class="conversion-info">
                  <small>
                    <em>Conversión aplicada: 1 USD = ${{ cotizacionActual.toFixed(2) }} ARS</em>
                  </small>
                </div>
              </div>
            </div>

            <!-- Mensajes de error -->
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="u-black u-clearfix u-footer" id="footer">
      <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
        <router-link to="/dashboard" class="u-image u-logo u-image-1">
          <img src="/images/logo-Photoroom.png" class="u-logo-image u-logo-image-1" alt="StockAR">
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService, cotizacionService } from '@/services';
import type { Usuario } from '@/services';
const router = useRouter();

// Interfaces
interface FormularioCalculo {
  monedaCompra: 'USD' | 'ARS';
  monedaVenta: 'USD' | 'ARS';
  precioCompra: number;
  porcentajeGanancia: number;
}

interface ResultadoCalculo {
  precioVenta: number;
  ganancia: number;
  cotizacionUsada?: number;
}

// Estado reactivo
const currentUser = ref<Usuario | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const cotizacionActual = ref(0);

const formulario = ref<FormularioCalculo>({
  monedaCompra: 'USD',
  monedaVenta: 'ARS',
  precioCompra: 0,
  porcentajeGanancia: 0
});

const resultado = ref<ResultadoCalculo | null>(null);

// Computed
const necesitaConversion = computed(() => {
  return formulario.value.monedaCompra !== formulario.value.monedaVenta;
});

// Métodos
const loadCotizacion = async () => {
  try {
    cotizacionActual.value = await cotizacionService.getUsdOficial();
  } catch (error) {
    console.error('Error cargando cotización:', error);
    cotizacionActual.value = 1000; // Valor por defecto
  }
};

const actualizarCotizaciones = () => {
  if (necesitaConversion.value) {
    loadCotizacion();
  }
};

const calcularPrecio = async () => {
  if (formulario.value.precioCompra <= 0 || formulario.value.porcentajeGanancia <= 0) {
    resultado.value = null;
    errorMessage.value = 'Por favor ingrese valores válidos';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  
  try {
    let precioBase = formulario.value.precioCompra;
    
    // Si necesita conversión de moneda
    if (necesitaConversion.value) {
      if (cotizacionActual.value <= 0) {
        await loadCotizacion();
      }
      
      if (formulario.value.monedaCompra === 'USD' && formulario.value.monedaVenta === 'ARS') {
        // USD a ARS
        precioBase = precioBase * cotizacionActual.value;
      } else if (formulario.value.monedaCompra === 'ARS' && formulario.value.monedaVenta === 'USD') {
        // ARS a USD
        precioBase = precioBase / cotizacionActual.value;
      }
    }
    
    // Calcular ganancia y precio final
    const ganancia = (precioBase * formulario.value.porcentajeGanancia) / 100;
    const precioVenta = precioBase + ganancia;
    
    resultado.value = {
      precioVenta: precioVenta,
      ganancia: ganancia,
      cotizacionUsada: necesitaConversion.value ? cotizacionActual.value : undefined
    };
    
    // Limpiar formulario para el siguiente cálculo
    formulario.value.precioCompra = 0;
    formulario.value.porcentajeGanancia = 0;

  } catch (error) {
    errorMessage.value = 'Error al calcular el precio';
    console.error('Error en cálculo:', error);
  } finally {
    loading.value = false;
  }
};

const formatearMoneda = (amount: number, moneda: string) => {
  if (moneda === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  } else {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  }
};

const handleLogout = async () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      authService.clearStorage();
      router.push('/login');
    }
  }
};

// Lifecycle
onMounted(() => {
  currentUser.value = authService.getCurrentUser();
});

</script>
 
<style scoped>
/* Importar CSS originales */
@import '/css/nicepage.css';
@import '/css/Calcular-Precio.css';

/* Estilos adicionales para el resultado */
.cotizacion-info {
  background: #f0f9ff;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
  border: 1px solid #0ea5e9;
}

.resultado-calculo {
  background: #f0fdf4;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  border: 2px solid #22c55e;
}

.resultado-calculo h3 {
  color: #166534;
  margin: 0 0 15px 0;
  text-align: center;
}

.resultado-detalle p {
  margin: 8px 0;
  font-size: 1.1rem;
}

.precio-final {
  font-size: 1.3rem !important;
  color: #166534;
  background: #dcfce7;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #22c55e;
}

.conversion-info {
  margin-top: 15px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 5px;
  text-align: center;
}

.error-message {
  color: #ff4757;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffe0e0;
  border-radius: 5px;
  border: 1px solid #ffcdd2;
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
  
  .resultado-calculo {
    padding: 15px;
  }
  
  .resultado-detalle p {
    font-size: 1rem;
  }
  
  .precio-final {
    font-size: 1.1rem !important;
  }
}
</style>