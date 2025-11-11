<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-logo">
        <router-link to="/dashboard">
          <img src="/images/logo-Photoroom.png" alt="StockAR Logo" />
          <span>StockAR</span>
        </router-link>
      </div>

      <nav class="header-nav">
        <router-link to="/dashboard">Inicio</router-link>
        <router-link to="/productos">Repuestos</router-link>
        <router-link to="/ventas">Ventas</router-link>
        <router-link to="/calcular-precio">Calculadora</router-link>
      </nav>

      <div class="header-user">
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';




</script>

<style scoped>
.app-header {
  background-color: #1f2937; /* Un gris oscuro */
  color: white;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  max-width: 1280px;
  margin: 0 auto;
}

.header-logo a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
}

.header-logo img {
  height: 40px;
  width: 40px;
}

.header-logo span {
  font-size: 1.25rem;
  font-weight: 600;
}

.header-nav {
  display: flex;
  gap: 24px;
}

.header-nav a {
  color: #d1d5db;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease-in-out;
}

.header-nav a:hover {
  color: white;
}

.header-nav a.router-link-exact-active {
  color: white;
  border-bottom-color: #3b82f6; /* Azul */
}

.header-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 500;
}

.logout-button {
  background-color: #ef4444; /* Rojo */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #dc2626;
}
</style>