<template>
    <div>
        <h1>Vista: Agregar Repuesto</h1>
    </div>
    <body data-path-to-root="./" data-include-products="false" class="u-body u-clearfix u-xl-mode" data-lang="es"><header class="u-black u-clearfix u-header u-header" id="header"><div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
        <div class="custom-expanded u-clearfix u-custom-html u-custom-html-1">
            <style></style>
            <div class="menu-usuario">
                <input type="checkbox" id="toggle-menu" class="toggle-menu">
                <label for="toggle-menu" class="icono-usuario">
                    <img src="images/usuario.png">
                </label>
                <div class="menu-desplegable">
                    <a href="Login.html">Cerrar sesión</a> &nbsp;&nbsp;
                </div>
            </div>
  <section class="u-clearfix u-section-1" id="sec-agregar-repuesto">
    <div class="u-clearfix u-sheet u-sheet-1">
      <h1 class="u-text u-text-default u-text-1">Agregar Repuesto</h1>
      <div class="layout-wrapper">
        <!-- Columna de la Imagen -->
        <div class="columna-imagen">
          <div class="preview" :style="{ 'background-image': `url(${imageUrl})` }">
            <span v-if="!imageUrl">Vista previa</span>
          </div>
          <label for="imagen" class="boton-subir">Seleccionar imagen</label>
          <input type="file" id="imagen" accept="image/*" @change="handleImageUpload">
        </div>
        <p class="u-text u-text-default u-text-1"><span style="font-size: 1.875rem;">Agregar Repuesto</span>
        </p>
        <nav class="u-align-left u-font-size-14 u-menu u-menu-hamburger u-nav-spacing-25 u-offcanvas u-menu-1" data-responsive-from="XL" role="navigation">
            <div class="menu-collapse">
                <a id="drawerToggle" class="u-button-style u-hamburger-link u-nav-link u-hamburger-link-1" href="#" tabindex="-1" aria-label="Open menu" aria-controls="f3cb">
                    <svg class="u-svg-link" preserveAspectRatio="xMidYMin slice" viewBox="0 0 302 302" style=""><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-e5e3"></use></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="svg-e5e3" x="0px" y="0px" viewBox="0 0 302 302" style="enable-background:new 0 0 302 302;" xml:space="preserve" class="u-svg-content"><g><rect y="36" width="302" height="30"></rect><rect y="236" width="302" height="30"></rect><rect y="136" width="302" height="30"></rect>
                    </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                </a>

        <!-- Columna del Formulario -->
        <div class="columna-formulario">
          <form @submit.prevent="agregarRepuesto" class="u-form u-form-1">
            <div class="u-form-group u-form-name">
              <label for="codigo" class="u-label">Código</label>
              <input type="number" placeholder="Introduzca el código del producto" id="codigo" v-model="repuesto.codigo" class="u-border-black u-grey-15 u-input u-input-rectangle" required>
            </div>
            <div class="u-custom-menu u-nav-container">
                <ul role="menubar" class="u-nav u-unstyled u-nav-1"><li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#" aria-current="page" aria-haspopup="true" style="padding: 10px 114px;" aria-expanded="false">Login</a>
                </li><li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#" style="padding: 10px 114px;">Contacto</a>
                </li><li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" style="padding: 10px 113px 10px 114px;">Productos</a>
                </li></ul>
            <div class="u-form-group">
              <label for="nombre" class="u-label">Nombre</label>
              <input type="text" placeholder="Introduzca el nombre del producto" id="nombre" v-model="repuesto.nombre" class="u-border-black u-grey-15 u-input u-input-rectangle" required>
            </div>
            <div class="u-custom-menu u-nav-container-collapse" id="f3cb" role="region" aria-label="Menu panel">
                <div class="u-align-center u-black u-container-align-center u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                    <div class="u-inner-container-layout u-sidenav-overflow">
                        <div class="u-menu-close" tabindex="-1" aria-label="Close menu"></div>
                        <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-2"><li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link" href="#" aria-current="page" aria-haspopup="true">Login</a>
                        </li><li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link" href="#">Contacto</a>
                        </li><li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link">Productos</a>
                        </li></ul>
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
              <textarea placeholder="Introduzca una breve descripción" rows="4" cols="50" id="descripcion" v-model="repuesto.descripcion" class="u-border-black u-grey-15 u-input u-input-rectangle" required></textarea>
            </div>
            <div class="form-row">
              <div class="u-form-group u-form-partition-factor-3">
                <label for="precio-neto" class="u-label">Precio neto</label>
                <input type="number" placeholder="Precio neto" id="precio-neto" v-model="repuesto.precioNeto" class="u-border-black u-grey-15 u-input u-input-rectangle">
              </div>
              <div class="u-form-group u-form-partition-factor-3 u-form-select">
                <label for="moneda" class="u-label">Moneda</label>
                <div class="u-form-select-wrapper">
                  <select id="moneda" v-model="repuesto.moneda" class="u-border-black u-grey-15 u-input u-input-rectangle">
                    <option value="Dolar">Dolar</option>
                    <option value="Peso Arg">Peso Arg</option>
                  </select>
                  <svg class="u-caret u-caret-svg" viewBox="0 0 16 16"><polygon points="8,12 2,4 14,4"></polygon></svg>
                </div>
                <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
              </div>
              <div class="u-form-group u-form-partition-factor-3">
                <label for="cantidad" class="u-label">Cantidad</label>
                <input type="number" placeholder="Cantidad" id="cantidad" v-model="repuesto.cantidad" class="u-border-black u-grey-15 u-input u-input-rectangle">
              </div>
            </div>
            <style class="menu-style">@media (max-width: 939px) {
                [data-responsive-from="MD"] .u-nav-container {
                    display: none;
                }
                [data-responsive-from="MD"] .menu-collapse {
                    display: block;
                }
                }</style>
                </header>
            </nav>
            <!-- Backdrop que oscurece el fondo -->
             <div id="drawerBackdrop" class="drawer-backdrop" hidden></div>
             <!-- Drawer lateral izquierdo -->
              <aside id="sideDrawer" class="drawer" aria-hidden="true" tabindex="-1">
                <div class="drawer-head">
                    <strong>Menú</strong>
                    <button type="button" class="drawer-close" aria-label="Cerrar">×</button>
                </div>
                <nav class="drawer-nav">
                    <a href="Menu-Principal.html">Inicio</a>
                    <a href="Lista-de-Respuestos.html">Lista de repuestos</a>
                    <a href="Agregar-Repuesto.html">Agregar repuesto</a>
                    <a href="Modificar-Repuesto.html">Modificar repuesto</a>
                    <a href="Registrar-Venta.html">Registrar venta</a>
                    <a href="Calcular-Precio.html">Calcular precio</a>
                    <a href="Lista-ventas.html">Lista de ventas</a>
                    <a href="Login.html">Cerrar sesión</a>
                </nav>
            </aside>
            <div class="u-form-group">
              <label for="proveedor" class="u-label">Proveedor</label>
              <input type="text" placeholder="Introduzca nombre del proveedor" id="proveedor" v-model="repuesto.proveedor" class="u-border-black u-grey-15 u-input u-input-rectangle">
            </div>
            <div class="u-align-right u-form-group u-form-submit">
              <button type="submit" class="u-border-2 u-border-black u-btn u-button-style u-custom-color-1 u-btn-1">Agregar Repuesto</button>
            </div>
          </form>
        </div>
        <section class="u-clearfix u-section-1" id="block-4">
            <div class="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-sheet-1">
                <div class="u-clearfix u-custom-html u-custom-html-1">
                    <style></style>
                    <meta charset="UTF-8">
                    <title></title>
                    <div class="contenedor">
                        <div id="preview" class="preview">Vista previa</div>
                        <label for="imagen" class="boton-subir">Seleccionar imagen</label>
                        <input type="file" id="imagen" accept="image/*">
                    </div>
                </div>
                <div class="u-form u-form-1">
                    <form action="https://forms.nicepagesrv.com/v2/form/process" class="u-clearfix u-form-spacing-10 u-form-vertical u-inner-form" source="email" name="form" style="padding: 10px;">
                        <div class="u-form-group u-form-name">
                            <label for="number-78d0" class="u-label">Código</label>
                            <input type="number" placeholder="Introduzca el código del producto" id="number-78d0" name="number" class="u-border-black u-grey-15 u-input u-input-rectangle" required="">
                        </div>
                        <div class="u-form-email u-form-group">
                            <label for="text-9ac9" class="u-label">Nombre</label>
                            <input type="text" placeholder="Introduzca el nombre del producto" id="text" name="text" class="u-border-black u-grey-15 u-input u-input-rectangle" required="">
                        </div>
                        <div class="u-form-group u-form-group-3">
                            <label for="text-9ac9" class="u-label">Tipo Producto</label>
                            <input type="text" placeholder="Introduzca el tipo de producto" id="text-9ac9" name="text-3" class="u-border-black u-grey-15 u-input u-input-rectangle">
                        </div>
                        <div class="u-form-group u-form-group-4">
                            <label for="text-916c" class="u-label">Marca</label>
                            <input type="text" placeholder="Introduzca marca del producto" id="text-916c" name="text-4" class="u-border-black u-grey-15 u-input u-input-rectangle">
                        </div>
                        <div class="u-form-group u-form-message">
                            <label for="message-78d0" class="u-label">Descripción </label>
                            <textarea placeholder="Introduzca una breve descripción" rows="4" cols="50" id="message-78d0" name="message" class="u-border-black u-grey-15 u-input u-input-rectangle" required=""></textarea>
                        </div>
                        <div class="u-form-group u-form-partition-factor-3 u-form-group-6">
                            <label for="number-d29a" class="u-label">Precio neto</label>
                            <input type="number" placeholder="Introduzca precio neto" id="number-78d0" name="number-78d0" class="u-border-black u-grey-15 u-input u-input-rectangle">
                        </div>
                        <div class="u-form-group u-form-partition-factor-3 u-form-select u-form-group-7">
                            <label for="select-d1a6" class="u-label">Moneda </label>
                            <div class="u-form-select-wrapper">
                                <select id="select-d1a6" name="Seleccionar moneda" class="u-border-black u-grey-15 u-input u-input-rectangle">
                                    <option value="Dolar" data-calc="">Dolar</option>
                                    <option value="Peso Arg" data-calc="">Peso Arg</option>
                                </select>
                                <svg class="u-caret u-caret-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" style="fill:currentColor;" xml:space="preserve"><polygon class="st0" points="8,12 2,4 14,4 "></polygon></svg>
                            </div>
                        </div>
                        <div class="u-form-group u-form-partition-factor-3 u-form-group-8">
                            <label for="number-d29a" class="u-label">Cantidad</label>
                            <input type="number" placeholder="Introduzca la cantidad" id="text-1240" name="text" class="u-border-black u-grey-15 u-input u-input-rectangle">
                        </div>
                        <div class="u-form-group u-form-group-9">
                            <label for="text-f961" class="u-label">Proveedor</label>
                            <input type="text" placeholder="Introduzca nombre del proveedor" id="text-f961" name="text-2" class="u-border-black u-grey-15 u-input u-input-rectangle">
                        </div>
                        <div class="u-align-right u-form-group u-form-submit">
                            <a href="#" class="u-border-2 u-border-black u-btn u-btn-submit u-button-style u-custom-color-1 u-btn-1">Agregar Repuesto</a>
                            <input type="submit" value="submit" class="u-form-control-hidden">
                        </div>
                        <div class="u-form-send-message u-form-send-success"> Gracias! Tu mensaje ha sido enviado. </div>
                        <div class="u-form-send-error u-form-send-message"> No se puede enviar su mensaje. Por favor, corrija los errores y vuelva a intentarlo. </div>
                        <input type="hidden" value="" name="recaptchaResponse">
                        <input type="hidden" name="formServices" value="b426f085-5ee7-58e2-a083-1d94706453eb">
                    </form>
                </div>
            </div>
        </section>
        <footer class="u-black u-clearfix u-footer" id="footer"><div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
            <div class="u-preserve-proportions u-shape u-shape-circle u-white u-shape-1"></div>
            <a href="Menu-Principal.html" class="u-image u-logo u-image-1" data-image-width="500" data-image-height="500">
                <img src="images/logo-Photoroom.png" class="u-logo-image u-logo-image-1">
            </a>
        </div></footer>
        <section class="u-backlink u-clearfix u-grey-80"></section>
        <script>
        (function(){
            const toggle   = document.getElementById('drawerToggle');   // tu botón existente
            const drawer   = document.getElementById('sideDrawer');
            const backdrop = document.getElementById('drawerBackdrop');
            const closeBtn = drawer.querySelector('.drawer-close');
            function openDrawer(open){
                drawer.classList.toggle('open', open);
                backdrop.hidden = !open;
                backdrop.classList.toggle('show', open);
                document.documentElement.classList.toggle('drawer-open', open);
                document.body.classList.toggle('drawer-open', open);
                if (toggle) toggle.setAttribute('aria-expanded', String(open));
                drawer.setAttribute('aria-hidden', String(!open));
                if (open){
                    const first = drawer.querySelector('a,button'); first && first.focus();
                } else {
                    toggle && toggle.focus();
                }
            }
            // Usamos tu botón de Nicepage como trigger, evitando su offcanvas por defecto
            toggle.addEventListener('click', function(e){
                e.preventDefault();              // evita navegación al "#"
                e.stopPropagation();             // evita que Nicepage abra su panel
                openDrawer(!drawer.classList.contains('open'));
            });
            // Cierres
            closeBtn.addEventListener('click', ()=> openDrawer(false));
            backdrop.addEventListener('click', ()=> openDrawer(false));
            document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') openDrawer(false); });
            // (Opcional) Desactivar por completo el offcanvas propio de Nicepage si molestara:
            // const collapse = document.getElementById('f3cb'); if (collapse) collapse.style.display = 'none';
            })();
            </script>
            </body></html>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 2. Usamos <script setup> para Vue 3. 
// No necesitamos importar defineComponent ni usar export default.
import { ref, reactive } from 'vue';

// Si necesitas lógica (ej: variables reactivas, funciones), iría aquí:
// import { ref } from 'vue';
// const title = ref('Agregar Repuesto');
const imageUrl = ref<string | null>(null);

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

function agregarRepuesto() {
  // Aquí iría la lógica para enviar los datos a tu backend
  console.log('Datos del repuesto a agregar:', repuesto);
  alert('Repuesto agregado (revisa la consola para ver los datos)');
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

.u-section-1 .u-custom-html-1 {
  height: auto;
  min-height: 114px;
  background-image: none;
}

.u-section-1 .u-form-1 {
  flex: 1 1 400px;
  min-width: 350px;
}
.contenedor {
      width: 300px;
      margin: 40px auto;
      text-align: center;
      font-family: sans-serif;
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
      background-color: #bd0000;
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
    }
    .boton-subir:hover {
      background-color: #ffcdcd;
    }

.u-section-1 .u-form-group-3 {
  margin-left: 0;
}

.u-section-1 .u-form-group-4 {
  margin-left: 0;
input[type="file"] {
}

.u-section-1 .u-form-group-6 {
  margin-left: 0;

.u-section-1 .u-form-group-7 {
  margin-left: 0;

.u-section-1 .u-form-group-8 {
  margin-left: 0;
}

.u-section-1 .u-form-group-9 {
  margin-left: 0;
  margin-right: 0;
}

.u-section-1 .u-btn-1 {
  background-image: none;
  border-style: solid;
  background-color: #bd0000 !important;
  color: white !important;
}
</style>