<template>
  <div v-if="loading" class="loading-container">Cargando repuesto...</div>
  <div v-else-if="error" class="error-container">{{ error }}</div>
  <section v-else-if="repuesto" class="u-clearfix u-section-1" id="sec-modificar-repuesto">
    <div class="u-clearfix u-sheet u-sheet-1">
      <h1 class="u-text u-text-default u-text-1">
        <span style="font-size: 1.875rem;">Modificar Repuesto</span>
      </h1>
      <div class="layout-wrapper">
        <!-- Columna de la Imagen -->
        <div class="columna-imagen">
          <div class="preview" :style="{ 'background-image': `url(${imageUrl})` }">
            <span v-if="!imageUrl">Vista previa</span>
          </div>
          <label for="imagen" class="boton-subir">Cambiar imagen</label>
          <input type="file" id="imagen" accept="image/*" @change="handleImageUpload">
        </div>

        <!-- Columna del Formulario -->
        <div class="columna-formulario">
          <form @submit.prevent="modificarRepuesto" class="u-form u-form-1">
            <div class="u-form-group u-form-name">
              <label for="codigo" class="u-label">Código</label>
              <input type="number" placeholder="Introduzca el código del producto" id="codigo" v-model.number="repuesto.codigo" class="u-border-black u-grey-15 u-input u-input-rectangle" required>
            </div>
            <div class="u-form-group">
              <label for="nombre" class="u-label">Nombre</label>
              <input type="text" placeholder="Introduzca el nombre del producto" id="nombre" v-model="repuesto.nombre" class="u-border-black u-grey-15 u-input u-input-rectangle" required>
            </div>
            <div class="u-form-group">
              <label for="tipo" class="u-label">Tipo Producto</label>
              <div class="u-form-select-wrapper">
                <select id="tipo" v-model.number="repuesto.idTipoProducto" class="u-border-black u-grey-15 u-input u-input-rectangle" required>
                  <option value="" disabled>Seleccione un tipo</option>
                  <option v-for="tipo in tiposProducto" :key="tipo.idTipoProducto" :value="tipo.idTipoProducto">
                    {{ tipo.nombre }}
                  </option>
                </select>
              </div>
            </div>
            <div class="u-form-group">
              <label for="marca" class="u-label">Marca</label>
              <input type="text" placeholder="Introduzca marca del producto" id="marca" v-model="repuesto.marca" class="u-border-black u-grey-15 u-input u-input-rectangle">
            </div>
            <div class="u-form-group u-form-message">
              <label for="descripcion" class="u-label">Descripción</label>
              <textarea placeholder="Introduzca una breve descripción" rows="4" cols="50" id="descripcion" v-model="repuesto.descripcion" class="u-border-black u-grey-15 u-input u-input-rectangle"></textarea>
            </div>
            <div class="form-row">
              <div class="u-form-group u-form-partition-factor-3">
                <label for="precio-neto" class="u-label">Precio neto</label>
                <input type="number" placeholder="Precio neto" id="precio-neto" v-model.number="repuesto.precioNeto" class="u-border-black u-grey-15 u-input u-input-rectangle">
              </div>
              <div class="u-form-group u-form-partition-factor-3 u-form-select">
                <label for="moneda" class="u-label">Moneda</label>
                <div class="u-form-select-wrapper">
                  <select id="moneda" v-model.number="repuesto.idMoneda" class="u-border-black u-grey-15 u-input u-input-rectangle" required>
                    <option value="" disabled>Seleccione moneda</option>
                    <option v-for="moneda in monedas" :key="moneda.idMoneda" :value="moneda.idMoneda">
                      {{ moneda.nombre }}
                    </option>
                  </select>
                  <svg class="u-caret u-caret-svg" viewBox="0 0 16 16">
                    <polygon points="8,12 2,4 14,4"></polygon>
                  </svg>
                </div>
              </div>
              <div class="u-form-group u-form-partition-factor-3">
                <label for="cantidad" class="u-label">Cantidad</label>
                <input type="number" placeholder="Cantidad" id="cantidad" v-model.number="repuesto.stock" class="u-border-black u-grey-15 u-input u-input-rectangle">
              </div>
            </div>
            <div class="u-form-group">
              <label for="proveedor" class="u-label">Proveedor</label>
              <input type="text" placeholder="Introduzca nombre del proveedor" id="proveedor" v-model="repuesto.proveedor" class="u-border-black u-grey-15 u-input u-input-rectangle">
            </div>
            <div class="u-align-right u-form-group u-form-submit">
              <button type="submit" class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-btn-1" :disabled="isSubmitting">
                {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productoService, type Producto, type TipoProducto } from '@/services';
import type { Moneda } from '@/types/producto.types';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');
const isSubmitting = ref(false);
const imageUrl = ref<string | null>(null);
const tiposProducto = ref<TipoProducto[]>([]);
const monedas = ref<Moneda[]>([]);

interface RepuestoForm {
  idProducto: number | null;
  codigo: string;
  nombre: string;
  idTipoProducto: number | string;
  marca: string;
  descripcion: string;
  precioNeto: number | null;
  idMoneda: number | string;
  stock: number | null;
  proveedor: string;
  imagen: File | null;
}

const repuesto = reactive<RepuestoForm>({
  idProducto: null,
  codigo: '',
  nombre: '',
  idTipoProducto: '',
  marca: '',
  descripcion: '',
  precioNeto: null,
  idMoneda: '',
  stock: null,
  proveedor: '',
  imagen: null as File | null,
});

const loadProduct = async () => {
  const productId = Number(route.params.id);

  try {
    const [data, tiposData] = await Promise.all([
      productoService.getById(productId),
      productoService.getTiposProducto()
    ]);

    tiposProducto.value = tiposData;
    // Si tienes una lista fija de monedas, asígnala aquí manualmente
    monedas.value = [
      { idMoneda: 1, nombre: 'Peso Argentino', cotizacion: 1, tipoMoneda: { idTipoMoneda: 1, nombre: 'ARS' } },
      { idMoneda: 2, nombre: 'Dólar', cotizacion: 1000, tipoMoneda: { idTipoMoneda: 2, nombre: 'USD' } }
    ];

    repuesto.idProducto = data.idProducto;
    repuesto.codigo = data.codigo.toString();
    repuesto.nombre = data.nombre;
    repuesto.descripcion = data.descripcion;
    repuesto.marca = data.marca;
    repuesto.precioNeto = data.precioNeto ?? null;
    repuesto.stock = data.stock ?? null;
    repuesto.idTipoProducto = data.tipoProducto?.idTipoProducto || '';
    repuesto.idMoneda = data.moneda?.idMoneda || '';
    imageUrl.value = (data as any).imagenUrl || null; // Solo si existe
  } catch (err) {
    error.value = 'No se pudo cargar el producto para modificar.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    repuesto.imagen = file;
    imageUrl.value = URL.createObjectURL(file);
  }
};

const modificarRepuesto = async () => {
  isSubmitting.value = true;
  if (!repuesto.idProducto) {
    alert('Error: ID de producto no encontrado.');
    isSubmitting.value = false;
    return;
  }
  try {
    const updatedData = {
      ...repuesto,
      codigo: Number(repuesto.codigo),
      idTipoProducto: Number(repuesto.idTipoProducto),
      idMoneda: Number(repuesto.idMoneda),
      precioNeto: repuesto.precioNeto ?? 0,
      stock: repuesto.stock ?? 0,
    };
    await productoService.update(repuesto.idProducto, updatedData);
    alert('Repuesto modificado exitosamente.');
    router.push(`/productos/${repuesto.idProducto}`);
  } catch (err) {
    alert('Error al modificar el repuesto.');
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadProduct);
</script>

<style scoped>
/* Reutilizamos los estilos de ProductForm para consistencia */
.layout-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 40px;
  padding: 20px;
}
.columna-formulario {
  flex: 1 1 400px;
  min-width: 350px;
}
.columna-imagen {
  width: 300px;
  margin: 20px auto;
  text-align: center;
}
.preview {
  width: 100%;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  margin-bottom: 15px;
  background-color: #f0f0f0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
input[type="file"] {
  display: none;
}
.boton-subir {
  background-color: #bd0000;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
.form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.form-row .u-form-group {
  flex: 1;
  min-width: 120px;
}
.loading-container, .error-container {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
}
</style>