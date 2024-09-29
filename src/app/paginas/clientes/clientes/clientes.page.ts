import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalController,
  ToastController,
  ActionSheetController,
} from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { EditClientesPage } from '../edit-clientes/edit-clientes.page';

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

  constructor(
    private clienteService: ClientesService,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    public router: Router,
    private toast: ToastController,
    private ActionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
   // this.loadClientes();
  }

  ionViewWillEnter(){
    this.loadClientes();
  }



  loadClientes() {
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

  async openEditClienteModal(clienteCodigo: number) {
    const modal = await this.modalCtrl.create({
      component: EditClientesPage,
      animated: true,
      mode: 'md',
      backdropDismiss: false,
      cssClass: 'editCliente-modal',
      componentProps: {
        codigo: clienteCodigo,
      },
    });

    return await modal.present();

  }

}
