import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  componentes: Array<{ icon: string; name: string; redirectTo: string }> = [
    {
      icon: 'people-outline',
      name: 'Clientes',
      redirectTo: '/clientes',
    },
    {
      icon: 'file-tray-stacked-outline',
      name: 'Productos',
      redirectTo: '/productos',
    },
    {
      icon: 'cube-outline',
      name: 'Pedidos',
      redirectTo: '/lista-pedidos',
    },
    {
      icon: 'cart-outline',
      name: 'Ventas',
      redirectTo: '/ventas',
    },
    {
      icon: 'people',
      name: 'Cobranzas',
      redirectTo: '/cobranzas',
    },

    // Añade aquí otras rutas según sea necesario
  ];

  constructor() {}

  ngOnInit() {}

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
