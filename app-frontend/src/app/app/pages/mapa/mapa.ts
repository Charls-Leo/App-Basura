import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
const customMarkerIcon = L.icon({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41]
});
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
  // Nombre de la ruta actual
  nombreRuta: string = '';
  // Flag: estamos creando una ruta?
  creandoRuta: boolean = false;
  // Lista de puntos para la ruta actual
  puntosRuta: L.LatLng[] = [];
  // Línea que une los puntos de la ruta actual
  rutaPolyline: L.Polyline | null = null;

  constructor(private router: Router) {}


  ngAfterViewInit(): void {
  this.initMap();

  setTimeout(() => {
    if (this.map) {
      this.map.invalidateSize();
    }
  }, 0);
}


  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('mapContainer', {
      center: [3.8773, -77.0277], 
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Escuchar clics en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e);
    });
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
  if (!this.creandoRuta) return;

  const punto = e.latlng;

  // 1. Guardamos el punto
  this.puntosRuta.push(punto);

  // 2. Marcador con el ícono personalizado
  L.marker(punto, { icon: customMarkerIcon }).addTo(this.map);

  // 3. Actualizar o crear la polyline con todos los puntos
  if (this.rutaPolyline) {
    this.rutaPolyline.setLatLngs(this.puntosRuta);
  } else {
    this.rutaPolyline = L.polyline(this.puntosRuta).addTo(this.map);
  }

  console.log('Punto agregado:', punto);
  console.log('Lista completa de puntos:', this.puntosRuta);
}

  focusRoute(id: number): void {
    console.log('focusRoute llamada con id:', id);
  }

  guardarRuta(): void {
    alert('Para crear y guardar rutas, usa el botón "Crear Ruta" dentro del mapa.');
  }

  onCrearRuta(): void {
    const nombre = window.prompt('Escribe el nombre para la nueva ruta:');

    if (!nombre || !nombre.trim()) {
      return;
    }

    this.nombreRuta = nombre.trim();
    this.creandoRuta = true;

    // Limpiar puntos y polyline anteriores
    this.puntosRuta = [];
    if (this.rutaPolyline) {
      this.map.removeLayer(this.rutaPolyline);
      this.rutaPolyline = null;
    }

    alert(
      `Modo creación de ruta activado para: "${this.nombreRuta}".\n\n` +
      'Ahora haz clic en el mapa para marcar los puntos de la ruta.'
    );
  }


  limpiarMapa(): void {
    if (!this.map) return;

    this.map.eachLayer(layer => {
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
