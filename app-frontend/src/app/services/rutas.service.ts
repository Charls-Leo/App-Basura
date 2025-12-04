import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// GeoJSON LineString
export interface RutaShape {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

// Payload que espera la API del profe
export interface CrearRutaPayload {
  nombre_ruta: string;
  perfil_id: string;
  shape: RutaShape;
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  // Ajusta esta URL según dónde tengas expuesta la API del profe o tu proxy
  private readonly API_URL = 'http://localhost:3000/api/rutas';

  constructor(private http: HttpClient) {}

  crearRuta(payload: CrearRutaPayload): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }
}
