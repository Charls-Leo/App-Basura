import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';          // ← IMPORTANTE
import { UsuariosService } from '../../../services/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],                             // ← IMPORTANTE
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  correo: string = '';
  contrasena: string = '';

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();

    const btn = document.querySelector('.btn-login') as HTMLButtonElement;
    const originalText = btn?.textContent ?? 'Iniciar Sesión';

    if (btn) {
      btn.textContent = 'Iniciando sesión...';
      btn.style.background = '#2d7a2e';
      btn.disabled = true;
    }

    // Datos que se envían al backend
    const datos = {
      correo: this.correo,
      contrasena: this.contrasena
    };

    this.usuariosService.loginUsuario(datos).subscribe({
      next: (resp: any) => {
        localStorage.setItem('eco_token', resp.token);

        alert('¡Bienvenido a EcoRecolecta! 🌱\nLogin exitoso');

        if (btn) {
          btn.textContent = originalText;
          btn.style.background = '#1a1a1a';
          btn.disabled = false;
        }

        this.router.navigate(['/mapa']);
      },

      error: (err) => {
        alert('Error: ' + (err.error?.error || 'No se pudo iniciar sesión'));

        if (btn) {
          btn.textContent = originalText;
          btn.style.background = '#1a1a1a';
          btn.disabled = false;
        }
      }
    });
  }
}
