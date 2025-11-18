<template>
  <header class="navbar bg-base-200">
    <!-- Izquierda: logo + menú mobile -->
    <div class="navbar-start">
      <!-- Menú hamburguesa (solo mobile) -->
      <div class="dropdown">
        <button tabindex="0" class="btn btn-ghost lg:hidden" @click="open = !open">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Menú desplegable mobile -->
        <ul
          v-show="open"
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          @click="open = false"
        >
          <li><RouterLink :class="linkClass('/dashboard')" to="/dashboard">Inicio</RouterLink></li>
          <li><RouterLink :class="linkClass('/productos')" to="/productos">Repuestos</RouterLink></li>
          <li><RouterLink :class="linkClass('/ventas')" to="/ventas">Ventas</RouterLink></li>
          <li><RouterLink :class="linkClass('/calcular-precio')" to="/calcular-precio">Calculadora</RouterLink></li>
        </ul>
      </div>

      <!-- Logo -->
      <RouterLink to="/dashboard" class="btn btn-ghost gap-2 normal-case text-lg">
        <img src="/images/logo-Photoroom.png" alt="StockAR Logo" class="h-8 w-8" />
        <span class="font-semibold">StockAR</span>
      </RouterLink>
    </div>

    <!-- Centro: menú desktop -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><RouterLink :class="linkClass('/dashboard')" to="/dashboard">Inicio</RouterLink></li>
        <li><RouterLink :class="linkClass('/productos')" to="/productos">Repuestos</RouterLink></li>
        <li><RouterLink :class="linkClass('/ventas')" to="/ventas">Ventas</RouterLink></li>
        <li><RouterLink :class="linkClass('/calcular-precio')" to="/calcular-precio">Calculadora</RouterLink></li>
      </ul>
    </div>

    <!-- Derecha: acciones (tema/usuario) -->
    <div class="navbar-end gap-2">
      <!-- Toggle tema (opcional) -->
      <button class="btn btn-ghost btn-sm" @click="toggleTheme">
        Tema: {{ theme }}
      </button>

      <!-- Placeholder usuario -->
      <div class="avatar placeholder">
        <div class="bg-neutral text-neutral-content rounded-full w-8">
          <span class="text-xs">AR</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const open = ref(false);
const route = useRoute();

function linkClass(prefix: string) {
  const active = route.path.startsWith(prefix);
  // subraya el activo con borde inferior y color
  return active ? 'border-b-2 border-primary text-primary font-medium' : '';
}

/* Tema (opcional) */
const theme = ref<'light' | 'stockar'>('stockar');
onMounted(() => {
  const saved = (localStorage.getItem('theme') as 'light' | 'stockar') ?? 'stockar';
  theme.value = saved;
  document.documentElement.setAttribute('data-theme', theme.value);
  document.documentElement.classList.toggle('dark', theme.value === 'stockar');
});
function toggleTheme() {
  theme.value = theme.value === 'stockar' ? 'light' : 'stockar';
  document.documentElement.setAttribute('data-theme', theme.value);
  document.documentElement.classList.toggle('dark', theme.value === 'stockar');
  localStorage.setItem('theme', theme.value);
}
</script>


