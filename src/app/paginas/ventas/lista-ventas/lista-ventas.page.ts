import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ListaVenta } from 'src/app/models/ventas/lista-ventas';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ListaVentasService } from 'src/app/services/ventas/lista-ventas.service';
import { DetalleVentaPage } from '../detalle-venta/detalle-venta.page';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.page.html',
  styleUrls: ['./lista-ventas.page.scss'],
})
export class ListaVentasPage implements OnInit {
  totalpedido: number = 0;
  fechainicio: any;
  fechafinal: any;
  ListaVenta: any = [];
  constructor(
    private listaventasService: ListaVentasService,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    public router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    const listaVenta: ListaVenta = {
      formatofactura: '',
      idventa: 0,
      creferencia: '',
      fecha: new Date(),
      factura: '',
      vencimiento: new Date(),
      cliente: 0,
      nombrecliente: '',
      sucursal: 0,
      moneda: 0,
      comprobante: 0,
      cotizacion: 0,
      vendedor: 0,
      caja: 0,
      supago: 0,
      sucambio: 0,
      exentas: 0,
      gravadas10: 0,
      gravadas5: 0,
      totalneto: 0,
      cuotas: 0,
      vencimientotimbrado: new Date(),
      nrotimbrado: 0,
      idusuario: 0,
    };
    this.fechainicio = new Date().toISOString().substring(0, 10);
    this.fechafinal = new Date().toISOString().substring(0, 10);
    this.Consultar();
  }

  async Consultar() {
    this.totalpedido = 0;

    // Mostrar mensaje de carga
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      // Llamada al servicio con el token y parámetros necesarios
      const data = await this.listaventasService.getListaVenta(
        parseInt(localStorage.getItem('idusuario') || '0', 10),
        this.fechainicio,
        this.fechafinal
      );

      // Cargar los datos en el array
      this.ListaVenta = data;
      console.log(data);

      // Calcular el total
      let totalRow = this.ListaVenta.length;
      totalRow -= 1;
      for (let i = 0; i <= totalRow; i++) {
        this.totalpedido += parseFloat(this.ListaVenta[i].totalneto);
      }
    } catch (err) {
      // Manejo de errores
      console.error('Error al cargar la lista de ventas:', err);
      // Aquí puedes mostrar un mensaje al usuario o hacer algo más
    } finally {
      // Finalización de la carga
      this.loadingService.dismiss();
    }
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  async OpenEditVenta(idVenta: number) {
    const modal = await this.modalCtrl.create({
      component: DetalleVentaPage,
      animated: true,
      mode: 'md',
      backdropDismiss: false,
      cssClass: 'editVenta-modal',
      componentProps: {
        ventaNumero: idVenta,
      },
    });
    return await modal.present();
  }
}
