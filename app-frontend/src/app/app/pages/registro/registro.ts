import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosService, RegistroRequest } from '../../../services/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,   
  imports: [FormsModule, CommonModule], 
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  registroData: RegistroRequest = {
    email: '',
    password: '',
    nombre: '',
    rol: ''
  };

  mensaje: string = '';
  cargando: boolean = false;

  constructor(private usuariosService: UsuariosService, private router: Router) { {
}

  }
  // dentro de la clase RegistroComponent
  registrar() {
  console.log("🚀 Método registrar() llamado");

  this.mensaje = '';
  this.cargando = true;

  console.log("📤 Enviando datos al backend:", this.registroData);

  this.usuariosService.registroUsuario(this.registroData).subscribe({
    next: (res) => {
      console.log("✔ RESPUESTA DEL BACKEND:", res);
      this.mensaje = 'Registro exitoso ✔';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    },
    error: (err) => {
      console.error("❌ ERROR DEL BACKEND:", err);
      this.mensaje = 'Error al registrar usuario';
    },
    complete: () => {
      this.cargando = false;
      console.log("⏳ Petición completada");
    }
  });
  }
  irALogin() {
  this.router.navigate(['/login']);
  }

}

