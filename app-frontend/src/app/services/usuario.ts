import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerUsuarios() {
    return this.http.get<any[]>(`${this.api}/usuarios`);
  }

  registrarUsuario(usuario: any) {
    return this.http.post(`${this.api}/usuarios/registro`, usuario);
  }

  loginUsuario(datos: any) {
    return this.http.post(`${this.api}/usuarios/login`, datos);
  }
}