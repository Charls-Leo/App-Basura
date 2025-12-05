import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import {
  RutasService,
  CrearRutaPayload,
  RutaShape
} from '../../../services/rutas.service';

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

  // Marcadores (pines) de la ruta actual (modo creación) o de la ruta seleccionada
  puntosMarkers: L.Marker[] = [];

  // Rutas normalizadas que usamos en el sidebar
  rutas: any[] = [];

  // Control del modal para nombre de ruta
  mostrarModalNombreRuta: boolean = false;

  // 🆕 Sistema de notificaciones toast
  toastVisible: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'warning' = 'success';

  // Timer para auto-ocultar toast
  private toastTimeout: any;

  // Perfil fijo por ahora (el mismo que usas en el POST)
  private readonly PERFIL_ID = 'a4cdc1ca-5e37-40b1-8a4b-d26237e25142';

  constructor(
    private router: Router,
    private rutasService: RutasService
  ) {}

  // -------------------
  // Utils: toast / alert
  // -------------------
  mostrarToast(mensaje: string, tipo: 'success' | 'warning' = 'success'): void {
    this.toastMessage = mensaje;
    this.toastType = tipo;
    this.toastVisible = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.cerrarToast(), 5000);
  }

  cerrarToast(): void {
    this.toastVisible = false;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  // -------------------
  // Ciclo de vida
  // -------------------
  ngOnInit(): void {
    this.cargarRutas();
  }

  ngAfterViewInit(): void {
    this.initMap();

    // Asegurar tamaño del mapa
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  // -------------------
  // Init mapa
  // -------------------
  private initMap(): void {
    const bounds = L.latLngBounds(
      [3.70, -77.20], // suroeste
      [4.00, -76.90]  // noreste
    );

    this.map = L.map('mapContainer', {
      center: [3.8773, -77.0277],
      zoom: 14,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Click en mapa para añadir puntos solo en modo creación
    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  // -------------------
  // Cargar rutas desde API
  // -------------------
  private cargarRutas(): void {
    this.rutasService.getRutas(this.PERFIL_ID).subscribe({
      next: (resp: any) => {
        console.log('=== DIAGNÓSTICO: Rutas recibidas ===');
        console.log('Respuesta cruda de /api/rutas:', resp);

        let lista: any[] = [];

        // Normalizar formatos típicos
        if (Array.isArray(resp)) {
          lista = resp;
        } else if (Array.isArray(resp.data)) {
          lista = resp.data;
        } else if (Array.isArray(resp.results)) {
          lista = resp.results;
        } else if (Array.isArray(resp.rutas)) {
          lista = resp.rutas;
        } else {
          console.warn('Formato de respuesta no esperado. Usando [].');
          lista = [];
        }

        console.log(`📊 Total de rutas recibidas: ${lista.length}`);

        // 🔧 Parsear shape y normalizar coordenadas
        this.rutas = lista.map((r, index) => {
          console.log(`\nRuta ${index}: ${r.nombre_ruta}`);
          console.log(`  - shape (tipo): ${typeof r.shape}`);
          console.log(`  - shape (valor):`, r.shape);

          let shapeObj: any;
          
          // Paso 1: Convertir string a objeto si es necesario
          if (typeof r.shape === 'string') {
            try {
              shapeObj = JSON.parse(r.shape);
              console.log(`  - shape parseado:`, shapeObj);
            } catch (err) {
              console.error(`  ❌ Error parseando shape:`, err);
              return { ...r, shape: { type: 'LineString', coordinates: [] } };
            }
          } else {
            shapeObj = r.shape || { type: 'LineString', coordinates: [] };
          }

          // Paso 2: Normalizar coordenadas según el tipo de geometría
          let coordinates: [number, number][];
          
          if (shapeObj.type === 'LineString') {
            // LineString: array directo de coordenadas
            coordinates = shapeObj.coordinates as [number, number][];
            console.log(`  - Tipo: LineString - ${coordinates.length} puntos directos`);
          } else if (shapeObj.type === 'MultiLineString') {
            // MultiLineString: array de arrays
            const multiCoords = shapeObj.coordinates as [number, number][][];
            console.log(`  - Tipo: MultiLineString - ${multiCoords.length} líneas`);
            
            // 🔧 SOLUCIÓN: Si el backend devuelve MultiLineString con 1 línea,
            // extraer esa línea. Si hay múltiples líneas, aplanar todas.
            if (multiCoords.length === 1) {
              coordinates = multiCoords[0];
              console.log(`  - Extrayendo única línea: ${coordinates.length} puntos`);
            } else {
              // Si hay múltiples líneas, concatenarlas todas
              coordinates = multiCoords.flat();
              console.log(`  - Aplanando ${multiCoords.length} líneas: ${coordinates.length} puntos totales`);
            }
          } else {
            console.warn(`⚠️ Tipo de geometría no soportado: ${shapeObj.type}`);
            coordinates = [];
          }

          console.log(`  ✅ Coordenadas finales: ${coordinates.length} puntos`);

          // Paso 3: Crear shape normalizado como LineString
          const shapeNormalizado: RutaShape = {
            type: 'LineString',
            coordinates: coordinates
          };

          return { ...r, shape: shapeNormalizado };
        });

        console.log('\n✅ Rutas normalizadas para el sidebar:', this.rutas);
        console.log(`📍 Total de rutas en el sidebar: ${this.rutas.length}`);
      },
      error: (err: any) => {
        console.error('Error al cargar rutas desde la API:', err);
        this.mostrarToast('Error al cargar rutas desde API', 'warning');
      }
    });
  }

  // -------------------
  // Clicks y creación de rutas
  // -------------------
  private onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.creandoRuta) return;

    const punto = e.latlng;
    this.puntosRuta.push(punto);

    // marcador
    const marker = L.marker(punto, { icon: customMarkerIcon }).addTo(this.map);
    this.puntosMarkers.push(marker);

    // polyline
    if (this.rutaPolyline) {
      this.rutaPolyline.setLatLngs(this.puntosRuta);
    } else {
      this.rutaPolyline = L.polyline(this.puntosRuta, { color: '#16a34a', weight: 4 }).addTo(this.map);
    }

    console.log('Punto agregado:', punto);
    console.log('Lista completa de puntos:', this.puntosRuta);
  }

  // -------------------
  // Mostrar ruta guardada (cuando el usuario hace click en la lista)
  // -------------------
  mostrarRuta(ruta: any): void {
    if (!this.map) return;

    console.log('🗺️ Mostrando ruta:', ruta.nombre_ruta);
    console.log('  - Shape:', ruta.shape);

    // Normalizar shape por si acaso
    let shape: RutaShape | null = null;
    if (!ruta) return;
    if (ruta.shape) {
      if (typeof ruta.shape === 'string') {
        try {
          shape = JSON.parse(ruta.shape) as RutaShape;
        } catch {
          console.error('No se pudo parsear shape en mostrarRuta');
          shape = null;
        }
      } else {
        shape = ruta.shape as RutaShape;
      }
    }

    if (!shape || !Array.isArray(shape.coordinates) || shape.coordinates.length === 0) {
      console.warn('⚠️ La ruta no tiene coordenadas válidas');
      this.mostrarToast('La ruta seleccionada no tiene geometría.', 'warning');
      return;
    }

    console.log(`  ✅ Coordenadas a dibujar: ${shape.coordinates.length} puntos`);

    // Salimos de modo creación para no mezclar
    this.creandoRuta = false;

    // Limpiar capas previas
    this.limpiarSoloCapas();

    // Convertir [lng, lat] a LatLng
    const latLngs: L.LatLng[] = shape.coordinates.map(
      (c: [number, number]) => L.latLng(c[1], c[0])
    );

    console.log(`  📍 LatLngs creados: ${latLngs.length}`);

    // Dibujar polyline de la ruta seleccionada
    this.rutaPolyline = L.polyline(latLngs, { color: '#16a34a', weight: 4 }).addTo(this.map);

    // Añadir marcadores para cada punto (opcional: usar icon pequeño)
    latLngs.forEach((p) => {
      const m = L.marker(p, { icon: customMarkerIcon }).addTo(this.map);
      this.puntosMarkers.push(m);
    });

    console.log(`  ✅ Polyline y ${this.puntosMarkers.length} marcadores añadidos al mapa`);

    // Ajustar vista al bounds
    try {
      this.map.fitBounds(this.rutaPolyline.getBounds(), { padding: [50, 50] });
      console.log('  ✅ Vista ajustada al bounds de la ruta');
    } catch (e) {
      console.warn('fitBounds falló:', e);
    }
  }

  // -------------------
  // Guardar ruta (POST)
  // -------------------
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

    const shape: RutaShape = {
      type: 'LineString',
      coordinates
    };

    const payload: CrearRutaPayload = {
      nombre_ruta: this.nombreRuta,
      perfil_id: this.PERFIL_ID,
      shape
    };

    console.log('======== ENVIANDO RUTA A API /api/rutas ========');
    console.log('Número de puntos:', this.puntosRuta.length);
    console.log('Payload completo:', JSON.stringify(payload, null, 2));

    this.rutasService.crearRuta(payload).subscribe({
      next: (resp: any) => {
        console.log('Respuesta de la API al crear ruta:', resp);

        // Normalizar la respuesta según estructura esperada: resp.data o resp
        const nueva = resp?.data ? resp.data : resp;

        console.log('Ruta guardada:', nueva);
        console.log('Puntos guardados en el backend:', this.puntosRuta.length);
        console.log(' - nombre:', nueva.nombre_ruta);

        // Si la API devuelve shape como string, parsearlo:
        let shapeReturned: RutaShape = { type: 'LineString', coordinates: [] };
        if (nueva?.shape) {
          if (typeof nueva.shape === 'string') {
            try {
              shapeReturned = JSON.parse(nueva.shape) as RutaShape;
            } catch (err) {
              console.error('Error parseando shape devuelto por API:', err);
            }
          } else {
            shapeReturned = nueva.shape as RutaShape;
          }
        }

        // Construir objeto de ruta para el frontend y añadirlo al listado local
        const rutaFront = {
          ...nueva,
          shape: shapeReturned
        };

        // Añadir al listado local para que aparezca en el sidebar sin recargar
        this.rutas.unshift(rutaFront);

        // Mostrar la ruta nueva inmediatamente
        this.limpiarSoloCapas(); // limpiar lo que haya
        this.mostrarRuta(rutaFront);

        this.creandoRuta = false;
        this.nombreRuta = '';

        this.mostrarToast('✅ Ruta guardada y mostrada en el mapa', 'success');
      },
      error: (err: any) => {
        console.error('Error al crear ruta en la API:', err);
        this.mostrarToast('❌ Error al guardar la ruta en la API', 'warning');
        this.creandoRuta = false;
      }
    });
  }

  // -------------------
  // Acciones del modal/crear ruta
  // -------------------
  onCrearRuta(): void {
    this.mostrarModalNombreRuta = true;
    this.nombreRuta = '';
  }

  confirmarNombreRuta(): void {
    if (!this.nombreRuta.trim()) {
      this.mostrarToast('⚠️ La ruta debe tener un nombre válido.', 'warning');
      return;
    }
    this.creandoRuta = true;
    this.mostrarModalNombreRuta = false;
    this.puntosRuta = [];
    this.limpiarSoloCapas();
    this.mostrarToast(`📍 Modo creación activado para "${this.nombreRuta}". Haz clic en el mapa para marcar puntos`, 'success');
  }

  cancelarNombreRuta(): void {
    this.mostrarModalNombreRuta = false;
    this.nombreRuta = '';
  }

  cerrarModalOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cancelarNombreRuta();
    }
  }

  // -------------------
  // Limpiar capas
  // -------------------
  private limpiarSoloCapas(): void {
    if (!this.map) return;

    if (this.rutaPolyline) {
      try { this.map.removeLayer(this.rutaPolyline); } catch {}
      this.rutaPolyline = null;
    }
    this.puntosMarkers.forEach(m => {
      try { this.map.removeLayer(m); } catch {}
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

  // -------------------
  // Otros controles
  // -------------------
  zoomIn(): void {
    if (this.map) this.map.zoomIn();
  }

  zoomOut(): void {
    if (this.map) this.map.zoomOut();
  }

  irDashboard(): void {
    const rol = localStorage.getItem('usuarioRol');
    if (rol === 'Admin' || rol === 'Administrador') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('No tienes permisos para acceder al panel de administración.');
    }
  }
}