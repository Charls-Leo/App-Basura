import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../../services/vehiculo';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculo.html',
})
export class VehiculosComponent implements OnInit {

  vehiculos: any[] = [];
  perfil_id: string = "a4cdc1ca-5e37-40b1-8a4b-d26237e25142";

  // Formulario
  vehiculoForm = {
    id: null,
    placa: '',
    marca: '',
    modelo: '',
    activo: true,
    perfil_id: this.perfil_id
  };

  modoEditar = false;

  constructor(private vehiculoService: VehiculosService) {}

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.vehiculoService.listarVehiculos(this.perfil_id).subscribe({
      next: (resp) => {
        this.vehiculos = resp.data;
      },
      error: (err) => console.error("Error al listar vehículos:", err)
    });
  }

  // 🔹 PREPARAR FORM PARA CREAR
  nuevoVehiculo() {
    this.modoEditar = false;
    this.vehiculoForm = {
      id: null,
      placa: '',
      marca: '',
      modelo: '',
      activo: true,
      perfil_id: this.perfil_id
    };
  }

  // 🔹 CARGAR DATOS PARA EDITAR
  editarVehiculo(v: any) {
    this.modoEditar = true;
    this.vehiculoForm = {
      id: v.id,
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      activo: v.activo,
      perfil_id: this.perfil_id
    };
  }

  // 🔹 GUARDAR (CREAR O EDITAR)
  guardarVehiculo() {
    if (this.modoEditar && this.vehiculoForm.id) {
      // EDITAR
      this.vehiculoService.actualizarVehiculo(this.vehiculoForm.id, this.vehiculoForm)
        .subscribe({
          next: () => {
            alert("Vehículo actualizado");
            this.cargarVehiculos();
            this.nuevoVehiculo();
          },
          error: (err) => console.error("Error al editar:", err)
        });

    } else {
      // CREAR
      this.vehiculoService.crearVehiculo(this.vehiculoForm)
        .subscribe({
          next: () => {
            alert("Vehículo creado");
            this.cargarVehiculos();
            this.nuevoVehiculo();
          },
          error: (err) => console.error("Error al crear:", err)
        });
    }
  }

  // 🔹 ELIMINAR
  eliminarVehiculo(id: string) {
    if (!confirm("¿Seguro que deseas eliminarlo?")) return;

    this.vehiculoService.eliminarVehiculo(id, this.perfil_id).subscribe({
      next: () => {
        alert("Vehículo eliminado");
        this.cargarVehiculos();
      },
      error: (err) => console.error("Error al eliminar:", err)
    });
  }
}
