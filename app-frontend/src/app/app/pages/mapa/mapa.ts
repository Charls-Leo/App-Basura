import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { RutasService, CrearRutaPayload } from '../../../services/rutas.service';

// Ícono personalizado para los marcadores
const customMarkerIcon = L.icon({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41]
});

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

  // Marcadores (pines) de la ruta actual
  puntosMarkers: L.Marker[] = [];

  constructor(
    private router: Router,
    private rutasService: RutasService
  ) {}

  // =====================
  // Ciclo de vida
  // =====================

  ngAfterViewInit(): void {
    this.initMap();

    // Arreglo típico para que Leaflet calcule bien el tamaño dentro de layouts flex
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

  // =====================
  // Inicialización del mapa
  // =====================

  private initMap(): void {
    this.map = L.map('mapContainer', {
      center: [3.8773, -77.0277], // Buenaventura aprox
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

  // =====================
  // Manejo de clics en el mapa
  // =====================

  private onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.creandoRuta) return;

    const punto = e.latlng;

    // 1. Guardamos el punto
    this.puntosRuta.push(punto);

    // 2. Marcador con el ícono personalizado
    const marker = L.marker(punto, { icon: customMarkerIcon }).addTo(this.map);
    this.puntosMarkers.push(marker);

    // 3. Actualizar o crear la polyline con todos los puntos
    if (this.rutaPolyline) {
      this.rutaPolyline.setLatLngs(this.puntosRuta);
    } else {
      this.rutaPolyline = L.polyline(this.puntosRuta).addTo(this.map);
    }

    console.log('Punto agregado:', punto);
    console.log('Lista completa de puntos:', this.puntosRuta);
  }

  // =====================
  // Métodos usados en mapa.html
  // =====================

  focusRoute(id: number): void {
    console.log('focusRoute llamada con id:', id);
    // Más adelante: centrar en la ruta seleccionada desde la API
  }

  // Guardar ruta: ahora también hace POST a /api/rutas
  guardarRuta(): void {
    // 1. Validaciones básicas
    if (!this.creandoRuta) {
      alert('Primero activa "Crear Ruta" para empezar a dibujar una ruta.');
      return;
    }

    if (!this.nombreRuta || !this.nombreRuta.trim()) {
      alert('La ruta debe tener un nombre válido.');
      return;
    }

    if (this.puntosRuta.length < 2) {
      alert('La ruta debe tener al menos 2 puntos.');
      return;
    }

    // 2. Convertir puntos Leaflet -> [lng, lat] para GeoJSON
    const coordinates = this.puntosRuta.map(p => [p.lng, p.lat] as [number, number]);

    const shape = {
      type: 'LineString' as const,
      coordinates
    };

    // 3. Armar payload para la API
    const payload: CrearRutaPayload = {
      nombre_ruta: this.nombreRuta,
      perfil_id: 'a4cdc1ca-5e37-40b1-8a4b-d26237e25142', // luego vendrá del login
      shape
    };

    console.log('======== ENVIANDO RUTA A API /api/rutas ========');
    console.log(JSON.stringify(payload, null, 2));

    // 4. Llamar al servicio HTTP
    this.rutasService.crearRuta(payload).subscribe({
      next: (resp) => {
        console.log('Respuesta de la API al crear ruta:', resp);
        alert('✅ Ruta guardada correctamente en la API.');
        this.creandoRuta = false;
      },
      error: (err) => {
        console.error('Error al crear ruta en la API:', err);
        alert('❌ Ocurrió un error al guardar la ruta. Revisa la consola para más detalles.');
        this.creandoRuta = false;
      }
    });
  }

  // Activar modo creación de ruta
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

    // Quitar marcadores anteriores del mapa
    this.puntosMarkers.forEach(m => this.map.removeLayer(m));
    this.puntosMarkers = [];

    alert(
      `Modo creación de ruta activado para: "${this.nombreRuta}".\n\n` +
      'Ahora haz clic en el mapa para marcar los puntos de la ruta.'
    );
  }

  // Limpiar la ruta actual del mapa
  limpiarMapa(): void {
    if (!this.map) return;

    // 1. Quitar la polyline de la ruta actual, si existe
    if (this.rutaPolyline) {
      this.map.removeLayer(this.rutaPolyline);
      this.rutaPolyline = null;
    }

    // 2. Quitar todos los marcadores de la ruta actual
    this.puntosMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.puntosMarkers = [];

    // 3. Limpiar los puntos almacenados
    this.puntosRuta = [];

    // 4. Salir del modo creación y resetear el nombre
    this.creandoRuta = false;
    this.nombreRuta = '';

    console.log('Mapa limpiado (ruta actual eliminada)');
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
