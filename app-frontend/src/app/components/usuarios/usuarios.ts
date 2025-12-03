import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuario';
import { ProfesorApiService } from '../../services/ProfeAPI.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html'
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];
  calles: any[] = []; // ← nuevo

  constructor(
    private usuarioService: UsuariosService,
    private profesorApiService: ProfesorApiService
  ) {}

  ngOnInit(): void {
    // Tus usuarios del backend propio
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });

    // Calles de la API del profesor
    this.profesorApiService.getCalles().subscribe({
      next: (resp: any) => {
        this.calles = resp.data; // porque la API devuelve { data: [...] }
        console.log('Calles del profesor:', this.calles);
      },
      error: (err) => {
        console.error('Error al obtener calles del profesor', err);
      }
    });
  }
}