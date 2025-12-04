// src/services/usuario.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔧 Cambia el puerto si tu backend usa otro (verifica en el backend)
const API_URL = 'http://localhost:3000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  email: string;
  password: string;
  nombre: string;
  rol?: string;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${API_URL}/usuarios`;

  constructor(private http: HttpClient) {
    console.log('🔧 UsuariosService inicializado');
    console.log('📡 URL del API:', this.apiUrl);
  }

  loginUsuario(data: LoginRequest): Observable<LoginResponse> {
    console.log('📤 Enviando petición POST a:', `${this.apiUrl}/login`);
    console.log('📦 Datos enviados:', { email: data.email, passwordLength: data.password.length });
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  registroUsuario(data: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Método helper para obtener usuario actual
  obtenerUsuarioActual(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  // Método helper para cerrar sesión
  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioRol');
  }

  // Método helper para verificar si está logueado
  estaLogueado(): boolean {
    return !!localStorage.getItem('usuario');
  }
}