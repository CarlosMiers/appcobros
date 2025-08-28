import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AnimationController,
  NavController,
  ToastController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit, OnDestroy {
  textoBuscar = '';
  productos: any[] = [];
  productosFiltrados: any[] = [];
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  itemsPerPage = 10;
  isLoading = false;

  // Para búsqueda con debounce
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription = new Subscription();

  // Para animaciones escalonadas
  private animationDelay = 100;

  constructor(
    private animationCtrl: AnimationController,
    private productosService: ProductosService,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    public router: Router,
    private toast: ToastController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {
    this.setupSearchDebounce();
  }

  ngOnInit() {
    this.loadProductos();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.animateItems();
  }

  // --- Funcionalidad principal ---

  private setupSearchDebounce() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this.performSearch(searchText);
      });
  }

  async loadProductos() {
    try {
      this.isLoading = true;
      await this.loadingService.present({
        message: 'Cargando productos...',
        duration: 300,
      });

      const data = await this.productosService.getProductos(this.page, this.limit);
      
      if (data && Array.isArray(data)) {
        this.productos = data;
        this.productosFiltrados = [...data];
        this.updatePaginationInfo();
      } else {
        throw new Error('Formato de datos incorrecto');
      }

      setTimeout(() => this.animateItems(), 100);

    } catch (error) {
      console.error('Error al cargar los productos:', error);
      await this.presentErrorToast('Error al cargar los productos. Intenta nuevamente.');
    } finally {
      this.isLoading = false;
      await this.loadingService.dismiss();
    }
  }

  buscar(event: any) {
    const searchText = event.detail.value || '';
    this.textoBuscar = searchText;
    this.searchSubject.next(searchText);
  }

  private performSearch(searchText: string) {
    if (!searchText.trim()) {
      this.productosFiltrados = [...this.productos];
    } else {
      const searchLower = searchText.toLowerCase();
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre?.toLowerCase().includes(searchLower) ||
        producto.codigo?.toString().includes(searchText)
      );
    }
    
    this.updatePaginationInfo();
  }

  // --- Navegación y acciones ---

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProductos();
      this.scrollToTop();
    }
  }

  nextPage() {
    this.page++;
    this.loadProductos();
    this.scrollToTop();
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  async dismiss() {
    this.router.navigate(['/menu']);
  }

  async openEditProductoModal(productoCodigo: string) {
    if (productoCodigo === '') {
      await this.navCtrl.navigateForward('/edit-productos/new');
    } else {
      await this.navCtrl.navigateForward(`/edit-productos/${productoCodigo}`);
    }
  }

  async presentActionSheet(codigo: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones del Producto',
      cssClass: 'modern-action-sheet',
      mode: 'ios',
      buttons: [
        {
          text: 'Ver Detalles',
          icon: 'eye-outline',
          handler: () => {
            this.viewProductDetails(codigo);
          },
        },
        {
          text: 'Editar Producto',
          icon: 'create-outline',
          handler: () => {
            this.openEditProductoModal(codigo);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.confirmDelete(codigo);
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

  async confirmDelete(productoCodigo: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
      cssClass: 'modern-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.deleteProducto(productoCodigo);
          },
        },
      ],
    });
    await alert.present();
  }

  private async deleteProducto(productoCodigo: any) {
    try {
      await this.loadingService.present({
        message: 'Eliminando producto...',
        duration: 2000,
      });

      // Simular eliminación
      this.productos = this.productos.filter(p => p.codigo !== productoCodigo);
      this.productosFiltrados = this.productosFiltrados.filter(p => p.codigo !== productoCodigo);

      await this.presentSuccessToast('Producto eliminado exitosamente');
      this.updatePaginationInfo();
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      await this.presentErrorToast('Error al eliminar el producto');
    } finally {
      await this.loadingService.dismiss();
    }
  }

  // --- Funciones de utilidad ---

  private animateItems() {
    const items = document.querySelectorAll('.product-card');

    items.forEach((item, index) => {
      const animation = this.animationCtrl.create()
        .addElement(item)
        .duration(600)
        .delay(index * this.animationDelay)
        .easing('cubic-bezier(0.4, 0, 0.2, 1)')
        .fromTo('opacity', 0, 1)
        .fromTo('transform', 'translateY(30px)', 'translateY(0px)');
      
      animation.play();
    });
  }

  private scrollToTop() {
    const content = document.querySelector('ion-content');
    if (content) {
      content.scrollToTop(300);
    }
  }

  private updatePaginationInfo() {
    const totalItems = this.productosFiltrados.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

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
          side: 'start'
        }
      ]
    });
    await toast.present();
  }

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
          side: 'start'
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
  
  private viewProductDetails(productoCodigo: any) {
    this.router.navigate(['/product-details', productoCodigo]);
  }

  async doRefresh(event: any) {
    try {
      this.isLoading = true;
      await this.loadProductos();
      event.target.complete();
      await this.presentSuccessToast('Datos actualizados');
    } catch (error) {
      console.error('Error al refrescar:', error);
      event.target.complete();
      await this.presentErrorToast('Error al actualizar los datos');
    } finally {
      this.isLoading = false;
    }
  }
}