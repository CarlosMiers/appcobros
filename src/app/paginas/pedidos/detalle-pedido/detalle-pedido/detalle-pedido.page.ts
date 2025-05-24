import { Input, Component } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { DetalleProducto } from 'src/app/models/productos/DetalleProducto';
import { SharedClienteService } from '../../../../services/clientes/shared-cliente.service';
import { PedidosService } from '../../../../services/pedidos/pedidos.service';
import { ProductosService } from '../../../../services/productos/productos.service';
import { LoadingService } from '../../../../services/loading/loading.service';
import { ClientesService } from '../../../../services/clientes/clientes.service';
import { BuscarClientesPage } from 'src/app/paginas/clientes/buscar-clientes/buscar-clientes/buscar-clientes.page';
import { SharedProductoService } from 'src/app/services/productos/shared-producto.service';
import { BuscarProductosPage } from 'src/app/paginas/productos/buscar-productos/buscar-productos/buscar-productos.page';

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
    codusuario: 0,
    total: 0,
  };

  codigoClienteSeleccionado: number = 0;
  @Input() pedidoNumero!: number;

  constructor(
    private alertController: AlertController,
    private pedidosService: PedidosService,
    private productosService: ProductosService,
    private loadingService: LoadingService,
    private clienteServices: ClientesService,
    private sharedClienteService: SharedClienteService,
    private sharedProductoService: SharedProductoService,
    private toastController: ToastController,
    public modalCtrl: ModalController
  ) {}

  selectedClient: any;

  productos: any[] = [];
  clientes: any[] = [];
  clienteSeleccionado: any;

  ngOnInit() {
    this.loadProductos();
    this.loadClientes();

    if (!this.pedidoNumero || this.pedidoNumero === 0) {
      this.pedido = {
        numero: 0,
        fecha: new Date().toISOString().substring(0, 10),
        cliente: this.selectedClient?.codigo || '',
        clienteNombre: this.selectedClient?.nombre || '',
        comprobante: 1, // comprobante por defecto
        codusuario: 1, // usuario por defecto
        total: 0,
      };
    } else {
      // Pedido existente
      this.loadPedidoDesdeApi(this.pedidoNumero);
    }
  }

  ionViewDidEnter() {
    const clienteSeleccionado = this.sharedClienteService.getSelectedClient();
    if (
      clienteSeleccionado &&
      clienteSeleccionado.codigo !== this.pedido.cliente
    ) {
      this.pedido.cliente = clienteSeleccionado.codigo;
      this.pedido.clienteNombre = clienteSeleccionado.nombre;
    }
  }

  // Productos disponibles para seleccionar
  loadProductos() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });
    this.productosService.getTodos().subscribe((data) => {
      this.productos = data; //
      console.log('Productos:', this.productos);
    });
    this.loadingService.dismiss();
  }

  //Clientes disponibles para seleccionar
  loadClientes() {
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });
    this.clienteServices.getTodos().subscribe((data) => {
      this.clientes = data; //
    });
    this.loadingService.dismiss();
  }

  // Lista de clientes para selección

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

  // Guardar el pedido

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
      codusuario: this.pedido.codusuario,
      totalneto: this.totalPedido(),
      detalles: this.detalles.map((detalle) => {
        // Elimina 'numero' de los detalles, ya que lo genera el backend
        const { iddetalle, ...detalleSinNumero } = detalle;
        return detalleSinNumero;
      }),
    };

    // Enviar los datos al servicio de pedidos para guardarlos en la base de datos
    if (!this.pedidoNumero || this.pedidoNumero === 0) {
      this.pedidosService.createPreventa(pedidoConDetalles).subscribe({
        next: async (response) => {
          const toast = await this.toastController.create({
            message: response.message,
            duration: 3000,
            position: 'middle',
            cssClass: 'custom-toast', // Aplica la clase CSS personalizada
          });
          await toast.present();
          this.dismiss();
        },
        error: (error) => {
          console.error('Error al crear preventa:', error);
          // Manejar el error adecuadamente (mostrar un mensaje al usuario, etc.)
        },
      });
    } else {
      
    }
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

  async abrirBusquedaCliente() {
    const modal = await this.modalCtrl.create({
      component: BuscarClientesPage,
      componentProps: {
        clientes: this.clientes,
      },
    });

    modal.onDidDismiss().then((result) => {
      const cliente = result.data;
      if (cliente) {
        this.pedido.cliente = cliente.codigo;
        this.pedido.clienteNombre = cliente.nombre;
      }
    });

    await modal.present();
  }

  ValidarProducto() {
    const codigoIngresado = String(this.codigoProductoSeleccionado).trim();
    console.log('Código a buscar:', codigoIngresado);

    const producto = this.productos.find(
      (p) => String(p.codigo).trim() === String(codigoIngresado).trim()
    );

    if (producto) {
      this.productoSeleccionado = {
        codprod: producto.codigo,
        descripcion: producto.nombre,
        cantidad: 1,
        costo: parseFloat(producto.costo),
        precio: parseFloat(producto.precio_maximo),
        impuesto: producto.impuesto ? parseFloat(producto.impuesto) : 0,
      };
    } else {
      this.abrirBusquedaProducto();
    }
  }

  async abrirBusquedaProducto() {
    const modal = await this.modalCtrl.create({
      component: BuscarProductosPage,
      componentProps: {
        productos: this.productos,
      },
    });

    modal.onDidDismiss().then((result) => {
      const producto = result.data;
      if (producto) {
        this.productoSeleccionado = {
          codprod: producto.codigo,
          descripcion: producto.nombre,
          cantidad: 1,
          costo: parseFloat(producto.costo),
          precio: parseFloat(producto.precio_maximo),
          impuesto: producto.impuesto ? parseFloat(producto.impuesto) : 0,
        };
        this.codigoProductoSeleccionado = producto.codigo;
      }
    });

    await modal.present();
  }

  compareWithComprobante = (o1: any, o2: any) => {
    return o1 == o2; // Para comparar '1' y '2'
  };

  async goBack() {
    return await this.modalCtrl.dismiss();
  }

  async regresarListado() {
    return await this.modalCtrl.dismiss();
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  loadPedidoDesdeApi(numeroPedido: number) {
    this.pedidosService.getPreventaByNumero(numeroPedido).subscribe({
      next: (data) => {
        console.log('Datos de la API:', data); // Aquí verás la respuesta completa

        this.pedido = {
          numero: data.numero, // Usar 'numero' directamente si la respuesta tiene esa estructura
          fecha: data.fecha,
          cliente: data.cliente,
          clienteNombre: data.clienteNombre,
          comprobante: data.comprobante,
          codusuario: data.codusuario,
          total: data.totalneto, // totalneto es el campo que devuelve la API
        };

        // Aquí asumiendo que 'detalles' es el array correcto y que existe en la respuesta
        this.detalles = data.detalles; // Corregir 'data.detalle' a 'data.detalles'
      },
      error: (err) => {
        console.error('Error al cargar pedido', err);
      },
    });
  }
}
