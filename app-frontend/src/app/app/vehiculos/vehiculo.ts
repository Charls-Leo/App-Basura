import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../../services/vehiculo';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculo.html',
  styleUrls: ['./vehiculo.css']
})
export class VehiculosComponent implements OnInit {

  vehiculos: any[] = [];
  perfil_id: string = "a4cdc1ca-5e37-40b1-8a4b-d26237e25142";

  // Modal
  isModalOpen = false;
  modoEditar = false;

  // Formulario visual
  vehicleForm = {
    id: null,
    plate: '',
    brand: '',
    model: '',
    status: 'Activo',
    perfil_id: this.perfil_id
  };

  constructor(private vehiculoService: VehiculosService) {}

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.vehiculoService.listarVehiculos(this.perfil_id).subscribe({
      next: (resp) => {
        this.vehiculos = resp.data.map((v: any) => ({
          id: v.id,
          plate: v.placa,
          brand: v.marca,
          model: v.modelo,
          status: v.activo ? "Activo" : "Inactivo"
        }));
      },
      error: (err) => console.error("Error al listar vehículos:", err)
    });
  }

  // ABRIR MODAL
  openModal(vehicle?: any) {
    this.isModalOpen = true;

    if (vehicle) {
      this.modoEditar = true;
      this.vehicleForm = {
        id: vehicle.id,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        status: vehicle.status,
        perfil_id: this.perfil_id
      };
    } else {
      this.modoEditar = false;
      this.resetForm();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.vehicleForm = {
      id: null,
      plate: '',
      brand: '',
      model: '',
      status: 'Activo',
      perfil_id: this.perfil_id
    };
  }

  formatPlate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 6);
    }
    
    input.value = value;
    this.vehicleForm.plate = value;
  }

  // Guardado universal
  onSubmit() {
    const data = {
      placa: this.vehicleForm.plate,
      marca: this.vehicleForm.brand,
      modelo: this.vehicleForm.model,
      activo: this.vehicleForm.status === "Activo",
      perfil_id: this.perfil_id
    };

    // EDITAR
    if (this.modoEditar && this.vehicleForm.id) {
      this.vehiculoService.actualizarVehiculo(this.vehicleForm.id, data)
        .subscribe({
          next: () => {
            alert("Vehículo actualizado correctamente");
            this.cargarVehiculos();
            this.closeModal();
          }
        });
    }
    // CREAR
    else {
      this.vehiculoService.crearVehiculo(data)
        .subscribe({
          next: () => {
            alert("Vehículo creado correctamente");
            this.cargarVehiculos();
            this.closeModal();
          }
        });
    }
  }

  deleteVehicle(id: string) {
    if (!confirm("¿Seguro que deseas eliminarlo?")) return;

    this.vehiculoService.eliminarVehiculo(id, this.perfil_id)
      .subscribe(() => {
        alert("Vehículo eliminado");
        this.cargarVehiculos();
      });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'Activo': return '#2d7a2e';
      case 'Inactivo': return '#ef4444';
      case 'Mantenimiento':
      case 'En Mantenimiento': return '#f59e0b';
      default: return '#2d7a2e';
    }
  }

  getModalTitle(): string {
    return this.modoEditar ? '✏️ Editar Vehículo' : '➕ Agregar Vehículo';
  }

  getSubmitButtonText(): string {
    return this.modoEditar ? '💾 Guardar Cambios' : '🚛 Crear Vehículo';
  }
}
