import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as L from 'leaflet';
import 'leaflet-draw'; // añade el plugin a L, pero sin tipos TS

import { ProfesorApiService } from '../../../services/ProfeAPI.service';

@Component({
  selector: 'app-crear-ruta',
  standalone: true,
  templateUrl: './crearRuta.html',
  styleUrls: ['./crearRuta.css'],
  imports: [CommonModule, FormsModule]
})
export class CrearRutaComponent implements AfterViewInit {

  map!: L.Map;
  drawnItems = new L.FeatureGroup();
  currentLatLngs: L.LatLng[] = [];

  // La seguimos teniendo por si luego la usas en otro sitio
  nombreRuta: string = '';

  constructor(
    private profesorApi: ProfesorApiService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.initDrawingTools();
  }

  private initMap(): void {
    this.map = L.map('map-crear-ruta', {
      center: [3.8773, -77.0277], // Buenaventura
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.drawnItems.addTo(this.map);
  }

  private initDrawingTools(): void {
    const drawControl = new (L as any).Control.Draw({
      draw: {
        polyline: true,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.drawnItems
      }
    });

    this.map.addControl(drawControl);

    this.map.on('draw:created', (e: any) => {
      this.drawnItems.clearLayers();

      const layer = e.layer as L.Polyline;
      this.drawnItems.addLayer(layer);

      const latlngs = layer.getLatLngs() as L.LatLng[];
      this.currentLatLngs = latlngs;
      console.log('Puntos de la ruta dibujada:', this.currentLatLngs);
    });

    this.map.on('draw:edited', (e: any) => {
      e.layers.eachLayer((layer: L.Polyline) => {
        const latlngs = layer.getLatLngs() as L.LatLng[];
        this.currentLatLngs = latlngs;
        console.log('Ruta editada, nuevos puntos:', this.currentLatLngs);
      });
    });
  }

  private buildGeoJSONFromLatLngs(): any | null {
    if (!this.currentLatLngs || this.currentLatLngs.length < 2) {
      return null;
    }

    const coordinates = this.currentLatLngs.map(p => [p.lng, p.lat]);

    return {
      type: 'LineString',
      coordinates: coordinates
    };
  }

  guardarRuta(): void {
    // Si algún día llamas a esta función desde otro botón,
    // le ponemos un nombre por defecto si está vacío.
    const nombreLimpio = this.nombreRuta.trim() || 'Ruta sin nombre';

    const shape = this.buildGeoJSONFromLatLngs();
    if (!shape) {
      alert('Debes dibujar una ruta con al menos 2 puntos antes de guardar.');
      return;
    }

    this.profesorApi.createRuta(nombreLimpio, shape)
      .subscribe({
        next: (resp: any) => {
          console.log('Ruta creada en API del profesor:', resp);
          alert('Ruta creada correctamente en la API del profesor.');
        },
        error: (err) => {
          console.error('Error al crear ruta en API del profesor:', err);
          alert('Ocurrió un error al crear la ruta.');
        }
      });
  }
}
