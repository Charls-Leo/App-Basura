import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {

  submitForm(form: any) {
    const { firstName, lastName, email, password, confirmPassword, terms } = form.value;

    if (password !== confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    if (!terms) {
      alert('⚠️ Debes aceptar los términos y condiciones.');
      return;
    }

    alert(`¡Bienvenido a EcoRecolecta, ${firstName}! 🌱\n\nCuenta creada exitosamente.\nEmail: ${email}\n\n(Este es un registro de frontend)`);
    form.reset();
  }
}
