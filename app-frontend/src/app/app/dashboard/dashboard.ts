import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  nombre = localStorage.getItem('usuarioNombre');
  email = JSON.parse(localStorage.getItem('usuario') || '{}').email;
  rol = localStorage.getItem('usuarioRol');

  constructor(private router: Router) {}

  irAlMapa() {
    this.router.navigate(['/mapa']);
  }
  irAVehiculos() {
    this.router.navigate(['/vehiculos']);
  }
  irARutas() {
    this.router.navigate(['/rutas']);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
