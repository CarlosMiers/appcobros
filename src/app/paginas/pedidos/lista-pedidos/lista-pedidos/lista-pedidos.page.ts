import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { DetallePedidoPage } from '../../detalle-pedido/detalle-pedido/detalle-pedido.page';
import { ListaPedido } from '../../../../models/pedidos/lista-pedidos';
import { ListaPedidosService } from 'src/app/services/pedidos/lista-pedidos.service';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.page.html',
  styleUrls: ['./lista-pedidos.page.scss'],
})
export class ListaPedidosPage implements OnInit {
  totalpedido: number = 0;
  fechainicio: any;
  fechafinal: any;
  ListaPedido: any = [];
  constructor(
    private listapedidosService: ListaPedidosService,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    public router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    const listadoPedido: ListaPedido = {
      numero: 0,
      fecha: new Date(),
      comprobante: 0,
      cliente: 0,
      nombrecliente: '',
      codusuario: 0,
      totalneto: 0,
    };
    this.fechainicio = new Date().toISOString().substring(0, 10);
    this.fechafinal = new Date().toISOString().substring(0, 10);
    this.Consultar();
  }

  Consultar() {
    this.totalpedido = 0;
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    this.listapedidosService
      .getListaPedidos(parseInt(localStorage.getItem('idusuario') || '0', 10), this.fechainicio, this.fechafinal)
      .subscribe(
        (data) => {
          //CARGAMOS CONSULTA EN EL ARRAY
          this.ListaPedido = data;
          console.log(data);
          let totalRow = this.ListaPedido.length;
          totalRow -= 1;
          for (let i = 0; i <= totalRow; i++) {
            this.totalpedido += parseFloat(this.ListaPedido[i].totalneto);
          }
        },
        (err) => {}
      );
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  async OpenEditPedido(pedidoNumero: number) {
    const modal = await this.modalCtrl.create({
      component: DetallePedidoPage,
      animated: true,
      mode: 'md',
      backdropDismiss: false,
      cssClass: 'editPedido-modal',
      componentProps: {
        pedidoNumero: pedidoNumero,
      },
    });
    return await modal.present();
  }
}
