import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalController,
  NavController,
  ToastController,
  ActionSheetController, // Importamos el ActionSheetController
} from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
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
    private toast: ToastController,
    private actionSheetCtrl: ActionSheetController // Inyectamos el ActionSheetController
  ) {}

  ngOnInit() {
    this.fechainicio = new Date().toISOString().substring(0, 10);
    this.fechafinal = new Date().toISOString().substring(0, 10);
    this.Consultar();
  }

  async Consultar() {
    this.totalpedido = 0;
    this.ListaPedido = [];

    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      const data = await this.listapedidosService.getListaPedidos(
        parseInt(localStorage.getItem('idusuario') || '0', 10),
        this.fechainicio,
        this.fechafinal
      );

      this.ListaPedido = data;

      // Cálculo del total más eficiente
      this.totalpedido = this.ListaPedido.reduce((sum: number, pedido: any) => sum + parseFloat(pedido.totalneto), 0);

    } catch (err) {
      console.error('Error al obtener la lista de pedidos:', err);
      // Aquí podrías mostrar un toast de error si lo deseas
    } finally {
      this.loadingService.dismiss();
    }
  }

  async dismiss() {
    this.router.navigate(['/menu']);
  }

  async OpenEditPedido(pedidoNumero: number) {
    await this.navCtrl.navigateForward(`/detalle-pedido/${pedidoNumero}`);
  }

  /**
   * Muestra el menú de acciones al deslizar un item.
   * Por ahora, solo es un placeholder para mantener la misma funcionalidad que ventas.
   * Se pueden agregar más acciones aquí, como anular o compartir el pedido.
   * @param numeroPedido El número del pedido seleccionado.
   */
  async presentActionSheet(numeroPedido: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de Pedido',
      buttons: [
        {
          text: 'Anular',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            // Lógica para anular el pedido
            console.log(`Anular pedido: ${numeroPedido}`);
          },
        },
        {
          text: 'Compartir',
          icon: 'share',
          handler: () => {
            // Lógica para compartir el pedido
            console.log(`Compartir pedido: ${numeroPedido}`);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
          },
        },
      ],
    });
    await actionSheet.present();
  }
}