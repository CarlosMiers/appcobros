import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; // Importa NavController
// No necesitas ModalController si solo usas navegación
// import { ModalController } from '@ionic/angular';

// No necesitas importar las clases de las páginas aquí si solo usas sus rutas
// Solo las necesitas si quieres pasarles datos complejos al navegar,
// o si tu aplicación es pequeña y no quieres rutas separadas por módulos.
// Para esta solución, usaremos rutas de string.

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  componentes: Array<{
    icon: string;
    name: string;
    // Cambiamos 'component' a 'path' para usar la ruta de navegación
    path: string; // <-- Cambiado a string para la ruta
    color: string;
  }> = [
    {
      icon: 'people-outline',
      name: 'Clientes',
      path: '/clientes', // <-- Usa la ruta definida en app-routing.module.ts
      color: 'blue',
    },
    {
      icon: 'file-tray-stacked-outline',
      name: 'Productos',
      path: '/productos',
      color: 'green',
    },
    {
      icon: 'briefcase-outline',
      name: 'Cajas',
      path: '/cajas',
      color: 'brown',
    },
    {
      icon: 'cube-outline',
      name: 'Pedidos',
      path: '/lista-pedidos',
      color: 'orange',
    },
    {
      icon: 'cart-outline',
      name: 'Ventas',
      path: '/lista-ventas',
      color: 'red',
    },
    {
      icon: 'people',
      name: 'Cobranzas',
      path: '/lista-cobranza',
      color: 'purple',
    },
    {
      icon: 'print-outline',
      name: 'Impresora',
      path: '/home', // Ajusta si la ruta de HomePage es diferente
      color: 'gray',
    },
    {
      icon: 'settings',
      name: 'Configuración',
      path: '/configuracion',
      color: 'green',
    },
  ];

  constructor(
    // private modalController: ModalController, // Ya no es necesario
    private navCtrl: NavController, // Inyecta NavController
  ) {}

  ngOnInit() {
    // Si necesitas que la página del menú se cierre al navegar,
    // asegúrate de que esté en una pila de navegación adecuada.
    // Para un menú, es común que sea una página raíz o un tab.
  }

  // Cambiamos openModal por navigateToPage
  async navigateToPage(path: string) { // Recibe la ruta como string
    await this.navCtrl.navigateForward(path); // Navega hacia adelante a la ruta especificada
  }

  // Para el botón "Salir", si el menú es un modal que se presentó sobre HomePage,
  // y quieres volver a HomePage, puedes usar pop() o navigateBack().
  // Si el menú es tu página principal y "Salir" debe cerrar la app, es diferente.
  // Asumiendo que "Salir" vuelve a una pantalla de login/home anterior:
  dismiss() {
     // Si el menú fue abierto con navigateForward y quieres volver atrás:
     
     // O si quieres ir a una ruta específica, por ejemplo, la página de login:
      this.navCtrl.navigateRoot('/welcome'); 
  }
}