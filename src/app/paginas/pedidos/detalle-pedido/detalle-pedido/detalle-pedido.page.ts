import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { DetalleProducto } from 'src/app/models/productos/DetalleProducto';
import { SharedClienteService } from 'src/app/services/clientes/shared-cliente.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

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
    comprobante: 0,
    total: 0,
  };

  codigoClienteSeleccionado: number = 0;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private pedidosService: PedidosService,
    private sharedClienteService: SharedClienteService,
    private toastController: ToastController,
    public modalCtrl: ModalController

  ) {}

  selectedClient: any;

  clienteSeleccionado: any;

  ngOnInit() {}

  ionViewDidEnter() {
    this.selectedClient = this.sharedClienteService.getSelectedClient();
    this.pedido = {
      numero: 0,
      fecha: new Date().toISOString(),
      cliente: this.selectedClient.codigo,
      clienteNombre: this.selectedClient.nombre,
      comprobante: 0,
      total: 0,
    };
  }

  // Productos disponibles para seleccionar
  productos = [
    {
      codprod: '001',
      descripcion: 'COCA 1 LITRO',
      cantidad: 0,
      costo: 7500,
      precio: 9000,
      impuesto: 10,
    },
    {
      codprod: 'P002',
      descripcion: 'LECHE ENTERA 1 LITRO LACTOLANDA',
      cantidad: 0,
      costo: 4500,
      precio: 6500,
      impuesto: 10,
    },
    {
      codprod: 'P003',
      descripcion: 'FOCO LED ECONOMICO',
      cantidad: 0,
      costo: 1500,
      precio: 4500,
      impuesto: 10,
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
    cantidad: 0,
    costo: 0,
    precio: 0,
    impuesto: 0,
  };
  codigoProductoSeleccionado = '';

  // Calcular el total del pedido
  totalPedido() {
    return this.detalles.reduce(
      (totalneto, detalle) => totalneto + detalle.precio * detalle.cantidad,
      0
    );
    //    return this.detalles.reduce((total, item) => total + item.precio, 0);
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
      iddetalle: 0,
      codprod: this.productoSeleccionado.codprod,
      comentario: this.productoSeleccionado.descripcion,
      cantidad: this.productoSeleccionado.cantidad,
      prcosto: this.productoSeleccionado.costo,
      precio: this.productoSeleccionado.precio,
      porcentaje: this.productoSeleccionado.impuesto,
      impuesto: this.productoSeleccionado.impuesto,
      descripcion: this.productoSeleccionado.descripcion,
      costo: this.productoSeleccionado.costo,
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
      cantidad: 0,
      costo: 0,
      precio: 0,
      impuesto: 0,
    };
    this.codigoProductoSeleccionado = '';
  }

  // Guardar el pedido (simulación de envío de datos a la base de datos)

  // Ajusta la función guardarPedido para enviar los detalles correctamente sin el campo 'numero'
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

    // Crear un objeto que contenga los datos necesarios para el backend
    const pedidoConDetalles = {
      fecha: this.pedido.fecha,
      comprobante: +this.pedido.comprobante,
      cliente: this.pedido.cliente,
      totalneto: this.totalPedido(),
      detalles: this.detalles.map((detalle) => {
        // Elimina 'numero' de los detalles, ya que lo genera el backend
        const { iddetalle, ...detalleSinNumero } = detalle;
        return detalleSinNumero;
      }),
    };

    // Enviar los datos al servicio de pedidos para guardarlos en la base de datos
    this.pedidosService.createPreventa(pedidoConDetalles).subscribe({
      next: async (response) => {
        const toast = await this.toastController.create({
          message: response.message,
          duration: 3000,
          position: 'middle',
          cssClass: 'custom-toast', // Aplica la clase CSS personalizada
        });
        await toast.present();      },
      error: (error) => {
        console.error('Error al crear preventa:', error);
        // Manejar el error adecuadamente (mostrar un mensaje al usuario, etc.)
      },
    });
  }

  ValidarCliente() {
    const cliente = this.clientes.find(
      (c) => String(c.codigo) === String(this.pedido.cliente) // Convierte ambos a strings si es necesario
    );
    if (cliente) {
      this.pedido.cliente = cliente.codigo;
      this.pedido.clienteNombre = cliente.nombre;
    } else {
      this.abrirBusquedaCliente();
    }
  }

  abrirBusquedaCliente() {
    /*  this.router.navigateByUrl('/buscar-clientes', {
/*      state: { clientes: this.clientes },
    });*/

    this.router.navigate(['/buscar-clientes'], {
      state: { clientes: this.clientes }, // Pasa los datos correctamente con 'clientes'
    });
  }

  compareWithComprobante = (o1: any, o2: any) => {
    return o1 == o2; // Para comparar '1' y '2'
  };

  goBack() {
    this.router.navigate(['/lista-pedidos']);
  }
  
  regresarListado() {
    this.router.navigate(['/lista-pedidos']);
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }


}
