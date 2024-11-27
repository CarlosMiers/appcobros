import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
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
  @Input() productoCodigo: string = ''; // Recibe el parámetro 'codigo' desde el modal

  id: any;
  titulo: any = '';
  loading: boolean = false;
  [key: string]: any;

  EditProducto: Producto = {
    codigo: '',
    nombre: '',
    costo: 0,
    precio_maximo: 0,
    estado: 1,
    createdAt: null,
    updatedAt: null,
  };

  importe?: string | number;
  otroCampoNumerico?: string | number;

  constructor(
    private formateoService: FormateoService,
    private productoService: ProductosService,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingService: LoadingService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
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

  saveProducto() {
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
    if (this.productoCodigo.length > 0) {
      this.productoService.updateProducto(this.EditProducto).subscribe(
        (response) => {
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      this.productoService.AddProducto(this.EditProducto).subscribe(
        (response) => {
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    }
    this.dismiss();
  }

  Consultar() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    this.productoService.getProducto(this.productoCodigo.trim()).subscribe(
      (data) => {
        this.EditProducto = data;
        console.log(this.EditProducto);
      },
      (err) => {}
    );
    this.loading = false;
    this.dismiss();
  }

  compareWithEstado = (o1: any, o0: any) => {
    return o1 == o0; // Para comparar '0' y '1'
  };

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
}
