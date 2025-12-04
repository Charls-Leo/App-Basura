// profesor-api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProfesorApiService {

  private baseUrl = environment.PROF_API_BASE_URL;
  private perfilId = environment.PERFIL_ID;

  constructor(private http: HttpClient) {}

  // === MÉTODO QUE YA USABAS EN USUARIOS ===
  getCalles() {
    // Si el profe exige perfil_id como query param:
    return this.http.get(`${this.baseUrl}/calles`, {
      params: {
        perfil_id: this.perfilId
      }
    });

    // Si en tu versión anterior lo tenías SIN params, deja esto:
    // return this.http.get(`${this.baseUrl}/calles`);
  }

  // === NUEVO MÉTODO PARA CREAR RUTAS ===
  createRuta(nombreRuta: string, shape: any) {
    const body = {
      nombre_ruta: nombreRuta,
      perfil_id: this.perfilId,
      shape: shape
    };

    return this.http.post(`${this.baseUrl}/rutas`, body);
  }
}