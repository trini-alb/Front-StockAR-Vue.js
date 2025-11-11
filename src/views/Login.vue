<template>
  <div class="login-container">
    <!-- Mantenemos tu diseño CSS exacto -->
    <section class="u-clearfix u-image u-section-1" id="login-section">
      <!-- Logo arriba a la derecha -->
      <img class="logo-sistema" src="/images/logo-Photoroom.png" alt="Logo del sistema" width="120" height="120">

      <div class="u-container-style u-group u-radius u-shape-round u-white u-group-1">
        <div class="u-container-layout u-container-layout-1">

          <div class="u-color-var u-container-style u-group u-radius u-shape-round u-group-2">
            <div class="u-container-layout u-container-layout-2">
              <h1 id="titulo-login" class="u-text u-text-white u-text-1">Iniciar Sesión</h1>
            </div>
          </div>

          <form @submit.prevent="handleLogin" class="custom-expanded u-form u-radius u-form-1">
            <!-- Email -->
            <div class="u-form-group u-form-name">
              <label for="email" class="u-label">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                id="email"
                name="email"
                placeholder="Introduzca su correo electrónico"
                class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-1"
                required
                :disabled="loading"
              />
            </div>

            <!-- Contraseña -->
            <div class="u-form-group password-container">
              <label for="password" class="u-label">Contraseña</label>
              <input
                v-model="loginForm.contraseña"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                placeholder="Introduzca la contraseña"
                class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-2"
                required
                :disabled="loading"
              />
              <button
                type="button"
                class="toggle-pass"
                @click="togglePassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <img 
                  :src="showPassword ? '/images/ojoAbierto.png' : '/images/ojoCerrado.png'" 
                  :alt="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" 
                  width="24" 
                  height="24"
                />
              </button>
            </div>

            <!-- Botón enviar -->
            <div class="u-align-center u-form-group u-form-submit">
              <button
                type="submit"
                class="u-btn u-btn-submit u-button-style u-radius u-btn-1"
                :disabled="!isFormValid || loading"
              >
                {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </div>

            <!-- Mensajes de error -->
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </form>

          <p class="login-helper">
            ¿No tienes cuenta?
            <router-link to="/registro" class="login-link">Regístrate aquí</router-link>
          </p>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services';
import type { LoginCredentials } from '@/services';

// Router para navegación
const router = useRouter();

// Estado reactivo
const loginForm = ref<LoginCredentials>({
  email: '',
  contraseña: ''
});

const loading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

// Computed properties
const isFormValid = computed(() => {
  return loginForm.value.email.trim() !== '' && 
         loginForm.value.contraseña.trim() !== '' &&
         /\S+@\S+\.\S+/.test(loginForm.value.email);
});

// Métodos
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await authService.login(loginForm.value);
    // Login exitoso - redirigir al dashboard
    console.log('Login exitoso:', response.usuario.empleado.nombre);
    await router.push('/dashboard');
    
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al iniciar sesión';
    console.error('Login error:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Si ya está autenticado, redirigir al dashboard
  if (authService.getCurrentUser()) {
    router.push('/dashboard');
  }
});
</script>
 
<style scoped>
/* Importar CSS originales */
@import '/css/nicepage.css';
@import '/css/login.css';

.error-message {
  color: #ff4757;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffe0e0;
  border-radius: 5px;
  border: 1px solid #ffcdd2;
}
</style>