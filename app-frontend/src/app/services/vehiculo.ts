import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  private API_URL = 'https://apirecoleccion.gonzaloandreslucio.com/api/vehiculos';

  constructor(private http: HttpClient) {}

  // 🔹 LISTAR vehículos por perfil
  listarVehiculos(perfil_id: string): Observable<any> {
    return this.http.get(`${this.API_URL}?perfil_id=${perfil_id}`);
  }

  // 🔹 CREAR vehículo
  crearVehiculo(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}`, data);
  }

  // 🔹 OBTENER UN VEHÍCULO por ID
  obtenerVehiculo(id: string, perfil_id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}?perfil_id=${perfil_id}`);
  }

  // 🔹 EDITAR vehículo
  actualizarVehiculo(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  // 🔹 ELIMINAR vehículo
  eliminarVehiculo(id: string, perfil_id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}?perfil_id=${perfil_id}`);
  }
}
