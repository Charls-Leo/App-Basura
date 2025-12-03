import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProfesorApiService {

  private baseUrl = environment.PROF_API_BASE_URL;
  private perfilId = environment.PROF_PERFIL_ID;

  constructor(private http: HttpClient) {}

  // ===================== CALLES =====================
  getCalles() {
    return this.http.get(`${this.baseUrl}/calles`);
  }

  getCalleById(id: string) {
    return this.http.get(`${this.baseUrl}/calles/${id}`);
  }

  // ===================== VEHÍCULOS =====================
  getVehiculos() {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get(`${this.baseUrl}/vehiculos`, { params });
  }

  getVehiculoById(id: string) {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get(`${this.baseUrl}/vehiculos/${id}`, { params });
  }

  createVehiculo(data: any) {
    return this.http.post(`${this.baseUrl}/vehiculos`, data);
  }

  updateVehiculo(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/vehiculos/${id}`, data);
  }

  deleteVehiculo(id: string) {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.delete(`${this.baseUrl}/vehiculos/${id}`, { params });
  }

  // ===================== RUTAS =====================
  getRutas() {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get(`${this.baseUrl}/rutas`, { params });
  }

  getRutaById(id: string) {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get(`${this.baseUrl}/rutas/${id}`, { params });
  }

  createRuta(data: any) {
    return this.http.post(`${this.baseUrl}/rutas`, data);
  }

  // ===================== RECORRIDOS =====================
  getMisRecorridos() {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get(`${this.baseUrl}/misrecorridos`, { params });
  }

  iniciarRecorrido(data: any) {
    return this.http.post(`${this.baseUrl}/recorridos/iniciar`, data);
  }

  finalizarRecorrido(recorridoId: string) {
    return this.http.post(`${this.baseUrl}/recorridos/${recorridoId}/finalizar`, {
      perfil_id: this.perfilId
    });
  }

  // ===================== POSICIONES =====================
  getPosiciones(recorridoId: string) {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get(`${this.baseUrl}/recorridos/${recorridoId}/posiciones`, { params });
  }

  registrarPosicion(recorridoId: string, lat: number, lon: number) {
    return this.http.post(`${this.baseUrl}/recorridos/${recorridoId}/posiciones`, {
      lat,
      lon,
      perfil_id: this.perfilId
    });
  }
}
