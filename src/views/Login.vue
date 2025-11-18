<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="card bg-base-100 shadow-2xl w-full max-w-md">
      <div class="card-body space-y-4">
        <!-- Logo -->
        <div class="flex justify-center mb-2">
          <img
            src="/images/logo-Photoroom.png"
            alt="Logo del sistema"
            class="h-16 w-16"
          />
        </div>

        <!-- Título -->
        <div class="text-center space-y-1">
          <h1 class="text-2xl font-semibold">Iniciar sesión</h1>
          <p class="text-sm opacity-70">
            Accedé a StockAR con tu correo y contraseña.
          </p>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="alert alert-error">
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Formulario -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Email -->
          <label class="form-control">
            <span class="label">
              <span class="label-text">Email</span>
            </span>
            <input
              v-model="loginForm.email"
              type="email"
              id="email"
              name="email"
              class="input input-bordered w-full"
              placeholder="ejemplo@correo.com"
              required
              :disabled="loading"
            />
          </label>

          <!-- Contraseña -->
          <label class="form-control">
            <span class="label">
              <span class="label-text">Contraseña</span>
            </span>
            <div class="relative">
              <input
                v-model="loginForm.contraseña"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                class="input input-bordered w-full pr-10"
                placeholder="Introduzca la contraseña"
                required
                :disabled="loading"
              />
              <button
                type="button"
                class="btn btn-ghost btn-xs absolute right-1 top-1/2 -translate-y-1/2"
                @click="togglePassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <img
                  :src="showPassword ? '/images/ojoAbierto.png' : '/images/ojoCerrado.png'"
                  :alt="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  class="h-4 w-4"
                />
              </button>
            </div>
          </label>

          <!-- Botón -->
          <div class="pt-2">
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="!isFormValid || loading"
            >
              {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
            </button>
          </div>
        </form>

        <!-- Link registro -->
        <p class="text-center text-sm pt-2">
          ¿No tenés cuenta?
          <RouterLink to="/registro" class="link link-primary">
            Registrate aquí
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { authService } from '../services/auth.service';
interface LoginCredentials {
  email: string;
  contraseña: string;
}

const router = useRouter();

// Estado reactivo
const loginForm = ref<LoginCredentials>({
  email: '',
  contraseña: ''
});

const loading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

// Computed
const isFormValid = computed(() => {
  return (
    loginForm.value.email.trim() !== '' &&
    loginForm.value.contraseña.trim() !== '' &&
    /\S+@\S+\.\S+/.test(loginForm.value.email)
  );
});

// Métodos
function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleLogin() {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await authService.login(loginForm.value);
    console.log('Login exitoso:', response.usuario.empleado.nombre);
    await router.push('/dashboard');
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Error al iniciar sesión';
    console.error('Login error:', error);
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  if (authService.getCurrentUser()) {
    router.push('/dashboard');
  }
});
</script>

<style scoped>
/* Todo el estilo principal lo maneja DaisyUI/Tailwind */
</style>
