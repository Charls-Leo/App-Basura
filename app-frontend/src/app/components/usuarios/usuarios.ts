import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { ProfesorApiService } from '../../services/ProfeAPI.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html'
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];
  calles: any[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private profesorApiService: ProfesorApiService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.cargarUsuarios();
    this.cargarCalles();
  }

  async cargarUsuarios() {
    this.cargando = true;
    this.error = '';

    try {
      this.usuarios = await this.supabaseService.getProfiles();
      console.log('✅ Usuarios cargados desde Supabase:', this.usuarios.length);
    } catch (err: any) {
      console.error('❌ Error al obtener usuarios:', err);
      this.error = 'Error al cargar usuarios';
    } finally {
      this.cargando = false;
    }
  }

  cargarCalles() {
    this.profesorApiService.getCalles().subscribe({
      next: (resp: any) => {
        this.calles = resp.data;
        console.log('Calles del profesor:', this.calles);
      },
      error: (err) => {
        console.error('Error al obtener calles del profesor', err);
      }
    });
  }
}