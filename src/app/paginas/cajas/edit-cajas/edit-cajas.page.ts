import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Caja } from 'src/app/models/cajas/cajas';
import { CajasService } from 'src/app/services/cajas/cajas.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-edit-cajas',
  templateUrl: './edit-cajas.page.html',
  styleUrls: ['./edit-cajas.page.scss'],
})
export class EditCajasPage implements OnInit {

  @Input() cajaCodigo: number = 0; // Recibe el parámetro 'codigo' desde el modal

  id: any;
  titulo: any = '';
  loading: boolean = false;

  EditCaja: Caja = {
    codigo: 0,
    nombre: '',
    responsable: '',
    iniciotimbrado: new Date(),
    vencetimbrado: new Date(),
    timbrado:0,
    factura: 0,
    expedicion: '',
    recibo: 0,  
    estado: 1,
    impresoracaja: '',
    createdAt: null,
    updatedAt: null,
  };

  constructor(
    private navCtrl: NavController,
    private _cajaService: CajasService,
    private router: Router,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingService: LoadingService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    if (this.cajaCodigo > 0) {
      this.titulo = 'Editar Cliente N° ' + this.cajaCodigo;
      this.Consultar();
    } else {
      this.titulo = 'Agregar Caja';
    }
  }

  saveCaja() {
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

    this.loading = true;
    if (this.EditCaja.codigo > 0) {
      this._cajaService.updateCaja(this.EditCaja).subscribe(
        (response) => {
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      this._cajaService.AddCaja(this.EditCaja).subscribe(
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

    this._cajaService.getCaja(this.cajaCodigo).subscribe(
      (data) => {
        this.EditCaja = data;
        console.log(this.EditCaja);
      },
      (err) => {}
    );
    this.loading = false;
 
  }

  compareWithEstado = (o1: any, o0: any) => {
    return o1 == o0; // Para comparar '0' y '1'
  };

  async dismiss() {
    await this.modalCtrl.dismiss({}); // Devuelve un valor
  }

 
}
