<template>
  <section class="u-clearfix u-section-1" id="sec-agregar-repuesto">
    <div class="u-clearfix u-sheet u-sheet-1">
      <h1 class="u-text u-text-default u-text-1">
        <span style="font-size: 1.875rem;">Agregar Repuesto</span>
      </h1>
      <div class="layout-wrapper">
        <!-- Columna de la Imagen -->
        <div class="columna-imagen">
          <div class="preview" :style="{ 'background-image': `url(${imageUrl})` }">
            <span v-if="!imageUrl">Vista previa</span>
          </div>
          <label for="imagen" class="boton-subir">Seleccionar imagen</label>
          <input type="file" id="imagen" accept="image/*" @change="handleImageUpload">
        </div>

        <!-- Columna del Formulario -->
        <div class="columna-formulario">
          <form @submit.prevent="agregarRepuesto" class="u-form u-form-1">
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
              <input type="text" placeholder="Introduzca el tipo de producto" id="tipo" v-model="repuesto.tipo" class="u-border-black u-grey-15 u-input u-input-rectangle">
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
                  <select id="moneda" v-model="repuesto.moneda" class="u-border-black u-grey-15 u-input u-input-rectangle">
                    <option value="Dolar">Dolar</option>
                    <option value="Peso Arg">Peso Arg</option>
                  </select>
                  <svg class="u-caret u-caret-svg" viewBox="0 0 16 16">
                    <polygon points="8,12 2,4 14,4"></polygon>
                  </svg>
                </div>
              </div>
              <div class="u-form-group u-form-partition-factor-3">
                <label for="cantidad" class="u-label">Cantidad</label>
                <input type="number" placeholder="Cantidad" id="cantidad" v-model.number="repuesto.cantidad" class="u-border-black u-grey-15 u-input u-input-rectangle">
              </div>
            </div>
            <div class="u-form-group">
              <label for="proveedor" class="u-label">Proveedor</label>
              <input type="text" placeholder="Introduzca nombre del proveedor" id="proveedor" v-model="repuesto.proveedor" class="u-border-black u-grey-15 u-input u-input-rectangle">
            </div>
            <div class="u-align-right u-form-group u-form-submit">
              <button type="submit" class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-btn-1" :disabled="isSubmitting">
                {{ isSubmitting ? 'Agregando...' : 'Agregar Repuesto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 2. Usamos <script setup> para Vue 3. 
// No necesitamos importar defineComponent ni usar export default.
import { reactive, ref } from 'vue';
const imageUrl = ref<string | null>(null);
const isSubmitting = ref(false);

const repuesto = reactive({
  codigo: null,
  nombre: '',
  tipo: '',
  marca: '',
  descripcion: '',
  precioNeto: null,
  moneda: 'Dolar',
  cantidad: null,
  proveedor: '',
  imagen: null as File | null,
});

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    repuesto.imagen = file;
    // Crear una URL para la previsualización
    imageUrl.value = URL.createObjectURL(file);
  }
}

async function agregarRepuesto() {
  isSubmitting.value = true;
  try {
    // Aquí iría la lógica para enviar los datos a tu backend
    console.log('Datos del repuesto a agregar:', repuesto);
    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Repuesto agregado (revisa la consola para ver los datos)');
    // Aquí podrías redirigir o limpiar el formulario
  } catch (error) {
    console.error("Error al agregar repuesto:", error);
    alert('Hubo un error al agregar el repuesto.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se ajusten en pantallas pequeñas */
  align-items: flex-start;
  gap: 40px;
  padding: 20px;
}
.u-section-1 .u-form-1 {
  flex: 1 1 400px;
  min-width: 350px;
}
.columna-imagen {
  width: 300px;
  margin: 20px auto;
  text-align: center;
  font-family: sans-serif;
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
  font-size: 14px;
}
input[type="file"] {
  display: none;
}
.boton-subir {
  background-color: #bd0000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  display: inline-block;
  text-align: center;
}
.boton-subir:hover {
  background-color: #a70000;
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
.u-section-1 .u-btn-1 {
  background-image: none;
  border-style: solid;
  background-color: #bd0000 !important;
  color: white !important;
}
</style>