import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  private API_URL = 'https://apirecoleccion.gonzaloandreslucio.com/api';

  constructor(private http: HttpClient) {}

  // 🔹 LISTAR vehículos por perfil
  listarVehiculos(perfil_id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/vehiculos?perfil_id=${perfil_id}`);
  }

  // 🔹 CREAR un vehículo nuevo
  crearVehiculo(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }
}
