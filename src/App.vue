<template>
  <div id="app-container">
    <NavBar />

    <main>
      <router-view></router-view> 
      <p>Contenido de la página actual irá aquí</p>
    </main>
  </div>
</template>

<script setup>
// 3. Importamos el componente desde la carpeta 'components'
import NavBar from './components/NavBar.vue';

// Si tu NavBar tenía alguna lógica específica (como manejo de estado), iría aquí.
</script>

<style>
/* 4. Estilos globales de App.vue, si fueran necesarios */
/* Puedes dejar este bloque vacío por ahora si todo tu CSS de Nicepage está en src/style.css */
</style>