import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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


  async openEditClienteModal(clienteCodigo: number) {
    const modal = await this.modalCtrl.create({
      component: EditClientesPage,
      animated: true,
      mode: 'md',
      backdropDismiss: false,
      cssClass: 'editCliente-modal',
      componentProps: {
        clienteCodigo: clienteCodigo,
      },
    });
    //  localStorage.setItem('codcliente',clienteCodigo.toString());
    return await modal.present();
  }
}
