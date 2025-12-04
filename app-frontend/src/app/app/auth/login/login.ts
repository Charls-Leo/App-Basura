import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../services/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>🌱 EcoRecolecta</h1>
        <h2>Iniciar Sesión</h2>

        <!-- Mensaje de error -->
        <div *ngIf="mensajeError" class="error-message">
          ⚠️ {{ mensajeError }}
        </div>

        <form (ngSubmit)="iniciarSesion()">
          <div class="form-group">
            <label for="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              [(ngModel)]="correo"
              name="correo"
              placeholder="tu@correo.com"
              [disabled]="cargando"
              required
            />
          </div>

          <div class="form-group">
            <label for="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              [(ngModel)]="contrasena"
              name="contrasena"
              placeholder="1-6 caracteres"
              [disabled]="cargando"
              required
            />
          </div>

          <button 
            type="submit" 
            class="btn-login"
            [disabled]="cargando"
          >
            {{ cargando ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="registro-link">
          ¿No tienes cuenta? 
          <a (click)="irARegistro()">Regístrate aquí</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #667eea;
      margin-bottom: 10px;
      font-size: 2rem;
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
      font-size: 1.5rem;
    }

    .error-message {
      background-color: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #c33;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .btn-login {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 10px;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .registro-link {
      text-align: center;
      margin-top: 25px;
      color: #666;
    }

    .registro-link a {
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }

    .registro-link a:hover {
      text-decoration: underline;
    }

    .dev-help {
      margin-top: 30px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px dashed #ccc;
      font-size: 0.85rem;
    }

    .dev-help p {
      margin: 5px 0;
      color: #666;
    }

    .dev-help strong {
      color: #333;
    }
  `]
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

    console.log('🔐 Intentando login con:', { 
      email: correoLimpio, 
      passwordLength: contrasenaLimpia.length 
    });

    this.cargando = true;

    this.usuariosService.loginUsuario({
      email: correoLimpio,
      password: contrasenaLimpia
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del servidor:', response);
        
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
        console.error('❌ Error en login:', error);
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
    this.router.navigate(['/registro']);
  }
}