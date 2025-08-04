import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Caja } from 'src/app/models/cajas/cajas';
import { CajasService } from 'src/app/services/cajas/cajas.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-edit-cajas',
  templateUrl: './edit-cajas.page.html',
  styleUrls: ['./edit-cajas.page.scss'],
})
export class EditCajasPage implements OnInit {
  cajaCodigo: number | null = null; // Para almacenar el código del cliente

  id: any;
  titulo: any = '';
  loading: boolean = false;

  EditCaja: Caja = {
    codigo: 0,
    nombre: '',
    responsable: '',
    iniciotimbrado: new Date(),
    vencetimbrado: new Date(),
    timbrado: 0,
    factura: 0,
    expedicion: '',
    recibo: 0,
    estado: 1,
    impresoracaja: '',
    createdAt: null,
    updatedAt: null,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private _cajaService: CajasService,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingService: LoadingService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.cajaCodigo = idParam !== null ? Number(idParam) : null;

    if (this.cajaCodigo !== null && this.cajaCodigo > 0) {
      this.titulo = 'Editar Caja N° ' + this.cajaCodigo;
      this.Consultar();
    } else {
      this.titulo = 'Agregar Caja';
    }
  }

  async saveCaja() {
    // Validación de campos obligatorios
    if (
      this.EditCaja.nombre == '' ||
      this.EditCaja.expedicion == '' ||
      this.EditCaja.factura == 0
    ) {
      this.loadingService.present({
        message: 'Los Campos de Nombre, Expedición y Factura son Obligatorios.',
        duration: 300,
      });
      return;
    }

    this.loading = true; // Activa el indicador de carga

    try {
      // Verifica si el código de la caja es mayor a 0
      if (this.EditCaja.codigo > 0) {
        // Si el código es mayor a 0, actualiza la caja utilizando el servicio
        const response = await this._cajaService.updateCaja(this.EditCaja);
      } else {
        // Si el código es 0 o no existe, agrega una nueva caja utilizando el servicio
        const response = await this._cajaService.addCaja(this.EditCaja);
      }

      // Muestra un mensaje de éxito si la operación fue exitosa
      this.loadingService.present({
        message: 'La caja se ha guardado correctamente.',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error al guardar la caja:', error);

      // Muestra un mensaje de error si algo salió mal
      this.loadingService.present({
        message: 'Ocurrió un error al guardar la caja. Intente nuevamente.',
        duration: 3000,
      });
    } finally {
      this.loading = false; // Desactiva el indicador de carga
      this.dismiss(); // Cierra el indicador de carga adicional
    }
  }

  async Consultar() {
    // Mostramos el indicador de carga
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      // Esperamos la respuesta de la consulta de la caja
      if (this.cajaCodigo !== null) {
        const data = await this._cajaService.getCaja(this.cajaCodigo);
        this.EditCaja = data; // Asignamos los datos a EditCaja
      } else {
        throw new Error('El código de la caja es nulo.');
      }
    } catch (error) {
      console.error('Error al consultar la caja:', error);
      // Aquí podrías agregar un mensaje de error si es necesario
    } finally {
      // Desactivamos el indicador de carga
      this.loading = false;
    }
  }

  compareWithEstado = (o1: any, o0: any) => {
    return o1 == o0; // Para comparar '0' y '1'
  };

  async dismiss() {
    await this.navCtrl.pop();
  }
}
