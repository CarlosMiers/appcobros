import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { Caja } from 'src/app/models/cajas/cajas';
import { CajasService } from 'src/app/services/cajas/cajas.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-edit-cajas',
  templateUrl: './edit-cajas.page.html',
  styleUrls: ['./edit-cajas.page.scss'],
})
export class EditCajasPage implements OnInit {
  cajaCodigo: number | null = null;
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
      !this.EditCaja.nombre ||
      !this.EditCaja.expedicion ||
      this.EditCaja.timbrado === 0 ||
      this.EditCaja.factura === 0
    ) {
      this.loadingService.present({
        message: 'Los campos de Nombre, N° Timbrado, Expedición y Factura son obligatorios.',
        duration: 3000,
      });
      return;
    }

    this.loading = true; // Activa el indicador de carga

    try {
      if (this.EditCaja.codigo > 0) {
        await this._cajaService.updateCaja(this.EditCaja);
      } else {
        await this._cajaService.addCaja(this.EditCaja);
      }

      this.loadingService.present({
        message: 'La caja se ha guardado correctamente.',
        duration: 2000,
      });
      this.dismiss();
    } catch (error) {
      console.error('Error al guardar la caja:', error);
      this.loadingService.present({
        message: 'Ocurrió un error al guardar la caja. Intente nuevamente.',
        duration: 3000,
      });
    } finally {
      this.loading = false;
    }
  }

  async Consultar() {
    await this.loadingService.present({ message: 'Aguarde un Momento.' });

    try {
      if (this.cajaCodigo !== null) {
        const data = await this._cajaService.getCaja(this.cajaCodigo);
        this.EditCaja = data;
      }
    } catch (error) {
      console.error('Error al consultar la caja:', error);
    } finally {
      this.loading = false;
      this.loadingService.dismiss();
    }
  }

  compareWithEstado = (o1: any, o0: any) => {
    return o1 == o0;
  };

  async dismiss() {
    await this.navCtrl.pop();
  }
}