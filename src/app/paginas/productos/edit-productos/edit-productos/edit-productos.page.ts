import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Producto } from 'src/app/models/productos/producto';
import { FormateoService } from 'src/app/services/formateo/formateo.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ProductosService } from 'src/app/services/productos/productos.service';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.page.html',
  styleUrls: ['./edit-productos.page.scss'],
})
export class EditProductosPage implements OnInit {

  productoCodigo: string = '';
  id: any;
  titulo: any = '';
  loading: boolean = false;
  [key: string]: any;

  EditProducto: Producto = {
    codigo: '',
    nombre: '',
    costo: 0,
    ivaporcentaje: 0,
    precio_maximo: 0,
    estado: 1,
    createdAt: null,
    updatedAt: null,
  };

  importe?: string | number;
  otroCampoNumerico?: string | number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private formateoService: FormateoService,
    private productoService: ProductosService,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingService: LoadingService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.productoCodigo = idParam !== null ? String(idParam) : '';


    if (this.productoCodigo.length > 0) {
      this.titulo = 'Editar Producto ' + this.productoCodigo;
      this.Consultar();
    } else {
      this.titulo = 'Agregar Producto';
    }
  }

  actualizarValor(event: any, campo: string) {
    const input = event.target as HTMLInputElement;
    const valorFormateado = this.formateoService.formatearGuaranies(
      input.value
    );
    this[campo] = valorFormateado;
  }

  async saveProducto() {
    // Validación de campos obligatorios
    if (
      this.EditProducto.nombre == '' ||
      this.EditProducto.costo == 0 ||
      this.EditProducto.precio_maximo == 0
    ) {
      this.loadingService.present({
        message: 'Los Campos de Nombre, Costo y Precio son Obligatorios.',
        duration: 300,
      });
      return;
    }

    this.loading = true;

    try {
      if (this.productoCodigo.length > 0) {
        // Llamamos al servicio para actualizar el producto si el código es válido
        await this.productoService.updateProducto(this.EditProducto);
      } else {
        // Llamamos al servicio para agregar el producto si el código es vacío
        await this.productoService.AddProducto(this.EditProducto);
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      // Opcional: Puedes agregar un mensaje o alerta para el usuario aquí
    } finally {
      this.loading = false;
      this.dismiss(); // Cierra el modal o diálogo
    }
  }
  async Consultar() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      const data = await this.productoService.getProducto(
        this.productoCodigo.trim()
      );
      // Asignamos los valores al objeto EditProducto con redondeo
      this.EditProducto = {
        ...data,
        costo: Math.round(Number(data.costo)) || 0,
        precio_maximo: Math.round(Number(data.precio_maximo)) || 0,
      };
      console.log(this.EditProducto);
    } catch (error) {
      // Manejo de error si deseas agregar algún detalle
      console.error('Error al consultar el producto:', error);
    } finally {
      this.loading = false;
    }
  }

  compareWithEstado = (o1: any, o0: any) => {
    return o1 == o0; // Para comparar '0' y '1'
  };

  async dismiss() {
    await this.navCtrl.pop();
  }

  // Formatea número con separadores y prefijo 'Gs.'

  formatCurrency(value: number | undefined): string {
    if (!value || isNaN(value)) {
      return 'Gs. 0';
    }
    const numberString = value.toString();
    // Quitar puntos por si hay
    const cleanNumberString = numberString.replace(/\./g, '');
    const withThousands = cleanNumberString.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.'
    );
    return `Gs. ${withThousands}`;
  }

  updateFormattedInput(event: any, modelKey: 'costo' | 'precio_maximo'): void {
    const inputEl = event.target as HTMLInputElement;
    // Sacar el texto "Gs." y los puntos para tener solo números
    let rawValue = inputEl.value.replace(/[^0-9]/g, '');
    if (rawValue === '') rawValue = '0'; // evitar vacíos

    const numericValue = Number(rawValue);
    this.EditProducto[modelKey] = numericValue;

    // Actualizar el input con formato correcto (sin duplicar puntos)
    inputEl.value = this.formatCurrency(numericValue);
  }

  // Manejadores de eventos individuales
  onCostoInput(event: any): void {
    this.updateFormattedInput(event, 'costo');
  }

  onPrecioInput(event: any): void {
    this.updateFormattedInput(event, 'precio_maximo');
  }
}
