import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CajasService } from 'src/app/services/cajas/cajas.service';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.page.html',
  styleUrls: ['./cajas.page.scss'],
})
export class CajasPage implements OnInit, OnDestroy {
  textoBuscar = '';
  cajas: any[] = [];
  cajasFiltradas: any[] = [];
  cajasPaginadas: any[] = []; // Nuevo array para la paginación
  
  page: number = 1; // Página actual, comienza en 1
  limit: number = 10; // Límite de elementos por página
  totalPages: number = 1;
  itemsPerPage = 10;
  isLoading = false;
  
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription = new Subscription();

  private animationDelay = 100;

  constructor(
    private animationCtrl: AnimationController,
    private cajasService: CajasService,
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
    this.loadCajas();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    // La animación se llama después de que los datos están cargados
  }

  /**
   * Configura búsqueda con debounce para mejor UX.
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
   * Animación escalonada de elementos.
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
   * Carga la lista de cajas.
   */
  async loadCajas() {
    try {
      this.isLoading = true;
      
      await this.loadingService.present({
        message: 'Cargando cajas...',
        duration: 300,
      });

      // Nota: Aquí se asume que el servicio getCajas devuelve todas las cajas,
      // no solo la página actual. Si tu servicio ya hace la paginación en el backend,
      // puedes ajustar esta lógica.
      const data = await this.cajasService.getCajas(this.page, this.limit);
      
      if (data && Array.isArray(data)) {
        this.cajas = data;
        this.cajasFiltradas = [...data];
        this.applyPagination(); // Aplicamos la paginación
      } else {
        throw new Error('Formato de datos incorrecto');
      }

      setTimeout(() => this.animateItems(), 100);

    } catch (error) {
      console.error('Error al cargar las cajas:', error);
      await this.presentErrorToast('Error al cargar las cajas. Intenta nuevamente.');
    } finally {
      this.isLoading = false;
      await this.loadingService.dismiss();
    }
  }

  /**
   * Aplica la paginación al array de cajas filtradas.
   */
  private applyPagination() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.cajasPaginadas = this.cajasFiltradas.slice(startIndex, endIndex);
    this.updatePaginationInfo();
  }

  /**
   * Maneja el input de búsqueda con debounce.
   */
  buscar(event: any) {
    const searchText = event.detail.value || '';
    this.textoBuscar = searchText;
    this.searchSubject.next(searchText);
  }

  /**
   * Realiza la búsqueda filtrada en el array local.
   */
  private performSearch(searchText: string) {
    if (!searchText.trim()) {
      this.cajasFiltradas = [...this.cajas];
    } else {
      const searchLower = searchText.toLowerCase();
      this.cajasFiltradas = this.cajas.filter(caja =>
        caja.nombre?.toLowerCase().includes(searchLower) ||
        caja.codigo?.toString().includes(searchText)
      );
    }
    
    this.page = 1; // Reiniciamos la paginación al buscar
    this.applyPagination();
  }

  /**
   * Navega a la página anterior.
   */
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.applyPagination();
      this.scrollToTop();
    }
  }
  
  /**
   * Navega a la página siguiente.
   */
  nextPage() {
    if (this.page < this.totalPages) {
        this.page++;
        this.applyPagination();
        this.scrollToTop();
    }
  }
  
  /**
   * Scroll suave al inicio del contenido.
   */
  private scrollToTop() {
    const content = document.querySelector('ion-content');
    if (content) {
      content.scrollToTop(300);
    }
  }

  /**
   * Actualiza la información de paginación.
   */
  private updatePaginationInfo() {
    const totalItems = this.cajasFiltradas.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  /**
   * Abre el modal de edición para una caja.
   */
  async openEditCajaModal(cajaCodigo: number) {
    try {
      const url = (cajaCodigo === 0) ? '/edit-cajas/new' : `/edit-cajas/${cajaCodigo}`;
      await this.navCtrl.navigateForward(url);
    } catch (error) {
      console.error('Error al navegar:', error);
      await this.presentErrorToast('Error al abrir el editor de caja');
    }
  }

  /**
   * Muestra un action sheet con opciones para la caja.
   */
  async presentActionSheet(id: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones de la Caja',
      cssClass: 'modern-action-sheet',
      mode: 'ios',
      buttons: [
        {
          text: 'Ver Movimientos',
          icon: 'list-outline',
          handler: () => {
            this.viewCajaDetails(id);
          },
        },
        {
          text: 'Editar Caja',
          icon: 'create-outline',
          handler: () => {
            this.openEditCajaModal(id);
          },
        },
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler: () => {
            this.shareCaja(id);
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
   * Confirma la eliminación de una caja.
   */
  async confirmDelete(cajaId: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta caja? Esta acción no se puede deshacer.',
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
            this.deleteCaja(cajaId);
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Elimina una caja del array.
   */
  private async deleteCaja(cajaId: any) {
    try {
      await this.loadingService.present({
        message: 'Eliminando caja...',
        duration: 2000,
      });
      
      this.cajas = this.cajas.filter(c => c.codigo !== cajaId);
      this.cajasFiltradas = this.cajasFiltradas.filter(c => c.codigo !== cajaId);
      this.applyPagination(); // Volvemos a aplicar la paginación después de eliminar
      
      await this.presentSuccessToast('Caja eliminada exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar caja:', error);
      await this.presentErrorToast('Error al eliminar la caja');
    } finally {
      await this.loadingService.dismiss();
    }
  }

  /**
   * Navega a la vista de detalles de una caja.
   */
  private viewCajaDetails(cajaId: any) {
    this.router.navigate(['/caja-details', cajaId]);
  }

  /**
   * Compartir información de la caja.
   */
  private async shareCaja(cajaId: any) {
    const caja = this.cajas.find(c => c.codigo === cajaId);
    if (caja) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Información de la Caja',
            text: `Caja: ${caja.nombre}\nCódigo: ${caja.codigo}`,
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      } else {
        await this.copyToClipboard(`Caja: ${caja.nombre}\nCódigo: ${caja.codigo}`);
        await this.presentSuccessToast('Información copiada al portapapeles');
      }
    }
  }

  /**
   * Copia texto al portapapeles.
   */
  private async copyToClipboard(text: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * Cierra la página con una animación.
   */
  async dismiss() {
    try {
      const content = document.querySelector('ion-content');
      if (content) {
        const animation = this.animationCtrl.create()
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
   * Muestra un toast de éxito.
   */
  async presentSuccessToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      cssClass: 'modern-toast',
      buttons: [
        { icon: 'checkmark', side: 'start' }
      ]
    });
    await toast.present();
  }

  /**
   * Muestra un toast de error.
   */
  async presentErrorToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      cssClass: 'modern-toast',
      buttons: [
        { icon: 'alert-circle', side: 'start' },
        { text: 'Cerrar', role: 'cancel' }
      ]
    });
    await toast.present();
  }
  
  /**
   * Refresca los datos con pull-to-refresh.
   */
  async doRefresh(event: any) {
    try {
      this.isLoading = true;
      await this.loadCajas();
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