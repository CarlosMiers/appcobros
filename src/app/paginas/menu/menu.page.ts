import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesPage } from '../clientes/clientes/clientes.page';
import { ProductosPage } from '../productos/lista-productos/productos/productos.page';
import { ListaPedidosPage } from '../pedidos/lista-pedidos/lista-pedidos/lista-pedidos.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  componentes: Array<{
    icon: string;
    name: string;
    component: any;
    color: string;
  }> = [
    {
      icon: 'people-outline',
      name: 'Clientes',
      component: ClientesPage,
      color: 'blue',
    },
    {
      icon: 'file-tray-stacked-outline',
      name: 'Productos',
      component: ProductosPage,
      color: 'green',
    },
    {
      icon: 'cube-outline',
      name: 'Pedidos',
      component: ListaPedidosPage,
      color: 'orange',
    },
    {
      icon: 'cart-outline',
      name: 'Ventas',
      component: ClientesPage,
      color: 'red',
    },
    {
      icon: 'people',
      name: 'Cobranzas',
      component: ClientesPage,
      color: 'purple',
    },
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openModal(component: any) {
    const modal = await this.modalController.create({
      component: component,
    });
    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getIconClass(name: string): string {
    switch (name.toLowerCase()) {
      case 'clientes':
        return 'icon-clientes';
      case 'productos':
        return 'icon-productos';
      case 'pedidos':
        return 'icon-pedidos';
      case 'ventas':
        return 'icon-ventas';
      case 'cobranzas':
        return 'icon-cobranzas';
      default:
        return '';
    }
  }
}
