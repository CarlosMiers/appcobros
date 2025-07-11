import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesPage } from '../clientes/clientes/clientes.page';
import { ProductosPage } from '../productos/lista-productos/productos/productos.page';
import { ListaPedidosPage } from '../pedidos/lista-pedidos/lista-pedidos/lista-pedidos.page';
import { CajasPage } from '../cajas/cajas/cajas.page';
import { ListaVentasPage } from '../ventas/lista-ventas/lista-ventas.page';
import { ConfiguracionPage } from '../configuracion/configuracion/configuracion.page';
import { HomePage } from 'src/app/home/home.page';
import { ListaCobranzaPage } from '../cobranzas/lista-cobranza/lista-cobranza/lista-cobranza.page';

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
      icon: 'briefcase-outline',
      name: 'Cajas',
      component: CajasPage,
      color: 'brown',
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
      component: ListaVentasPage,
      color: 'red',
    },

    {
      icon: 'people',
      name: 'Cobranzas',
      component: ListaCobranzaPage,
      color: 'purple',
    },

    {
      icon: 'print-outline',
      name: 'Impresora',
      component: HomePage,
      color: 'gray',
    },

    {
      icon: 'settings',
      name: 'Configuración',
      component: ConfiguracionPage,
      color: 'green',
    },
  ];


  constructor(
    private modalController: ModalController,
  ) {}

  ngOnInit() {
  }

  async openModal(component: any) {
    const modal = await this.modalController.create({
      component: component,
    });
    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }


}
