import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AnimationController,
  ModalController,
  NavController,
  ToastController,
  ActionSheetController,
} from '@ionic/angular';
import { fadeInAnimation } from 'src/app/animations';
import { CajasService } from 'src/app/services/cajas/cajas.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { EditCajasPage } from '../edit-cajas/edit-cajas.page';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.page.html',
  styleUrls: ['./cajas.page.scss'],
})
export class CajasPage implements OnInit {
  textoBuscar = '';
  cajas: any[] = [];
  page: number = 1;
  limit: number = 10;
  currentPage = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  constructor(
    private animationCtrl: AnimationController,
    private cajasService: CajasService,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    public router: Router,
    private toast: ToastController,
    private ActionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.loadCajas();
  }

  ionViewDidEnter() {
    this.animateItems();
  }

  animateItems() {
    const items = document.querySelectorAll('.cliente-card');

    items.forEach((item, index) => {
      const animation = fadeInAnimation(
        this.animationCtrl,
        item as HTMLElement
      );
      animation.delay(index * 100).play();
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCajas(); // Recargar clientes para la página anterior
    }
  }

  async loadCajas() {
    // Mostramos el loading antes de hacer la solicitud
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      // Usamos await para obtener las cajas de manera asíncrona
      const data = await this.cajasService.getCajas(this.page, this.limit);

      // Asigna directamente el array a this.cajas
      this.cajas = data;
    } catch (error) {
      // Manejo de errores en caso de que algo falle
      console.error('Error al cargar las cajas:', error);
    }
  }

  buscar(event: any) {
    this.textoBuscar = event.detail.value;
  }

  nextPage() {
    this.page++;
    this.loadCajas();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadCajas();
    }
  }

  async presentActionSheet(id: any) {
    const actionSheet = await this.ActionSheetController.create({
      header: 'Opciones de Caja',
      cssClass: 'my-alert',
      mode: 'md',
      buttons: [
        {
          text: 'Editar Caja',
          icon: 'checkmark-done-circle-outline',
          handler: () => {
            this.router.navigate(['edit-cajas', { id }]);
          },
        },
        {
          text: 'Salir',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  async dismiss() {
    this.router.navigate(['/menu']);
  }

  async openEditCajaModal(cajaCodigo: number) {
    await this.navCtrl.navigateForward(`/edit-cajas/${cajaCodigo}`);
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
