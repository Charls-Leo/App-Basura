import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  async iniciarSesion() {
    // Limpiar mensaje de error
    this.mensajeError = '';

    // Validar campos vacíos
    if (!this.correo || !this.contrasena) {
      this.mensajeError = 'Por favor completa todos los campos';
      return;
    }

    // Limpiar espacios en blanco
    const correoLimpio = this.correo.trim();
    const contrasenaLimpia = this.contrasena.trim();

    console.log('🔐 Intentando login con Supabase:', { email: correoLimpio });

    this.cargando = true;

    try {
      const { user } = await this.supabaseService.signIn(correoLimpio, contrasenaLimpia);

      console.log('✅ Login exitoso:', user?.email);

      // Esperar a que se cargue el perfil
      await new Promise(resolve => setTimeout(resolve, 500));

      const profile = this.supabaseService.currentProfileValue;
      console.log('👤 Perfil cargado:', profile);

      this.cargando = false;

      // Redirección según el rol
      const rol = (profile?.rol || '').toLowerCase();

      if (rol === 'admin' || rol === 'administrador') {
        console.log('➡️ Usuario administrador -> Dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        console.log('➡️ Usuario normal -> Mapa');
        this.router.navigate(['/mapa']);
      }
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      this.cargando = false;

      if (error.message?.includes('Invalid login credentials')) {
        this.mensajeError = 'Correo o contraseña incorrectos';
      } else if (error.message?.includes('Email not confirmed')) {
        this.mensajeError = 'Por favor confirma tu email antes de iniciar sesión';
      } else {
        this.mensajeError = 'Error al iniciar sesión. Intenta de nuevo.';
      }
    }
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}