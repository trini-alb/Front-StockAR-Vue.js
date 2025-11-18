<template>
  <!-- Basado en Registro.html -->
  <section class="u-clearfix u-image u-section-1" id="block-2">
    <img class="logo-sistema" src="/images/logo-Photoroom.png" alt="Logo del sistema" width="120" height="120">
    
    <div class="u-container-style u-group u-radius u-shape-round u-white u-group-1">
      <div class="u-container-layout u-container-layout-1">
        
        <div class="u-color-var u-container-style u-group u-radius u-shape-round u-group-2">
          <div class="u-container-layout u-container-layout-2">
            <h1 class="u-text u-text-white u-text-1">Registrar Usuario</h1>
          </div>
        </div>

        <form @submit.prevent="handleRegister" class="custom-expanded u-form u-radius u-form-1">
          
          <!-- Email -->
          <div class="u-form-group u-form-name">
            <label for="email" class="u-label">Email</label>
            <input 
              v-model="registerForm.email"
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
            <label for="contraseña" class="u-label">Contraseña</label>
            <input 
              v-model="registerForm.contraseña"
              :type="showPassword ? 'text' : 'password'"
              id="contraseña" 
              name="contraseña"
              placeholder="Introduzca la contraseña"
              class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-2" 
              required
              :disabled="loading"
            />
            <button 
              type="button" 
              class="toggle-pass" 
              @click="togglePassword"
            >
              <img 
                :src="showPassword ? '/images/ojoAbierto.png' : '/images/ojoCerrado.png'" 
                alt="Mostrar/Ocultar" 
                width="24" 
                height="24"
              />
            </button>
          </div>

          <!-- Verificar Contraseña -->
          <div class="u-form-group password-container">
            <label for="confirmar" class="u-label">Verificar contraseña</label>
            <input 
              v-model="registerForm.confirmarContraseña"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmar" 
              name="confirmar"
              placeholder="Confirme la contraseña"
              class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-3" 
              required
              :disabled="loading"
            />
            <button 
              type="button" 
              class="toggle-pass" 
              @click="toggleConfirmPassword"
            >
              <img 
                :src="showConfirmPassword ? '/images/ojoAbierto.png' : '/images/ojoCerrado.png'" 
                alt="Mostrar/Ocultar" 
                width="24" 
                height="24"
              />
            </button>
          </div>

          <!-- Nombre -->
          <div class="u-form-group u-form-name">
            <label for="nombre" class="u-label">Nombre</label>
            <input 
              v-model="registerForm.nombre"
              type="text" 
              id="nombre" 
              name="nombre"
              placeholder="Introduzca su nombre"
              class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-4" 
              required
              :disabled="loading"
            />
          </div>

          <!-- Apellido -->
          <div class="u-form-group u-form-name">
            <label for="apellido" class="u-label">Apellido</label>
            <input 
              v-model="registerForm.apellido"
              type="text" 
              id="apellido" 
              name="apellido"
              placeholder="Introduzca su apellido"
              class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-5" 
              required
              :disabled="loading"
            />
          </div>

          <!-- Teléfono -->
          <div class="u-form-group u-form-name">
            <label for="telefono" class="u-label">Teléfono</label>
            <input 
              v-model="registerForm.telefono"
              type="tel" 
              id="telefono" 
              name="telefono"
              placeholder="Introduzca su teléfono"
              class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-6" 
              required
              :disabled="loading"
            />
          </div>

          <!-- DNI -->
          <div class="u-form-group u-form-name">
            <label for="dni" class="u-label">DNI</label>
            <input 
              v-model="registerForm.dni"
              type="text" 
              id="dni" 
              name="dni"
              placeholder="Introduzca su DNI"
              class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-7" 
              required
              :disabled="loading"
            />
          </div>

          <!-- Fecha de Nacimiento -->
          <div class="u-form-group u-form-name">
            <label for="fechaNacimiento" class="u-label">Fecha de Nacimiento</label>
            <input 
              v-model="registerForm.fechaNacimiento"
              type="date" 
              id="fechaNacimiento" 
              name="fechaNacimiento"
              class="u-border-black u-grey-10 u-input u-input-rectangle u-radius u-input-8" 
              required
              :disabled="loading"
            />
          </div>

          <!-- Botón registrar -->
          <div class="u-align-center u-form-group u-form-submit">
            <button 
              type="submit"
              class="u-btn u-btn-submit u-button-style u-radius u-btn-1"
              :disabled="!isFormValid || loading"
            >
              {{ loading ? 'Registrando...' : 'Registrar' }}
            </button>
          </div>

          <!-- Mensajes de error -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
        </form>

        <p class="login-helper">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="login-link">Inicia sesión aquí</router-link>
        </p>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services';

const router = useRouter();

// Interfaz para el formulario de registro
interface RegisterForm {
  email: string;
  contraseña: string;
  confirmarContraseña: string; // Corregido de confirmarContrasena
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
}

// Estado reactivo
const registerForm = ref<RegisterForm>({
  email: '',
  contraseña: '',
  confirmarContraseña: '', // Corregido de confirmarContrasena
  nombre: '',
  apellido: '',
  telefono: '',
  dni: '',
  fechaNacimiento: ''
});

const loading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Computed properties
const isFormValid = computed(() => {
  const form = registerForm.value;
  return form.email.trim() !== '' && 
         form.contraseña.trim() !== '' &&
         form.confirmarContraseña.trim() !== '' &&
         form.nombre.trim() !== '' &&
         form.apellido.trim() !== '' &&
         form.telefono.trim() !== '' &&
         form.dni.trim() !== '' &&
         form.fechaNacimiento !== '' &&
         /\S+@\S+\.\S+/.test(form.email) &&
         form.contraseña === form.confirmarContraseña &&
         form.contraseña.length >= 6;
});

// Métodos
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleRegister = async () => {
  if (loading.value) return;

  if (!isFormValid.value) {
    if (registerForm.value.contraseña !== registerForm.value.confirmarContraseña) {
      errorMessage.value = 'Las contraseñas no coinciden.';
    } else if (registerForm.value.contraseña.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
    } else {
      errorMessage.value = 'Por favor, complete todos los campos correctamente.';
    }
    return;
  }

  if (registerForm.value.contraseña !== registerForm.value.confirmarContraseña) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    // Preparar datos para el backend
    const userData = {
      email: registerForm.value.email,
      contraseña: registerForm.value.contraseña,
      empleado: {
        nombre: registerForm.value.nombre,
        apellido: registerForm.value.apellido,
        telefono: registerForm.value.telefono,
        dni: registerForm.value.dni,
        fechaNacimiento: new Date(registerForm.value.fechaNacimiento).toISOString()
      }
    };

    const response = await authService.register(userData);
    
    console.log('Registro exitoso:', response);
    alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
    
    // Redirigir al login
    await router.push('/login');
    
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al registrar usuario';
    console.error('Register error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/* Importar CSS originales */

.error-message {
  color: #ff4757;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffe0e0;
  border-radius: 5px;
  border: 1px solid #ffcdd2;
}

.login-helper {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link {
  color: #1e40af;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}

/* Ajustes para el logo */
.logo-sistema {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>