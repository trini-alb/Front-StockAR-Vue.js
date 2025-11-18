// Tipos para autenticación - Alineados con backend NestJS
export interface LoginCredentials {
  email: string;
  contraseña: string; // Usar el mismo nombre que en backend
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface Rol {
  idRol: number;
  nombre: string;
  descripcion?: string;
}

export interface Empleado {
  idEmpleado: number;
  nombre: string;
  apellido: string;
  rol: Rol;
}

export interface Usuario {
  idUsuario: number;
  email: string;
  empleado: Empleado;
}

// Para crear/actualizar usuarios
export interface CreateUsuarioDto {
  email: string;
  contraseña: string;
  idEmpleado: number;
}

export interface UpdateUsuarioDto extends Partial<CreateUsuarioDto> {}