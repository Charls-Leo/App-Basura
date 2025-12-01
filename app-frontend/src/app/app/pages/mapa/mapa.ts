import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletMapService } from '../../../services/leaflet.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class MapaComponent implements AfterViewInit {

  constructor(private mapService: LeafletMapService) {}

  ngAfterViewInit(): void {
    // ✅ Siempre inicializamos el mapa al entrar a la página
    // (con datos demo por defecto, así no se ve en blanco)
    this.mapService.initMap('mapContainer');
  }

  centrarMapa(): void {
    this.mapService.centerMap();
  }

  mostrarRutasDemo(): void {
    // Solo hace zoom para mostrar todas las rutas que ya están dibujadas
    this.mapService.showAllRoutes();
  }

  limpiarMapa(): void {
    this.mapService.clearAll();
  }
}
