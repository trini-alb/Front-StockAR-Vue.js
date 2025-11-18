<template>
  <div class="max-w-4xl mx-auto p-4 space-y-4">
    <!-- Encabezado con usuario -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Calcular precio</h1>
        <p class="text-sm opacity-70">
          Calculá el precio de venta según moneda de compra, moneda de venta y porcentaje de ganancia.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span v-if="currentUser" class="text-sm">
          Hola, <strong>{{ currentUser.empleado?.nombre }}</strong>
        </span>
        <button class="btn btn-outline btn-sm" @click="handleLogout">
          Cerrar sesión
        </button>
      </div>
    </div>

    <!-- Tarjeta principal -->
    <div class="card bg-base-100 shadow">
      <div class="card-body space-y-4">
        <!-- Formulario -->
        <form class="grid gap-4 md:grid-cols-2" @submit.prevent="calcularPrecio">
          <!-- Moneda de compra -->
          <label class="form-control">
            <div class="label">
              <span class="label-text">Moneda de COMPRA</span>
            </div>
            <select
              id="monedaCompra"
              v-model="formulario.monedaCompra"
              class="select select-bordered"
              @change="actualizarCotizaciones"
            >
              <option value="USD">Dólar (USD)</option>
              <option value="ARS">Peso Argentino (ARS)</option>
            </select>
          </label>

          <!-- Moneda de venta -->
          <label class="form-control">
            <div class="label">
              <span class="label-text">Moneda de VENTA</span>
            </div>
            <select
              id="monedaVenta"
              v-model="formulario.monedaVenta"
              class="select select-bordered"
              @change="actualizarCotizaciones"
            >
              <option value="USD">Dólar (USD)</option>
              <option value="ARS">Peso Argentino (ARS)</option>
            </select>
          </label>

          <!-- Precio de compra -->
          <label class="form-control">
            <div class="label">
              <span class="label-text">
                Precio de compra ({{ formulario.monedaCompra }})
              </span>
            </div>
            <input
              id="precioCompra"
              type="number"
              step="0.01"
              v-model.number="formulario.precioCompra"
              class="input input-bordered"
              placeholder="Ej: 120.50"
              required
            />
          </label>

          <!-- Porcentaje de ganancia -->
          <label class="form-control">
            <div class="label">
              <span class="label-text">Porcentaje de GANANCIA</span>
            </div>
            <input
              id="porcentajeGanancia"
              type="number"
              step="0.01"
              v-model.number="formulario.porcentajeGanancia"
              class="input input-bordered"
              placeholder="Ej: 25 (para 25%)"
              required
            />
          </label>

          <!-- Cotización -->
          <div class="md:col-span-2" v-if="cotizacionActual > 0 && necesitaConversion">
            <div class="alert alert-info">
              <span>
                Cotización usada:
                <strong>1 USD = ${{ cotizacionActual.toFixed(2) }} ARS</strong>
              </span>
            </div>
          </div>

          <!-- Botón Calcular -->
          <div class="md:col-span-2 flex justify-end">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ loading ? 'Calculando...' : 'Calcular precio' }}
            </button>
          </div>
        </form>

        <!-- Resultado -->
        <div v-if="resultado" class="alert alert-success flex-col items-start gap-2 mt-2">
          <h3 class="font-semibold text-lg">Resultado del cálculo</h3>
          <p>
            <strong>Precio de compra:</strong>
            {{ formatearMoneda(formulario.precioCompra ?? 0, formulario.monedaCompra) }}
          </p>
          <p>
            <strong>Ganancia ({{ formulario.porcentajeGanancia }}%):</strong>
            {{ formatearMoneda(resultado.ganancia, formulario.monedaVenta) }}
          </p>
          <p class="text-lg font-semibold">
            <strong>Precio de venta:</strong>
            {{ formatearMoneda(resultado.precioVenta, formulario.monedaVenta) }}
          </p>

          <p v-if="resultado.cotizacionUsada" class="text-xs opacity-70">
            Conversión aplicada con cotización:
            {{ resultado.cotizacionUsada.toFixed(2) }}
          </p>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-error mt-2">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';
import { cotizacionService } from '../services/cotizacion.service';

const router = useRouter();

// ---- Tipos internos ----
type Moneda = 'USD' | 'ARS';

interface FormularioCalculo {
  monedaCompra: Moneda;
  monedaVenta: Moneda;
  precioCompra: number | null;
  porcentajeGanancia: number | null;
}

interface ResultadoCalculo {
  precioVenta: number;
  ganancia: number;
  cotizacionUsada?: number;
}

// ---- Estado ----
const currentUser = ref<any | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const cotizacionActual = ref(0);

const formulario = ref<FormularioCalculo>({
  monedaCompra: 'USD',
  monedaVenta: 'ARS',
  precioCompra: null,
  porcentajeGanancia: null
});

const resultado = ref<ResultadoCalculo | null>(null);

// ¿Hay que convertir de una moneda a otra?
const necesitaConversion = computed(
  () => formulario.value.monedaCompra !== formulario.value.monedaVenta
);

// ---- Lógica de cotización ----
async function loadCotizacion() {
  try {
    cotizacionActual.value = await cotizacionService.getUsdOficial();
  } catch (error) {
    console.error('Error cargando cotización:', error);
    // Valor de backup por si la API falla
    cotizacionActual.value = 1000;
  }
}

function actualizarCotizaciones() {
  if (necesitaConversion.value) {
    void loadCotizacion();
  }
}

// ---- Cálculo de precio ----
async function calcularPrecio() {
  errorMessage.value = '';
  resultado.value = null;

  const precio = formulario.value.precioCompra ?? 0;
  const porcentaje = formulario.value.porcentajeGanancia ?? 0;

  if (precio <= 0 || porcentaje <= 0) {
    errorMessage.value = 'Por favor ingrese valores válidos.';
    return;
  }

  loading.value = true;

  try {
    let precioBase = precio;

    if (necesitaConversion.value) {
      if (cotizacionActual.value <= 0) {
        await loadCotizacion();
      }

      if (formulario.value.monedaCompra === 'USD' && formulario.value.monedaVenta === 'ARS') {
        precioBase = precioBase * cotizacionActual.value;
      } else if (formulario.value.monedaCompra === 'ARS' && formulario.value.monedaVenta === 'USD') {
        precioBase = precioBase / cotizacionActual.value;
      }
    }

    const ganancia = (precioBase * porcentaje) / 100;
    const precioVenta = precioBase + ganancia;

    resultado.value = {
      precioVenta,
      ganancia,
      cotizacionUsada: necesitaConversion.value ? cotizacionActual.value : undefined
    };
  } catch (error) {
    console.error('Error al calcular el precio:', error);
    errorMessage.value = 'Ocurrió un error al calcular el precio.';
  } finally {
    loading.value = false;
  }
}

// ---- Helpers ----
function formatearMoneda(monto: number, moneda: Moneda) {
  const amount = Number.isFinite(monto) ? monto : 0;

  if (moneda === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
}

async function handleLogout() {
  if (!confirm('¿Está seguro que desea cerrar sesión?')) return;

  try {
    await authService.logout();
  } catch (error) {
    console.error('Error en logout:', error);
    authService.clearStorage();
  } finally {
    router.push('/login');
  }
}

// ---- Lifecycle ----
onMounted(() => {
  currentUser.value = authService.getCurrentUser();
});
</script>

<style scoped>
/* Todo lo visual lo maneja DaisyUI/Tailwind; acá solo irían ajustes finos si los necesitás */
</style>

