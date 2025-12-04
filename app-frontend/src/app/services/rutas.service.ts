import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// GeoJSON LineString
export interface RutaShape {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

export interface CrearRutaPayload {
  nombre_ruta: string;
  perfil_id: string;
  shape: RutaShape;
}


export interface RutaDTO extends CrearRutaPayload {
  id: number; // el id que pusimos en el backend
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  // POR AHORA usamos el backend local
  private readonly API_URL = 'http://localhost:3000/api/rutas';

  constructor(private http: HttpClient) {}

  crearRuta(payload: CrearRutaPayload): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }

  // Nuevo: obtener todas las rutas
  getRutas(): Observable<RutaDTO[]> {
    return this.http.get<RutaDTO[]>(this.API_URL);
  }
}
