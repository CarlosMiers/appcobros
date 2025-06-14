import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  ModalController,
  ToastController,
  ActionSheetController,
} from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { EditClientesPage } from '../edit-clientes/edit-clientes.page';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { NavController } from '@ionic/angular';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  textoBuscar = '';
  clientes: any[] = [];
  page: number = 1;
  limit: number = 10;
  currentPage = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  constructor(
    private animationCtrl: AnimationController,
    private clienteService: ClientesService,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    public router: Router,
    private toast: ToastController,
    private ActionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.loadClientes();
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
      this.loadClientes(); // Recargar clientes para la página anterior
    }
  }

  loadClientes() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    this.clienteService.getClientes(this.page, this.limit).subscribe((data) => {
      this.clientes = data; // Asigna directamente el array a this.clientes
    });
  }

  buscar(event: any) {
    this.textoBuscar = event.detail.value;
  }

  nextPage() {
    this.page++;
    this.loadClientes();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadClientes();
    }
  }

  async presentActionSheet(id: any) {
    const actionSheet = await this.ActionSheetController.create({
      header: 'Opciones del Cliente',
      cssClass: 'my-alert',
      mode: 'md',
      buttons: [
        {
          text: 'Editar Cliente',
          icon: 'checkmark-done-circle-outline',
          handler: () => {
            this.router.navigate(['edit-clientes', { id }]);
          },
        },
        {
          text: 'Estado de Cuenta',
          icon: 'calculator-outline',
          handler: () => {
            console.log('Play clicked');
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
    return await this.modalCtrl.dismiss();
  }


/* async openEditClienteModal(clienteCodigo: number) {
  const modal = await this.modalCtrl.create({
    component: EditClientesPage,
    componentProps: {
      clienteCodigo,
    },
    cssClass: 'editCliente-modal',
    backdropDismiss: false,
    animated: true,
    mode: 'md',
  });

  const { data } = await modal.onDidDismiss();

  if (data?.actualizado) {
    this.loadClientes(); // Recargar lista
  }
}*/

  async openEditClienteModal(clienteCodigo: number) {
    const modal = await this.modalCtrl.create({
      component: EditClientesPage,
    componentProps: {
      clienteCodigo,
    },
      cssClass: 'editCliente-modal',
      backdropDismiss: false,
      animated: true,
      mode: 'md',
    });
    return await modal.present();
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
