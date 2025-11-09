// src/router/index.ts

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// 1. Importa todos tus componentes de Vista usando el alias @/views/
import LoginView from '@/views/Login.vue';
import MainMenuView from '@/views/MainMenu.vue';
import AgregarRepuestoView from '@/views/AgregarRepuesto.vue';
import ListaRepuestosView from '@/views/ListaRepuestos.vue';
import ModificarRepuestoView from '@/views/ModificarRepuesto.vue';
import InformacionRepuestoView from '@/views/InformacionRepuesto.vue';
import RegistrarVentaView from '@/views/RegistrarVenta.vue';
import RegistroView from '@/views/Registro.vue'; // <-- CORREGIDO USANDO EL ALIAS @/
import CalcularPrecioView from '@/views/CalcularPrecio.vue';

// 2. Define la configuración de las rutas usando el tipo RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'home',
      redirect: '/login', // Redirige la raíz a la página de Login
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registro',
      name: 'registro-usuario',
      component: RegistroView, // <-- Componente de Registro
    },
    {
      path: '/menu-principal',
      name: 'main-menu',
      component: MainMenuView,
    },
    {
      path: '/repuestos/agregar',
      name: 'agregar-repuesto',
      component: AgregarRepuestoView,
    },
    {
      path: '/repuestos',
      name: 'lista-repuestos',
      component: ListaRepuestosView,
    },
    {
      path: '/repuestos/modificar/:id',
      name: 'modificar-repuesto',
      component: ModificarRepuestoView,
      props: true,
    },
    {
      path: '/repuestos/informacion/:id',
      name: 'informacion-repuesto',
      component: InformacionRepuestoView,
      props: true,
    },
    {
      path: '/ventas/registrar',
      name: 'registrar-venta',
      component: RegistrarVentaView,
    },
    {
      path: '/calcular-precio',
      name: 'calcular-precio',
      component: CalcularPrecioView,
    },
];

// 3. Crear el router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;