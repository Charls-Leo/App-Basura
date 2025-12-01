import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private routes: L.Polyline[] = [];

  // Centro por defecto: Buenaventura
  private defaultCenter: L.LatLngExpression = [3.8801, -77.0318];
  private defaultZoom = 13;

  constructor() {
    // Corregir rutas de iconos para Angular (usando public/assets/leaflet)
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png'
    });
  }

  /** Inicializa el mapa en el contenedor indicado */
  initMap(
    containerId: string,
    center: L.LatLngExpression = this.defaultCenter,
    zoom: number = this.defaultZoom,
    withDemoData: boolean = true
  ): void {
    // Si ya existe, lo destruimos para crear uno nuevo
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markers = [];
      this.routes = [];
    }

    this.map = L.map(containerId).setView(center, zoom);

    // Capa base OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    if (withDemoData) {
      this.addDemoData();
    }

    // Arreglar tamaño si el contenedor cambia (muy típico en Angular)
    setTimeout(() => this.map!.invalidateSize(), 100);
  }

  getMap(): L.Map | null {
    return this.map;
  }

  centerMap(): void {
    if (this.map) {
      this.map.setView(this.defaultCenter, this.defaultZoom);
    }
  }

  addMarker(
    lat: number,
    lng: number,
    title: string,
    iconType?: 'truck' | 'warning' | 'location'
  ): L.Marker | null {
    if (!this.map) return null;

    const icons = {
      truck: L.divIcon({
        className: 'custom-truck-icon',
        html: '<div style="background:#10b981;color:white;padding:8px;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:18px;">🚛</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      }),
      warning: L.divIcon({
        className: 'custom-warning-icon',
        html: '<div style="background:#f59e0b;color:white;padding:8px;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:18px;">⚠️</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      }),
      location: L.divIcon({
        className: 'custom-location-icon',
        html: '<div style="background:#3b82f6;color:white;padding:8px;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:18px;">📍</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    };

    const marker = L.marker([lat, lng], {
      icon: iconType ? icons[iconType] : undefined,
      title
    }).addTo(this.map);

    marker.bindPopup(`<div style="text-align:center;"><strong>${title}</strong></div>`);
    this.markers.push(marker);
    return marker;
  }

  drawRoute(
    coordinates: L.LatLngExpression[],
    color: string = '#3b82f6',
    label?: string
  ): L.Polyline | null {
    if (!this.map) return null;

    const route = L.polyline(coordinates, {
      color,
      weight: 5,
      opacity: 0.8,
      dashArray: '10, 8',
      lineJoin: 'round'
    }).addTo(this.map);

    if (label) {
      route.bindPopup(`<div style="text-align:center;"><strong>${label}</strong></div>`);
    }

    this.routes.push(route);
    return route;
  }

  showAllRoutes(): void {
    if (!this.map || this.routes.length === 0) return;
    const group = L.featureGroup(this.routes);
    this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
  }

  showActiveVehicles(): void {
    if (!this.map || this.markers.length === 0) return;
    const group = L.featureGroup(this.markers);
    this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
  }

  clearMarkers(): void {
    if (!this.map) return;
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }

  clearRoutes(): void {
    if (!this.map) return;
    this.routes.forEach(r => r.remove());
    this.routes = [];
  }

  clearAll(): void {
    this.clearMarkers();
    this.clearRoutes();
  }

  addCircle(
    lat: number,
    lng: number,
    radius: number,
    color: string = '#3b82f6'
  ): L.Circle | null {
    if (!this.map) return null;
    const circle = L.circle([lat, lng], {
      color,
      fillColor: color,
      fillOpacity: 0.2,
      radius
    }).addTo(this.map);
    return circle;
  }

  /** Capa GeoJSON (pensado para cuando usemos la API del profe) */
  addGeoJsonLayer(geojson: any, color: string = '#ff6600'): void {
    if (!this.map) return;

    const layer = L.geoJSON(geojson, {
      style: {
        color,
        weight: 3,
        opacity: 0.9
      }
    }).addTo(this.map);

    this.map.fitBounds(layer.getBounds());
  }

  invalidateSize(): void {
    if (this.map) {
      setTimeout(() => this.map!.invalidateSize(), 100);
    }
  }

  /** Datos de ejemplo (demo) */
  private addDemoData(): void {
    // Camiones
    this.addMarker(3.8801, -77.0318, 'Camión DEF-456 (M. García)<br>En ruta - 72%', 'truck');
    this.addMarker(3.8951, -77.0218, 'Camión ABC-123<br>Zona Norte', 'truck');
    this.addMarker(3.8651, -77.0418, 'Camión GHI-789<br>Zona Sur', 'truck');

    // Alertas
    this.addMarker(3.8881, -77.0288, 'Retraso por lluvia<br>Zona Centro', 'warning');

    // Puntos de recolección
    this.addMarker(3.8751, -77.0368, 'Punto de Recolección 1', 'location');
    this.addMarker(3.8901, -77.0268, 'Punto de Recolección 2', 'location');

    // Rutas demo
    const rutaNorte: L.LatLngExpression[] = [
      [3.8801, -77.0318],
      [3.8851, -77.0288],
      [3.8901, -77.0268],
      [3.8951, -77.0218]
    ];
    this.drawRoute(rutaNorte, '#10b981', 'Ruta Norte');

    const rutaSur: L.LatLngExpression[] = [
      [3.8801, -77.0318],
      [3.8751, -77.0368],
      [3.8701, -77.0388],
      [3.8651, -77.0418]
    ];
    this.drawRoute(rutaSur, '#3b82f6', 'Ruta Sur');

    const rutaCentro: L.LatLngExpression[] = [
      [3.8801, -77.0318],
      [3.8831, -77.0298],
      [3.8861, -77.0278],
      [3.8881, -77.0288]
    ];
    this.drawRoute(rutaCentro, '#f59e0b', 'Ruta Centro (Retrasada)');
  }

  /** GANCHO para futuro: cargar rutas reales desde API en formato GeoJSON */
  setRoutesFromApiGeoJson(geojson: any): void {
    this.clearAll();
    this.addGeoJsonLayer(geojson);
  }
}
