import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { NavController } from '@ionic/angular';
import { fadeInAnimation } from 'src/app/animations';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit, OnDestroy {
  textoBuscar = '';
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  page: number = 1;
  limit: number = 10;
  currentPage = 1;
  totalPages: number = 1;
  itemsPerPage = 10;
  isLoading = false; // Agregar esta propiedad
  
  // Para búsqueda con debounce
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription = new Subscription();

  // Para animaciones escalonadas
  private animationDelay = 100;

  constructor(
    private animationCtrl: AnimationController,
    private clienteService: ClientesService,
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
    this.loadClientes();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.animateItems();
  }

  /**
   * Configura búsqueda con debounce para mejor UX
   */
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

  /**
   * Animación mejorada de elementos con stagger
   */
  animateItems() {
    const items = document.querySelectorAll('.client-card');

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

  /**
   * Carga clientes con manejo de errores mejorado
   */
  async loadClientes() {
    try {
      this.isLoading = true; // Activar loading local
      
      await this.loadingService.present({
        message: 'Cargando clientes...',
        duration: 300,
      });

      const data = await this.clienteService.getClientes(this.page, this.limit);
      
      if (data && Array.isArray(data)) {
        this.clientes = data;
        this.clientesFiltrados = [...data];
        this.updatePaginationInfo();
      } else {
        throw new Error('Formato de datos incorrecto');
      }

      // Animar elementos después de cargar
      setTimeout(() => this.animateItems(), 100);

    } catch (error) {
      console.error('Error al cargar los clientes:', error);
      await this.presentErrorToast('Error al cargar los clientes. Intenta nuevamente.');
    } finally {
      this.isLoading = false; // Desactivar loading local
      await this.loadingService.dismiss();
    }
  }

  /**
   * Búsqueda mejorada con debounce
   */
  buscar(event: any) {
    const searchText = event.detail.value || '';
    this.textoBuscar = searchText;
    this.searchSubject.next(searchText);
  }

  /**
   * Realiza la búsqueda filtrada
   */
  private performSearch(searchText: string) {
    if (!searchText.trim()) {
      this.clientesFiltrados = [...this.clientes];
    } else {
      const searchLower = searchText.toLowerCase();
      this.clientesFiltrados = this.clientes.filter(cliente =>
        cliente.nombre?.toLowerCase().includes(searchLower) ||
        cliente.ruc?.includes(searchText) ||
        cliente.codigo?.toString().includes(searchText)
      );
    }
    
    // Reiniciar paginación
    this.currentPage = 1;
    this.updatePaginationInfo();
  }

  /**
   * Navegación de páginas mejorada
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClientes();
      this.scrollToTop();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.page++;
      this.loadClientes();
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.currentPage--;
      this.loadClientes();
      this.scrollToTop();
    }
  }

  /**
   * Scroll suave al inicio
   */
  private scrollToTop() {
    const content = document.querySelector('ion-content');
    if (content) {
      content.scrollToTop(300);
    }
  }

  /**
   * Actualiza información de paginación
   */
  private updatePaginationInfo() {
    const totalItems = this.clientesFiltrados.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  /**
   * ActionSheet mejorado con más opciones
   */
  async presentActionSheet(id: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones del Cliente',
      cssClass: 'modern-action-sheet',
      mode: 'ios',
      buttons: [
        {
          text: 'Ver Detalles',
          icon: 'eye-outline',
          handler: () => {
            this.viewClientDetails(id);
          },
        },
        {
          text: 'Editar Cliente',
          icon: 'create-outline',
          handler: () => {
            this.router.navigate(['edit-clientes', { id }]);
          },
        },
        {
          text: 'Estado de Cuenta',
          icon: 'calculator-outline',
          handler: () => {
            this.viewAccountStatus(id);
          },
        },
        {
          text: 'Historial de Compras',
          icon: 'time-outline',
          handler: () => {
            this.viewPurchaseHistory(id);
          },
        },
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler: () => {
            this.shareClient(id);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.confirmDelete(id);
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
   * Confirmar eliminación con alert
   */
  async confirmDelete(clienteId: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
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
            this.deleteClient(clienteId);
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Eliminar cliente
   */
  private async deleteClient(clienteId: any) {
    try {
      await this.loadingService.present({
        message: 'Eliminando cliente...',
        duration: 2000,
      });

      // Aquí iría la llamada al servicio para eliminar
      // await this.clienteService.deleteCliente(clienteId);
      
      // Simular eliminación por ahora
      this.clientes = this.clientes.filter(c => c.codigo !== clienteId);
      this.clientesFiltrados = this.clientesFiltrados.filter(c => c.codigo !== clienteId);
      
      await this.presentSuccessToast('Cliente eliminado exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      await this.presentErrorToast('Error al eliminar el cliente');
    } finally {
      await this.loadingService.dismiss();
    }
  }

  /**
   * Ver detalles del cliente
   */
  private viewClientDetails(clienteId: any) {
    // Implementar navegación a vista de detalles
    this.router.navigate(['/client-details', clienteId]);
  }

  /**
   * Ver estado de cuenta
   */
  private viewAccountStatus(clienteId: any) {
    // Implementar navegación a estado de cuenta
    this.router.navigate(['/account-status', clienteId]);
  }

  /**
   * Ver historial de compras
   */
  private viewPurchaseHistory(clienteId: any) {
    // Implementar navegación a historial
    this.router.navigate(['/purchase-history', clienteId]);
  }

  /**
   * Compartir información del cliente
   */
  private async shareClient(clienteId: any) {
    const cliente = this.clientes.find(c => c.codigo === clienteId);
    if (cliente) {
      // Implementar funcionalidad de compartir
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Información del Cliente',
            text: `Cliente: ${cliente.nombre}\nCódigo: ${cliente.codigo}\nRUC: ${cliente.ruc}`,
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      } else {
        // Fallback para navegadores que no soportan Web Share API
        await this.copyToClipboard(`Cliente: ${cliente.nombre}\nCódigo: ${cliente.codigo}\nRUC: ${cliente.ruc}`);
        await this.presentSuccessToast('Información copiada al portapapeles');
      }
    }
  }

  /**
   * Copiar al portapapeles
   */
  private async copyToClipboard(text: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * Navegación mejorada
   */
  goBack() {
    this.router.navigate(['/menu']);
  }

async dismiss() {
  try {
    const content = document.querySelector('ion-content');
    if (content) {
      const animation = this.animationCtrl.create()
        .addElement(content)
        .duration(200) // Reducir duración
        .easing('ease-out')
        .fromTo('transform', 'translateX(0)', 'translateX(-20px)')
        .fromTo('opacity', 1, 0.8); // No ocultar completamente
      
      await animation.play();
      
      // Limpiar la animación
      animation.destroy();
    }
  } catch (error) {
    console.error('Error en animación:', error);
  } finally {
    // Navegar siempre, independientemente de si la animación falló
    this.router.navigate(['/menu']);
  }
}

  /**
   * Abrir editor de cliente con validación
   */
  async openEditCliente(clienteCodigo: number) {
    try {
      if (clienteCodigo === 0) {
        // Nuevo cliente
        await this.navCtrl.navigateForward('/edit-clientes/new');
      } else {
        // Editar cliente existente
        await this.navCtrl.navigateForward(`/edit-clientes/${clienteCodigo}`);
      }
    } catch (error) {
      console.error('Error al navegar:', error);
      await this.presentErrorToast('Error al abrir el editor de cliente');
    }
  }

  /**
   * Toast de éxito
   */
  async presentSuccessToast(message: string) {
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

  /**
   * Toast de error
   */
  async presentErrorToast(message: string) {
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

  /**
   * Toast genérico (mantener compatibilidad)
   */
  async presentToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'modern-toast'
    });
    await toast.present();
  }

  /**
   * Refrescar datos con pull-to-refresh
   */
  async doRefresh(event: any) {
    try {
      this.isLoading = true; // Activar loading local
      await this.loadClientes();
      event.target.complete();
      await this.presentSuccessToast('Datos actualizados');
    } catch (error) {
      console.error('Error al refrescar:', error);
      event.target.complete();
      await this.presentErrorToast('Error al actualizar los datos');
    } finally {
      this.isLoading = false; // Desactivar loading local
    }
  }

  /**
   * Búsqueda avanzada (método público para el template)
   */
  async openAdvancedSearch() {
    // Implementar modal de búsqueda avanzada
    console.log('Abrir búsqueda avanzada');
  }

  /**
   * Exportar lista de clientes
   */
  async exportClients() {
    try {
      await this.loadingService.present({
        message: 'Exportando clientes...',
        duration: 2000,
      });

      // Implementar lógica de exportación
      // Por ejemplo, generar CSV o PDF
      
      await this.presentSuccessToast('Lista exportada exitosamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      await this.presentErrorToast('Error al exportar la lista');
    } finally {
      await this.loadingService.dismiss();
    }
  }
}