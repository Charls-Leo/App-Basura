import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class MapaComponent implements AfterViewInit, OnDestroy {

  map!: L.Map;

  // Para el input con [(ngModel)]
  nombreRuta: string = '';

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

private initMap(): void {
  this.map = L.map('mapContainer', {
    center: [3.8773, -77.0277], // Buenaventura aprox
    zoom: 14
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(this.map);
}

  // =====================
  // Métodos usados en mapa.html
  // =====================

  focusRoute(id: number): void {
    console.log('focusRoute llamada con id:', id);
    // Más adelante: podrías centrar el mapa en la ruta correspondiente
  }

  guardarRuta(): void {
    // Este guardarRuta era de la lógica vieja.
    // Ahora la creación real de rutas está en /crear-ruta.
    alert('Para crear y guardar rutas, usa el botón "Crear Ruta" y ve a la pantalla de editor.');
  }

  crearRuta(): void {
    // Navega a la pantalla donde sí se dibuja y guarda la ruta
    this.router.navigate(['/crear-ruta']);
  }

  limpiarMapa(): void {
    if (!this.map) return;

    // Elimina todas las capas excepto el tileLayer base
    this.map.eachLayer(layer => {
      // Mantener solo el tileLayer (que suele tener attribution)
      if (!(layer as any).getAttribution) {
        this.map.removeLayer(layer);
      }
    });

    console.log('Mapa limpiado');
  }

  zoomIn(): void {
    if (this.map) {
      this.map.zoomIn();
    }
  }

  zoomOut(): void {
    if (this.map) {
      this.map.zoomOut();
    }
  }
}
