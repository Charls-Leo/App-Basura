import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { RutasService, CrearRutaPayload, RutaDTO } from '../../../services/rutas.service';

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
export class MapaComponent implements AfterViewInit, OnDestroy, OnInit {

  map!: L.Map;

  // Nombre de la ruta actual (en modo creación)
  nombreRuta: string = '';

  // Flag: estamos creando una ruta nueva?
  creandoRuta: boolean = false;

  // Lista de puntos para la ruta actual (modo creación)
  puntosRuta: L.LatLng[] = [];

  // Línea que une los puntos de la ruta actual o seleccionada
  rutaPolyline: L.Polyline | null = null;

  // Marcadores (pines) de la ruta actual (modo creación)
  puntosMarkers: L.Marker[] = [];

  // ✅ Rutas que vienen del backend para el sidebar
  rutas: RutaDTO[] = [];

  constructor(
    private router: Router,
    private rutasService: RutasService
  ) {}

  // Cargar rutas desde el backend
  ngOnInit(): void {
    this.cargarRutas();
  }

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

  private cargarRutas(): void {
    this.rutasService.getRutas().subscribe({
      next: (rutas) => {
        console.log('Rutas cargadas desde la API:', rutas);
        this.rutas = rutas;
      },
      error: (err) => {
        console.error('Error al cargar rutas desde la API:', err);
      }
    });
  }


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
  // Mostrar una ruta guardada al hacer clic en el sidebar
  // =====================

  mostrarRuta(ruta: RutaDTO): void {
    if (!this.map || !ruta.shape || !ruta.shape.coordinates) return;

    // Salimos de modo creación para no mezclar
    this.creandoRuta = false;

    // Limpiar cualquier cosa que haya en el mapa (ruta anterior)
    this.limpiarSoloCapas();

    // Convertir [lng, lat] -> L.LatLng
    const latLngs = ruta.shape.coordinates.map(([lng, lat]) => L.latLng(lat, lng));

    // Dibujar la polyline de la ruta seleccionada
    this.rutaPolyline = L.polyline(latLngs).addTo(this.map);

    // Ajustar el mapa para que se vea completa
    this.map.fitBounds(this.rutaPolyline.getBounds());
  }

  // =====================
  // Métodos usados en mapa.html
  // =====================

  focusRoute(id: number): void {
    console.log('focusRoute llamada con id:', id);
  }

  guardarRuta(): void {
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

    const coordinates = this.puntosRuta.map(p => [p.lng, p.lat] as [number, number]);

    const shape = {
      type: 'LineString' as const,
      coordinates
    };

    const payload: CrearRutaPayload = {
      nombre_ruta: this.nombreRuta,
      perfil_id: 'a4cdc1ca-5e37-40b1-8a4b-d26237e25142',
      shape
    };

    console.log('======== ENVIANDO RUTA A API /api/rutas ========');
    console.log(JSON.stringify(payload, null, 2));

    this.rutasService.crearRuta(payload).subscribe({
      next: (resp) => {
        console.log('Respuesta de la API al crear ruta:', resp);
        alert('✅ Ruta guardada correctamente en la API.');
        this.creandoRuta = false;

        // Recargar la lista de rutas para que aparezca en el sidebar
        this.cargarRutas();
      },
      error: (err) => {
        console.error('Error al crear ruta en la API:', err);
        alert('❌ Ocurrió un error al guardar la ruta. Revisa la consola para más detalles.');
        this.creandoRuta = false;
      }
    });
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

    this.limpiarSoloCapas();

    alert(
      `Modo creación de ruta activado para: "${this.nombreRuta}".\n\n` +
      'Ahora haz clic en el mapa para marcar los puntos de la ruta.'
    );
  }

  // Limpia capas dibujadas (polyline y marcadores) pero no resetea todo el estado
  private limpiarSoloCapas(): void {
    if (this.rutaPolyline) {
      this.map.removeLayer(this.rutaPolyline);
      this.rutaPolyline = null;
    }

    this.puntosMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.puntosMarkers = [];
  }

  limpiarMapa(): void {
    if (!this.map) return;

    this.limpiarSoloCapas();

    this.puntosRuta = [];
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
