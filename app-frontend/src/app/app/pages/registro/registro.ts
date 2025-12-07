import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

interface RegistroData {
  email: string;
  password: string;
  nombre: string;
  rol: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  registroData: RegistroData = {
    email: '',
    password: '',
    nombre: '',
    rol: 'usuario'
  };

  mensaje: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) { }

  async registrar() {
    console.log("🚀 Método registrar() llamado");

    this.mensaje = '';
    this.mensajeError = '';
    this.cargando = true;

    console.log("📤 Enviando datos a Supabase:", this.registroData);

    try {
      const data = await this.supabaseService.signUp(
        this.registroData.email.trim(),
        this.registroData.password,
        this.registroData.nombre.trim(),
        this.registroData.rol || 'usuario'
      );

      console.log("✅ Usuario registrado:", data);
      this.mensaje = 'Registro exitoso ✔';
      this.cargando = false;

      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (error: any) {
      console.error("❌ Error en registro:", error);
      this.cargando = false;

      if (error.message?.includes('already registered')) {
        this.mensajeError = 'Este email ya está registrado';
      } else if (error.message?.includes('Password should be')) {
        this.mensajeError = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        this.mensajeError = 'Error al registrar usuario: ' + error.message;
      }
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
