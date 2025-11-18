import { authService } from '@/services';
import { useRouter } from 'vue-router';

export function useAuthActions() {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      await authService.logout(); // authService ya maneja la limpieza de almacenamiento
      router.push('/login');
    }
  };
  return { handleLogout };
}