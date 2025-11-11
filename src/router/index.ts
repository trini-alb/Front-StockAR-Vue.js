// src/router/index.ts

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { authService } from '@/services';

// 1. Importa todos tus componentes de Vista usando el alias @/views/
import LoginView from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import ProductForm from '@/views/ProductForm.vue';
import ProductList from '@/views/ProductList.vue';
import VentaForm from '@/views/VentaForm.vue';
import VentaList from '@/views/VentaList.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import VentaDetail from '@/views/VentaDetail.vue';
// CORRECCIÓN: El nombre del componente era RegisterView, no RegistroView
import RegisterView from '@/views/Register.vue'; 
import CalcularPrecioView from '@/views/CalcularPrecio.vue';

// 2. Define la configuración de las rutas usando el tipo RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true } // Ruta pública
    },
    {
      path: '/registro',
      name: 'registro-usuario',
      component: RegisterView, // <-- CORREGIDO
      meta: { public: true } // Ruta pública
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/productos',
      name: 'product-list',
      component: ProductList,
    },
    {
      path: '/productos/nuevo',
      name: 'product-new',
      component: ProductForm,
    },
    {
      path: '/productos/:id/editar',
      name: 'product-edit',
      component: ProductForm,
      props: true,
    },
    {
      path: '/productos/:id',
      name: 'product-detail',
      component: ProductDetail,
      props: true,
    },
    {
      path: '/ventas',
      name: 'venta-list',
      component: VentaList,
    },
    {
      path: '/ventas/nueva',
      name: 'venta-new',
      component: VentaForm,
    },
    {
      path: '/ventas/:id',
      name: 'venta-detail',
      component: VentaDetail,
      props: true
    },
    {
      path: '/calcular-precio',
      name: 'calcular-precio',
      component: CalcularPrecioView,
    },
    // Redirección para cualquier ruta no encontrada
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
];

// 3. Crear el router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guardia de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const isAuthenticated = authService.isAuthenticated();

  if (!isPublic && !isAuthenticated) {
    return next('/login');
  }

  next();
});

export default router;