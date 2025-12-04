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

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private API_URL = 'https://apirecoleccion.gonzaloandreslucio.com/api';

  constructor(private http: HttpClient) {}

  // GET /api/rutas?perfil_id=...
  // No asumimos formato, devolvemos "any" y normalizamos en el componente
  getRutas(perfilId: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', perfilId);
    return this.http.get(`${this.API_URL}/rutas`, { params });
  }

  // POST /api/rutas
  crearRuta(payload: CrearRutaPayload): Observable<any> {
    return this.http.post(`${this.API_URL}/rutas`, payload);
  }
}
