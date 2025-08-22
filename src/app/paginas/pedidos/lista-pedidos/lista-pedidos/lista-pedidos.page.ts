import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
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

  async Consultar() {
    this.totalpedido = 0; // Reiniciamos el total del pedido

    // Mostramos el loading
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      // Llamamos al servicio de lista de pedidos y obtenemos la respuesta de manera asíncrona
      const data = await this.listapedidosService.getListaPedidos(
        parseInt(localStorage.getItem('idusuario') || '0', 10),
        this.fechainicio,
        this.fechafinal
      );

      // Cargamos la respuesta en el array ListaPedido
      this.ListaPedido = data;

      // Calculamos el total del pedido
      let totalRow = this.ListaPedido.length;
      totalRow -= 1;

      for (let i = 0; i <= totalRow; i++) {
        this.totalpedido += parseFloat(this.ListaPedido[i].totalneto);
      }
    } catch (err) {
      console.error('Error al obtener la lista de pedidos:', err);
      // Aquí puedes agregar manejo de errores, como mostrar un mensaje de alerta si lo deseas
      alert(
        'Ocurrió un error al cargar la lista de pedidos. Intenta nuevamente.'
      );
    } finally {
      // Cerramos el loading en todos los casos
      this.loadingService.dismiss();
    }
  }

  async dismiss() {
    this.router.navigate(['/menu']);
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  async OpenEditPedido(pedidoNumero: number) {
    await this.navCtrl.navigateForward(`/detalle-pedido/${pedidoNumero}`);
  }


}
