// lista-ventas.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalController,
  NavController,
  ToastController,
  AnimationController,
  ActionSheetController, // ¡Importante!
  AlertController, // Agregado para la confirmación de anulación
} from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ListaVentasService } from 'src/app/services/ventas/lista-ventas.service';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.page.html',
  styleUrls: ['./lista-ventas.page.scss'],
})
export class ListaVentasPage implements OnInit, OnDestroy {
  totalpedido: number = 0;
  fechainicio: any;
  fechafinal: any;
  ListaVenta: any[] = [];

  constructor(
    private listaventasService: ListaVentasService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController, // Agregado
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    public router: Router,
    private toast: ToastController,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    this.fechainicio = new Date().toISOString().substring(0, 10);
    this.fechafinal = new Date().toISOString().substring(0, 10);
    this.Consultar();
  }

  ngOnDestroy() {
    // No hay suscripciones, pero es buena práctica mantener este método
  }

  /**
   * Consulta las ventas en el rango de fechas.
   */
  async Consultar() {
    this.totalpedido = 0;
    this.ListaVenta = [];

    await this.loadingService.present({
      message: 'Cargando ventas...',
      duration: 300,
    });

    try {
      const idUsuario = parseInt(localStorage.getItem('idusuario') || '0', 10);

      const data = await this.listaventasService.getListaVenta(
        idUsuario,
        this.fechainicio,
        this.fechafinal
      );

      if (data && Array.isArray(data)) {
        this.ListaVenta = data;

        // Calcular el total de manera más eficiente
        this.totalpedido = this.ListaVenta.reduce(
          (sum, item) => sum + (parseFloat(item.totalneto) || 0),
          0
        );
      } else {
        throw new Error('Formato de datos incorrecto');
      }
    } catch (err) {
      console.error('Error al cargar la lista de ventas:', err);
      await this.presentErrorToast(
        'Error al cargar las ventas. Intenta nuevamente.'
      );
    } finally {
      await this.loadingService.dismiss();
    }
  }

  /**
   * Navega de regreso al menú con una animación sutil.
   */
  async dismiss() {
    try {
      const content = document.querySelector('ion-content');
      if (content) {
        const animation = this.animationCtrl
          .create()
          .addElement(content)
          .duration(200)
          .easing('ease-out')
          .fromTo('transform', 'translateX(0)', 'translateX(-20px)')
          .fromTo('opacity', 1, 0.8);

        await animation.play();
        animation.destroy();
      }
    } catch (error) {
      console.error('Error en animación:', error);
    } finally {
      this.router.navigate(['/menu']);
    }
  }

  /**
   * Navega a la página de edición o creación de ventas.
   * @param idVenta El ID de la venta a editar. 0 para una nueva venta.
   */
  async OpenEditVenta(idVenta: number) {
    await this.navCtrl.navigateForward(`/detalle-venta/${idVenta}`);
  }

  // --- MÉTODOS AGREGADOS ---

  /**
   * Muestra un Action Sheet con opciones para una venta.
   * @param idVenta El ID de la venta.
   */
  async presentActionSheet(idVenta: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones de Venta',
      cssClass: 'modern-action-sheet',
      mode: 'ios',
      buttons: [
        {
          text: 'Ver Detalles',
          icon: 'eye-outline',
          handler: () => {
            this.OpenEditVenta(idVenta);
          },
        },
        {
          text: 'Anular Venta',
          icon: 'close-circle-outline',
          role: 'destructive',
          handler: () => {
            this.confirmAnnul(idVenta);
          },
        },
        {
          text: 'Imprimir',
          icon: 'print-outline',
          handler: () => {
            this.printSale(idVenta);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  /**
   * Muestra una alerta de confirmación para anular una venta.
   * @param idVenta El ID de la venta a anular.
   */
  async confirmAnnul(idVenta: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Anulación',
      message: `¿Estás seguro de que deseas anular la venta con el ID ${idVenta}? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Anular',
          role: 'destructive',
          handler: () => {
            // Aquí puedes llamar a tu servicio para anular la venta
            console.log('Venta Anulada', idVenta);
            this.presentSuccessToast('Venta anulada correctamente.');
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Simula la impresión de una venta.
   * @param idVenta El ID de la venta a imprimir.
   */
  private async printSale(idVenta: number) {
    // Aquí iría tu lógica real para generar un PDF o enviar a una impresora
    console.log('Imprimiendo venta:', idVenta);
    await this.presentSuccessToast('Documento de venta generado para imprimir.');
  }

  // --- MÉTODOS EXISTENTES PARA TOASTS ---

  /**
   * Muestra un toast de éxito.
   * @param message El mensaje a mostrar.
   */
  private async presentSuccessToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      cssClass: 'modern-toast',
      buttons: [
        {
          icon: 'checkmark',
          side: 'start',
        },
      ],
    });
    await toast.present();
  }

  /**
   * Muestra un toast de error.
   * @param message El mensaje a mostrar.
   */
  private async presentErrorToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      cssClass: 'modern-toast',
      buttons: [
        {
          icon: 'alert-circle',
          side: 'start',
        },
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}