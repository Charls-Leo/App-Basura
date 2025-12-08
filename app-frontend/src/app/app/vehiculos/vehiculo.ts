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

  // Modal de crear / editar vehículo
  isModalOpen = false;
  modoEditar = false;

  // Formulario visual
  vehicleForm = {
    id: null as string | null,
    plate: '',
    brand: '',
    model: '',
    status: 'Activo',
    perfil_id: this.perfil_id
  };

  // Modal de feedback (éxito / info / error grande en el centro)
  feedbackVisible = false;
  feedbackTitle = '';
  feedbackMessage = '';
  feedbackIcon = '✅';

  constructor(private vehiculoService: VehiculosService) {}

  ngOnInit() {
    this.cargarVehiculos();
  }

  private openFeedback(title: string, message: string, icon: string = '✅') {
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackIcon = icon;
    this.feedbackVisible = true;
  }

  closeFeedback() {
    this.feedbackVisible = false;
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
      error: (err) => {
        console.error("Error al listar vehículos:", err);
        this.openFeedback('Error', 'Ocurrió un error al cargar los vehículos.', '⚠️');
      }
    });
  }

  // ABRIR MODAL CREAR / EDITAR
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
            this.cargarVehiculos();
            this.closeModal();
            this.openFeedback(
              'Vehículo actualizado',
              'El vehículo se actualizó correctamente.',
              '✅'
            );
          },
          error: () => {
            this.openFeedback(
              'Error al actualizar',
              'Ocurrió un error al actualizar el vehículo.',
              '⚠️'
            );
          }
        });
    }
    // CREAR
    else {
      this.vehiculoService.crearVehiculo(data)
        .subscribe({
          next: () => {
            this.cargarVehiculos();
            this.closeModal();
            this.openFeedback(
              'Vehículo creado',
              'El vehículo se creó correctamente.',
              '🚛'
            );
          },
          error: () => {
            this.openFeedback(
              'Error al crear',
              'Ocurrió un error al crear el vehículo.',
              '⚠️'
            );
          }
        });
    }
  }

  deleteVehicle(id: string) {
    if (!confirm("¿Seguro que deseas eliminarlo?")) return;

    this.vehiculoService.eliminarVehiculo(id, this.perfil_id)
      .subscribe({
        next: () => {
          this.cargarVehiculos();
          this.openFeedback(
            'Vehículo eliminado',
            'El vehículo fue eliminado correctamente.',
            '🗑️'
          );
        },
        error: () => {
          this.openFeedback(
            'Error al eliminar',
            'Ocurrió un error al eliminar el vehículo.',
            '⚠️'
          );
        }
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
