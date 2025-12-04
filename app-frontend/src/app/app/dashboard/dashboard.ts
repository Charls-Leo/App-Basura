import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Bienvenido, {{ nombre }}</h1>
      <p>Tu correo: {{ email }}</p>
      <p>Rol: {{ rol }}</p>

      <button (click)="irAlMapa()">Ir al mapa</button>
      <button (click)="cerrarSesion()" class="logout">Cerrar sesión</button>
    </div>
  `,
  styles: [`
    .container {
      margin: 30px auto;
      max-width: 400px;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    button {
      width: 100%;
      padding: 12px;
      margin-top: 15px;
      font-size: 1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      background: #667eea;
      color: white;
    }

    .logout {
      background: #e05a5a;
    }
  `]
})
export class DashboardComponent {
  nombre = localStorage.getItem('usuarioNombre');
  email = JSON.parse(localStorage.getItem('usuario') || '{}').email;
  rol = localStorage.getItem('usuarioRol');

  constructor(private router: Router) {}

  irAlMapa() {
    this.router.navigate(['/mapa']);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
