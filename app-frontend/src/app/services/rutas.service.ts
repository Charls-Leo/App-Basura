import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// GeoJSON LineString que nosotros enviamos al crear ruta
export interface RutaShape {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

export interface CrearRutaPayload {
  nombre_ruta: string;
  perfil_id: string;
  shape: RutaShape;
}

// Interfaz para registrar posición
export interface RegistrarPosicionPayload {
  lat: number;
  lon: number;
  perfil_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private API_URL = 'https://apirecoleccion.gonzaloandreslucio.com/api';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/rutas?perfil_id=...
   * Obtiene todas las rutas del perfil
   */
  getRutas(perfilId: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', perfilId);
    return this.http.get(`${this.API_URL}/rutas`, { params });
  }

  /**
   * POST /api/rutas
   * Crea una nueva ruta
   */
  crearRuta(payload: CrearRutaPayload): Observable<any> {
    return this.http.post(`${this.API_URL}/rutas`, payload);
  }

  /**
   * POST /api/recorridos/{recorrido}/posiciones
   * Registra una posición del vehículo durante el recorrido
   */
  registrarPosicion(recorridoId: string, payload: RegistrarPosicionPayload): Observable<any> {
    return this.http.post(
      `${this.API_URL}/recorridos/${recorridoId}/posiciones`,
      payload
    );
  }

  /**
   * GET /api/recorridos/{recorrido}/posiciones?perfil_id=...
   * Obtiene todas las posiciones guardadas de un recorrido
   */
  getPosiciones(recorridoId: string, perfilId: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', perfilId);
    return this.http.get(
      `${this.API_URL}/recorridos/${recorridoId}/posiciones`,
      { params }
    );
  }
}