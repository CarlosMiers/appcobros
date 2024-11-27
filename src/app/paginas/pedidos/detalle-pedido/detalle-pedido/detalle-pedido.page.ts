/*import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedidos/pedido';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';


@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {
  orderForm!: FormGroup;
  titulo: any = '';
  loading: boolean = false;

  EditPedido: Pedido = {
    numero:0,
    fecha: new Date(),
    comprobante:1,
    cliente: 1,
    total:0,
    createdAt: null,
    updatedAt: null,
  };*/

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DetalleProducto } from 'src/app/models/productos/DetalleProducto';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage {
  pedido = {
    numero: 0,
    fecha: new Date().toISOString(),
    cliente: 0,
    clienteNombre: '',
    comprobante: '',
    total: 0,
  };

  codigoClienteSeleccionado: number = 0;

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  clienteSeleccionado: any;

  ngOnInit() {}

  ionViewDidEnter() {
    const navigation = window.history.state;
    if (navigation?.clienteSeleccionado) {
      this.clienteSeleccionado = navigation.clienteSeleccionado;
      console.log('Cliente seleccionado recibido:', this.clienteSeleccionado);
    } else {
      console.log('No se recibió cliente seleccionado.');
    }
  }

  // Productos disponibles para seleccionar
  productos = [
    {
      codprod: 'P001',
      descripcion: 'Producto 1',
      costo: 10,
      precio: 15,
      impuesto: 1.5,
    },
    {
      codprod: 'P002',
      descripcion: 'Producto 2',
      costo: 12,
      precio: 18,
      impuesto: 1.8,
    },
    {
      codprod: 'P003',
      descripcion: 'Producto 3',
      costo: 8,
      precio: 14,
      impuesto: 1.4,
    },
  ];

  // Lista de clientes para selección
  clientes = [
    { codigo: 1, nombre: 'Carlos González' },
    { codigo: 2, nombre: 'Alice Ferreira' },
    { codigo: 3, nombre: 'Camila Lujan' },
  ];

  detalles: DetalleProducto[] = [];
  productoSeleccionado = {
    codprod: '',
    descripcion: '',
    costo: 0,
    precio: 0,
    impuesto: 0,
  };
  codigoProductoSeleccionado = '';

  // Calcular el total del pedido
  totalPedido() {
    return this.detalles.reduce((total, item) => total + item.precio, 0);
  }

  // Seleccionar un producto por su código
  seleccionarProducto() {
    const producto = this.productos.find(
      (p) => p.codprod === this.codigoProductoSeleccionado
    );
    if (producto) {
      this.productoSeleccionado = { ...producto };
    }
  }

  // Agregar producto al detalle
  agregarProducto() {
    // Verificar si se seleccionó un producto y tiene todos los datos
    if (!this.productoSeleccionado.codprod) {
      console.error('No se ha seleccionado un producto correctamente');
      return;
    }

    const detalle: DetalleProducto = {
      codprod: this.productoSeleccionado.codprod,
      descripcion: this.productoSeleccionado.descripcion,
      costo: this.productoSeleccionado.costo,
      precio: this.productoSeleccionado.precio,
      impuesto: this.productoSeleccionado.impuesto,
    };

    this.detalles.push(detalle);
    this.resetProductoSeleccionado();
  }

  // Eliminar producto del detalle
  eliminarProducto(index: number) {
    this.detalles.splice(index, 1);
  }

  // Editar producto del detalle
  editarProducto(index: number) {
    const detalle = this.detalles[index];
    this.productoSeleccionado = { ...detalle };
    this.detalles.splice(index, 1);
  }

  // Restablecer los datos del producto seleccionado
  resetProductoSeleccionado() {
    this.productoSeleccionado = {
      codprod: '',
      descripcion: '',
      costo: 0,
      precio: 0,
      impuesto: 0,
    };
    this.codigoProductoSeleccionado = '';
  }

  // Guardar el pedido (simulación de envío de datos a la base de datos)
  async guardarPedido() {
    if (
      !this.pedido.cliente ||
      !this.pedido.comprobante ||
      this.detalles.length === 0
    ) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Faltan datos para completar el pedido',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Enviar los datos al backend (simulación)
    console.log('Pedido Guardado', this.pedido, this.detalles);
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Pedido guardado correctamente',
      buttons: ['OK'],
    });
    await alert.present();
  }

  ValidarCliente() {
    const cliente = this.clientes.find(
      (c) => String(c.codigo) === String(this.pedido.cliente) // Convierte ambos a strings si es necesario
    );
    if (cliente) {
      console.log('registro encontrado');
      this.pedido.cliente = cliente.codigo;
      this.pedido.clienteNombre = cliente.nombre;
    } else {
      this.abrirBusquedaCliente();
    }
  }

  abrirBusquedaCliente() {
    this.router.navigateByUrl('/buscar-clientes', {
      state: { clientes: this.clientes },
    });

    /*this.router.navigate(['/buscar-clientes'], {
      state: { clientes: this.clientes }, // Pasa los datos correctamente con 'clientes'
    });*/
  }

  compareWithComprobante = (o1: any, o2: any) => {
    return o1 == o2; // Para comparar '1' y '2'
  };
}
