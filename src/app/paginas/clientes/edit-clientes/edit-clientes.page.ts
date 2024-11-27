import { Component, Input, OnInit} from '@angular/core';
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
 
  @Input() clienteCodigo: number=0;  // Recibe el parámetro 'codigo' desde el modal

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
    public formBuilder: FormBuilder,
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

  saveCliente() {
    if (
      this.EditCliente.nombre == '' ||
      this.EditCliente.cedula == '' ||
      this.EditCliente.telefono == ''
    ) {
      this.loadingService.present({
        message: 'Los Campos de Nombre, Cédula y Télefono son Obligatorios.',
        duration: 300,
      });
      return;
    }

    this.loading = true;
    if (this.EditCliente.codigo > 0) {
      this._clienteService.updateCliente(this.EditCliente).subscribe(
        (response) => {
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      this._clienteService.AddCliente(this.EditCliente).subscribe(
        (response) => {
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    }
    this.dismiss();
  }

  Consultar() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    this._clienteService.getCliente(this.clienteCodigo).subscribe(
      (data) => {
        this.EditCliente = data;
        console.log(this.EditCliente);
      },
      (err) => {}
    );
    this.loading = false;
    this.dismiss();
  }

  compareWithSexo = (o1: any, o2: any) => {
    return o1 == o2; // Para comparar '1' y '2'
  };

  compareWithEstado = (o1: any, o0: any) => {
    return o1 == o0; // Para comparar '0' y '1'
  };

  async dismiss() {
    return await this.modalCtrl.dismiss();
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
