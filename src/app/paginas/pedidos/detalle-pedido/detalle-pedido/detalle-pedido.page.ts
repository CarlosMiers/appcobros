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
  titulo: any = '';
  codigoClienteSeleccionado: number = 0;
  @Input() pedidoNumero!: number;

  constructor(
    private alertController: AlertController,
    private pedidosService: PedidosService,
    private productosService: ProductosService,
    private loadingService: LoadingService,
    private clienteServices: ClientesService,
    private sharedClienteService: SharedClienteService,
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
      this.titulo = '🧾 Nuevo Pedido ';
      this.pedido = {
        numero: 0,
        fecha: new Date().toISOString().substring(0, 10),
        cliente: this.selectedClient?.codigo || '',
        clienteNombre: this.selectedClient?.nombre || '',
        comprobante: 1, // comprobante por defecto
        codusuario: parseInt(localStorage.getItem('idusuario') || '0', 10), // usuario por defecto
        total: 0,
      };
    } else {
      // Pedido existente
      this.titulo = '🧾 Editar Pedido N°' + this.pedidoNumero;
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
  async loadProductos() {
    try {
      const data = await this.productosService.getTodos();
      this.productos = data; // Asigna directamente el array de productos
    } catch (error) {
      // Manejo de error si ocurre algo al cargar los productos
      console.error('Error al cargar los productos:', error);
      this.loadingService.dismiss();
      alert(
        'Ocurrió un error al cargar los productos. Por favor, intenta de nuevo.'
      );
    }
  }

  //Clientes disponibles para seleccionar
  async loadClientes() {
    try {
      // Usamos el servicio para obtener todos los clientes
      const data = await this.clienteServices.getTodos();
      this.clientes = data; // Asigna los clientes obtenidos
    } catch (error) {
      console.error('Error al cargar los clientes:', error);
      // Puedes agregar un mensaje adicional de error aquí si es necesario
    }
  }

  detalles: DetalleProducto[] = [];

  productoSeleccionado = {
    codprod: '',
    descripcion: '',
    cantidad: 0,
    costo: 0,
    precio: 0,
    ivaporcentaje: 0,
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
      idventadet: 0,
      iddetalle: 0,
      codprod: this.productoSeleccionado.codprod,
      comentario: this.productoSeleccionado.descripcion,
      cantidad: this.productoSeleccionado.cantidad,
      prcosto: this.productoSeleccionado.costo,
      precio: this.productoSeleccionado.precio,
      porcentaje:
        Math.round(Number(this.productoSeleccionado.ivaporcentaje)) || 0,
      ivaporcentaje:
        Math.round(Number(this.productoSeleccionado.ivaporcentaje)) || 0,
      impuesto:
        Math.round(Number(this.productoSeleccionado.ivaporcentaje)) || 0, // Asegúrate de que este campo sea un número,
      descripcion: this.productoSeleccionado.descripcion,
      costo: this.productoSeleccionado.costo,
      producto: {
        codigo: '',
        descripcion: '',
      }, // Aquí puedes agregar más detalles del producto si es necesario
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
      ivaporcentaje: 0,
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

    try {
      // Revisar si es un nuevo pedido o uno existente
      if (!this.pedidoNumero || this.pedidoNumero === 0) {
        const response = await this.pedidosService.createPreventa(
          pedidoConDetalles
        );
        const toast = await this.toastController.create({
          message: response.message,
          duration: 3000,
          position: 'middle',
          cssClass: 'custom-toast', // Aplica la clase CSS personalizada
        });
        await toast.present();
        this.dismiss();
      } else {
        const response = await this.pedidosService.update(
          this.pedidoNumero,
          pedidoConDetalles
        );
        const toast = await this.toastController.create({
          message: response.message,
          duration: 3000,
          position: 'middle',
          cssClass: 'custom-toast', // Aplica la clase CSS personalizada
        });
        await toast.present();
        this.dismiss();
      }
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al guardar el pedido. Intenta nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
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
        ivaporcentaje: producto.impuesto ? parseFloat(producto.impuesto) : 0,
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
          ivaporcentaje: producto.ivaporcentaje
            ? parseFloat(producto.ivaporcentaje)
            : 0,
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

  async loadPedidoDesdeApi(numeroPedido: number) {
    try {
      const response = await this.pedidosService.getPreventaByNumero(
        numeroPedido
      ); // Llamada al servicio
      // Asigna cliente y nombre del cliente desde el objeto recibido
      this.pedido = {
        numero: response.numero,
        fecha: response.fecha,
        cliente: response.cliente,
        clienteNombre: response.clientenombre,
        comprobante: response.comprobante,
        codusuario: response.codusuario,
        total: response.totalneto,
      };

      // Asigna los detalles y extrae nombre del producto
      this.detalles = response.detalles.map((detalle: any) => ({
        ...detalle,
        descripcion: detalle.producto?.descripcion || '',
      }));
    } catch (err) {
      console.error('Error al cargar pedido:', err);
    }
  }
}
