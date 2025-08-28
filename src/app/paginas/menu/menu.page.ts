import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  componentes: Array<{
    icon: string;
    name: string;
    path: string;
    color: string;
  }> = [
    {
      icon: 'people-outline',
      name: 'Clientes',
      path: '/clientes',
      color: '#3880ff', // Azul principal
    },
    {
      icon: 'cube-outline',
      name: 'Productos',
      path: '/productos',
      color: '#10dc60', // Verde
    },
    {
      icon: 'briefcase-outline',
      name: 'Cajas',
      path: '/cajas',
      color: '#f04141', // Rojo
    },
    {
      icon: 'receipt-outline',
      name: 'Pedidos',
      path: '/lista-pedidos',
      color: '#ffce00', // Amarillo
    },
    {
      icon: 'storefront-outline',
      name: 'Ventas',
      path: '/lista-ventas',
      color: '#ff4757', // Rojo coral
    },
    {
      icon: 'card-outline',
      name: 'Cobranzas',
      path: '/lista-cobranza',
      color: '#a55eea', // Púrpura
    },
    {
      icon: 'print-outline',
      name: 'Impresora',
      path: '/home',
      color: '#778ca3', // Gris azulado
    },
    {
      icon: 'settings-outline',
      name: 'Configuración',
      path: '/configuracion',
      color: '#26de81', // Verde claro
    },
  ];

  constructor(
    private navCtrl: NavController,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    // Animar la entrada de las tarjetas al cargar la página
    this.animateCardsOnLoad();
  }

  async navigateToPage(path: string) {
    // Animar el click antes de navegar
    await this.animateClick();
    await this.navCtrl.navigateForward(path);
  }

  dismiss() {
    // Animar la salida antes de navegar
    this.animateExit().then(() => {
      this.navCtrl.navigateRoot('/welcome');
    });
  }

  private animateCardsOnLoad() {
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach((card, index) => {
      const animation = this.animationCtrl
        .create()
        .addElement(card)
        .duration(600)
        .delay(index * 100)
        .easing('ease-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(50px) scale(0.8)', 'translateY(0) scale(1)');
      
      animation.play();
    });
  }

  private async animateClick(): Promise<void> {
    return new Promise((resolve) => {
      // Crear una animación de "pulse" para feedback visual
      const pulseAnimation = this.animationCtrl
        .create()
        .addElement(document.querySelector('.menu-content') as HTMLElement)
        .duration(200)
        .easing('ease-out')
        .fromTo('transform', 'scale(1)', 'scale(0.98)')
        .afterStyles({
          'transform': 'scale(1)'
        });

      pulseAnimation.play().then(() => resolve());
    });
  }

  private async animateExit(): Promise<void> {
    return new Promise((resolve) => {
      const cards = document.querySelectorAll('.menu-card');
      const exitAnimation = this.animationCtrl
        .create()
        .duration(400)
        .easing('ease-in');

      cards.forEach((card, index) => {
        exitAnimation.addAnimation([
          this.animationCtrl
            .create()
            .addElement(card)
            .delay(index * 50)
            .fromTo('opacity', '1', '0')
            .fromTo('transform', 'translateY(0) scale(1)', 'translateY(-30px) scale(0.8)')
        ]);
      });

      exitAnimation.play().then(() => resolve());
    });
  }

  // Método para agregar efectos de sonido (opcional)
  private playClickSound() {
    // Puedes agregar aquí un efecto de sonido si lo deseas
    // Por ejemplo, usando el plugin Native Audio de Ionic
    try {
      // Vibración táctil como alternativa al sonido
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.log('Vibration not supported');
    }
  }

  // Método para manejar gestos táctiles avanzados (opcional)
  onCardPress(item: any, event: any) {
    this.playClickSound();
    
    // Crear efecto de "ripple" personalizado
    const ripple = document.createElement('div');
    ripple.classList.add('custom-ripple');
    
    const rect = event.target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    event.target.appendChild(ripple);
    
    // Remover el ripple después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}