<template>
  <div id="app">
    <!-- El header se mostrará en todas las páginas excepto en Login y Registro -->
    <AppHeader v-if="showNavigation" />
    
    <!-- El contenido principal de la ruta se renderizará aquí -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'; 
import AppHeader from '@/components/AppHeader.vue';

const route = useRoute();

// Determina si se debe mostrar la barra de navegación
const showNavigation = computed(() => {
  // No mostrar en las rutas públicas como login o registro
  return route.name !== 'login' && 
         route.name !== 'registro-usuario';
});
</script>

<style>
/* Importar CSS global */
@import '@/style.css';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f3f4f6; /* Un color de fondo base más claro */
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>