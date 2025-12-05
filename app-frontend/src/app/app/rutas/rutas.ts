import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutasService, RutaShape } from '../../services/rutas.service';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutas.html',
  styleUrls: ['./rutas.css']
})
export class RutasComponent implements OnInit {

  rutas: any[] = [];

  // Usa el mismo perfil que usas en mapa.ts
  private readonly PERFIL_ID = 'a4cdc1ca-5e37-40b1-8a4b-d26237e25142';

  constructor(
    private rutasService: RutasService
  ) {}

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas() {
    this.rutasService.getRutas(this.PERFIL_ID).subscribe({
      next: (resp) => {
        let lista: any[] = [];

        if (Array.isArray(resp)) lista = resp;
        else if (Array.isArray(resp.data)) lista = resp.data;
        else if (Array.isArray(resp.rutas)) lista = resp.rutas;
        else lista = [];

        // Normalizamos el shape
        this.rutas = lista.map((r) => {
          let shape: RutaShape;

          if (typeof r.shape === 'string') {
            try {
              shape = JSON.parse(r.shape);
            } catch {
              shape = { type: 'LineString', coordinates: [] };
            }
          } else {
            shape = r.shape;
          }

          return { ...r, shape };
        });
      },
      error: (err) => {
        console.error('Error cargando rutas:', err);
      }
    });
  }
}
