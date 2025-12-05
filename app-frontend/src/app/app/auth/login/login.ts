import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../services/usuario';

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
    private usuariosService: UsuariosService
  ) {}

  iniciarSesion() {
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

    console.log(' Intentando login con:', { 
      email: correoLimpio, 
      passwordLength: contrasenaLimpia.length 
    });

    this.cargando = true;

    this.usuariosService.loginUsuario({
      email: correoLimpio,
      password: contrasenaLimpia
    }).subscribe({
      next: (response: any) => {
        console.log(' Respuesta del servidor:', response);
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
        localStorage.setItem('usuarioId', response.usuario.id);
        localStorage.setItem('usuarioNombre', response.usuario.nombre);
        localStorage.setItem('usuarioRol', response.usuario.rol);
        
        this.cargando = false;
        // después de guardar en localStorage
        console.log('ROL guardado en localStorage ->', localStorage.getItem('usuarioRol'));

        // Redirección según el rol
        const rol = (response.usuario.rol || '').toLowerCase();

        if (rol === 'admin' || rol === 'administrador') {
          console.log('➡️ Usuario administrador -> Dashboard');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('➡️ Usuario normal -> Mapa');
          this.router.navigate(['/mapa']);
        }
      },
      error: (error: any) => {
        console.error(' Error en login:', error);
        this.cargando = false;
        
        if (error.status === 401) {
          this.mensajeError = 'Correo o contraseña incorrectos';
        } else if (error.status === 400) {
          this.mensajeError = 'Por favor completa todos los campos';
        } else if (error.status === 0) {
          this.mensajeError = 'No se pudo conectar con el servidor. Verifica que esté corriendo.';
        } else {
          this.mensajeError = 'Error al iniciar sesión. Intenta de nuevo.';
        }
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}