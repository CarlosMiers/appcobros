import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../services/productos/productos.service';
import { ModalController, NavController, ToastController, ActionSheetController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Router } from '@angular/router';
import { EditProductosPage } from '../../edit-productos/edit-productos/edit-productos.page';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  textoBuscar = '';
  productos: any[] = [];
  page: number = 1;
  limit: number = 10;
  currentPage = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  constructor(
    private productosService: ProductosService,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    public router: Router,
    private toast: ToastController,
    private ActionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.loadProductos();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProductos(); // Recargar clientes para la página anterior
    }
  }

  loadProductos() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });
    this.productosService.getProductos(this.page, this.limit).subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        // Manejo de error: puedes mostrar un mensaje o hacer un registro del error
        console.error('Error al cargar los productos:', error);
        this.loadingService.dismiss();
        // Opcional: Mostrar un mensaje al usuario
        alert('Ocurrió un error al cargar los productos. Por favor, intenta de nuevo.');
      },
      () => {
        // Finalización de la solicitud: detiene el loading en todos los casos
        this.loadingService.dismiss();
      }
    );
  }

  buscar(event: any) {
    this.textoBuscar = event.detail.value;
  }

  nextPage() {
    this.page++;
    this.loadProductos();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProductos();
    }
  }

  goBack() {
    this.router.navigate(['/menu']);
  }


  async openEditProductoModal(productoCodigo: string) {
    const modal = await this.modalCtrl.create({
      component: EditProductosPage,
      animated: true,
      mode: 'md',
      backdropDismiss: false,
      cssClass: 'editProducto-modal',
      componentProps: {
        productoCodigo: productoCodigo,
      },
    });
    //  localStorage.setItem('codcliente',clienteCodigo.toString());
    return await modal.present();
  }
}
