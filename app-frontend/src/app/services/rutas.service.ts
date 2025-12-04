import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// GeoJSON LineString
export interface RutaShape {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

// Payload que mandamos al backend al crear
export interface CrearRutaPayload {
  nombre_ruta: string;
  perfil_id: string;
  shape: RutaShape;
}

// Lo que nos devuelve el backend cuando listamos rutas
export interface RutaDTO extends CrearRutaPayload {
  id: number; // el id que pusimos en el backend
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  private readonly API_URL = 'https://apirecoleccion.gonzaloandreslucio.com/api/rutas';

  constructor(private http: HttpClient) {}

  crearRuta(payload: CrearRutaPayload): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }

  // Nuevo: obtener todas las rutas
  getRutas(): Observable<RutaDTO[]> {
    return this.http.get<RutaDTO[]>(this.API_URL);
  }
}
