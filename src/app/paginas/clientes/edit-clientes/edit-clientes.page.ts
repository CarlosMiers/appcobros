import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Cliente } from 'src/app/models/clientes/cliente';

@Component({
  selector: 'app-edit-clientes',
  templateUrl: './edit-clientes.page.html',
  styleUrls: ['./edit-clientes.page.scss'],
})
export class EditClientesPage implements OnInit {
  @Input() clienteCodigo: number = 0; // Recibe el parámetro 'codigo' desde el modal

  id: any;
  titulo: any = '';
  loading: boolean = false;

  EditCliente: Cliente = {
    codigo: 0,
    nombre: '',
    ruc: '',
    cedula: '',
    fechanacimiento: new Date(),
    direccion: '',
    telefono: '',
    mail: '',
    sexo: 1,
    estado: 1,
    latitud: '',
    longitud: '',
    createdAt: null,
    updatedAt: null,
  };

  constructor(
    private _clienteService: ClientesService,
    private geolocation: Geolocation,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingService: LoadingService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getPosicionGlobal();
    if (this.clienteCodigo > 0) {
      this.titulo = 'Editar Cliente N° ' + this.clienteCodigo;
      this.Consultar();
    } else {
      this.titulo = 'Agregar Cliente';
    }
  }

  async saveCliente() {
    if (
      this.EditCliente.nombre == '' ||
      this.EditCliente.cedula == '' ||
      this.EditCliente.telefono == ''
    ) {
      this.loadingService.present({
        message: 'Los Campos de Nombre, Cédula y Teléfono son Obligatorios.',
        duration: 300,
      });
      return;
    }

    this.loading = true;

    try {
      if (this.EditCliente.codigo > 0) {
        // Si el código es mayor a 0, actualiza el cliente
        await this._clienteService.updateCliente(this.EditCliente);
      } else {
        // Si el código es 0 o no existe, agrega un nuevo cliente
        await this._clienteService.addCliente(this.EditCliente);
      }
      this.loading = false;
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      this.loading = false;
    } finally {
      this.dismiss(); // Cierra el modal o pantalla
    }
  }

  async Consultar() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      // Usamos el servicio para obtener los datos del cliente
      const data = await this._clienteService.getCliente(this.clienteCodigo);
      this.EditCliente = data; // Asigna los datos del cliente
      console.log(this.EditCliente);
    } catch (error) {
      console.error('Error al consultar el cliente:', error);
    } finally {
      this.loading = false;
    }
  }

  compareWithSexo = (o1: any, o2: any) => {
    return o1 == o2; // Para comparar '1' y '2'
  };

  compareWithEstado = (o1: any, o0: any) => {
    return o1 == o0; // Para comparar '0' y '1'
  };

  async dismiss() {
    await this.modalCtrl.dismiss({}); // Devuelve un valor
  }

  getPosicionGlobal() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        resp.coords.latitude, resp.coords.longitude;
        this.EditCliente.latitud = resp.coords.latitude.toString();
        this.EditCliente.longitud = resp.coords.longitude.toString();
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }
}
