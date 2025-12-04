import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculosService } from '../../services/vehiculo';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculo.html', // ← Usar archivo HTML separado
})
export class VehiculosComponent implements OnInit {

  vehiculos: any[] = [];
  perfil_id: string = "a4cdc1ca-5e37-40b1-8a4b-d26237e25142"; // TU PERFIL REAL

  constructor(private vehiculoService: VehiculosService) {}

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.vehiculoService.listarVehiculos(this.perfil_id).subscribe({
      next: (resp: any) => {
        console.log("Vehículos recibidos:", resp);
        this.vehiculos = resp.data;
      },
      error: (err: any) => {
        console.error("Error al cargar vehículos:", err);
      }
    });
  }
}
