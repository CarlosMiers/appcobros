import { Component, Input, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { SharedClienteService } from 'src/app/services/clientes/shared-cliente.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { DetalleProducto } from 'src/app/models/productos/DetalleProducto';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { VentasService } from '../../../services/ventas/ventas.service';
import { BuscarProductosPage } from '../../productos/buscar-productos/buscar-productos/buscar-productos.page';
import { BuscarClientesPage } from '../../clientes/buscar-clientes/buscar-clientes/buscar-clientes.page';
import { ConfigService } from 'src/app/services/configuracion/configuracion.service';
import { Caja } from 'src/app/models/cajas/cajas';
import { CajasService } from 'src/app/services/cajas/cajas.service';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.page.html',
  styleUrls: ['./detalle-venta.page.scss'],
})
export class DetalleVentaPage implements OnInit {
  //NECESARIO PARA OBTENER LOS DATOS DE LA FACTURA A EMITIR
  EditCaja: Caja = {
    codigo: 0,
    nombre: '',
    responsable: '',
    iniciotimbrado: new Date(),
    vencetimbrado: new Date(),
    timbrado: 0,
    factura: 0,
    expedicion: '',
    recibo: 0,
    estado: 1,
    impresoracaja: '',
    createdAt: null,
    updatedAt: null,
  };

  venta = {
    idventa: 0,
    creferencia: '',
    fecha: new Date().toISOString(),
    factura: 0,
    clienteNombre: '',
    formatofactura: '',
    vencimiento: new Date().toISOString(),
    cliente: 1,
    camion: 1,
    nombrecliente: 'CLIENTES VARIOS',
    sucursal: 1,
    moneda: 1,
    comprobante: 1,
    cotizacion: 1,
    vendedor: 1,
    caja: 1,
    supago: 1,
    sucambio: 1,
    exentas: 0,
    gravadas10: 0,
    gravadas5: 0,
    totalneto: 0,
    cuotas: 0,
    iniciovencetimbrado: new Date(),
    vencimientotimbrado: new Date(),
    nrotimbrado: 0,
    idusuario: 1,
  };

  config = {
    vendedor: null,
    caja: null,
    camion: null,
    moneda: null,
    sucursal: null,
  };

  FacturaFormateada: string = '';
  titulo: any = '';
  codigoClienteSeleccionado: number = 0;
  clienteNombre = 'CLIENTES VARIOS';

  @Input() ventaNumero!: number;

  constructor(
    private alertController: AlertController,
    private _cajaService: CajasService,
    private ventasService: VentasService,
    private productosService: ProductosService,
    private loadingService: LoadingService,
    private clienteServices: ClientesService,
    private sharedClienteService: SharedClienteService,
    private toastController: ToastController,
    public modalCtrl: ModalController,
    private configService: ConfigService
  ) {}

  selectedClient: any;

  productos: any[] = [];
  clientes: any[] = [];
  clienteSeleccionado: any;

  async ngOnInit() {
    this.loadProductos();
    this.loadClientes();
    await this.loadConfig();
    this.ObtenerCaja();

    if (!this.ventaNumero || this.ventaNumero === 0) {
      this.titulo = '🧾 Nueva Factura ';
      this.venta = {
        idventa: 0,
        creferencia: this.generarReferencia(),
        fecha: new Date().toISOString().substring(0, 10),
        formatofactura: this.FacturaFormateada,
        factura: Number(this.FacturaFormateada.replace(/-/g, '')),
        clienteNombre: '',
        vencimiento: new Date().toISOString().substring(0, 10),
        cliente: 1,
        nombrecliente: 'CLIENTES VARIOS',
        camion:this.config.camion || 1, // Camión por defecto
        sucursal: this.config.sucursal || 1, // Sucursal por defecto
        moneda: this.config.moneda || 1,
        comprobante: 1,
        cotizacion: 1,
        vendedor: this.config.vendedor || 1,
        caja: this.config.caja || 1,
        supago: 0,
        sucambio: 0,
        exentas: 0,
        gravadas10: 0,
        gravadas5: 0,
        totalneto: 0,
        cuotas: 0,
        iniciovencetimbrado: this.EditCaja.iniciotimbrado,
        vencimientotimbrado: this.EditCaja.vencetimbrado,
        nrotimbrado: this.EditCaja.timbrado,
        idusuario: parseInt(localStorage.getItem('idusuario') || '0', 10), // usuario por defecto,
      };
    } else {
      // Factura existente
      this.titulo = '🧾 Editar Venta N°' + this.ventaNumero;
    }
  }

  // Generar una referencia única de 30 caracteres
  generarReferencia(): string {
    const timestamp = Date.now().toString(); // Convierte el timestamp a string
    const randomString = Math.random().toString(36).substring(2, 20); // Genera una cadena aleatoria de 18 caracteres
    return (timestamp + randomString).substring(0, 30); // Asegura que tenga exactamente 30 caracteres
  }

  // Obtener la caja y generar el número de factura
  async ObtenerCaja() {
    const cajaId = this.config.caja ?? 1; // Usa 1 como valor por defecto si es null
    this._cajaService.getCaja(cajaId).subscribe(
      (data) => {
        this.EditCaja = data;
        console.log('Caja obtenida:', this.EditCaja);
        const expedicion = this.EditCaja.expedicion;
        const factura = Number(this.EditCaja.factura) + 1;
        const facturaFormateada = factura.toString().padStart(7, '0');
        const numeroid = `${expedicion}-${facturaFormateada}`;
        this.venta.formatofactura = numeroid;
        this.venta.factura = Number(numeroid.replace(/-/g, '')); // Actualiza el número de factura en la venta
        this.venta.iniciovencetimbrado= data.iniciotimbrado;
        this.venta.vencimientotimbrado= data.vencetimbrado;
        this.venta.nrotimbrado= data.timbrado; 
        console.log("Vencimiento Inicial ",this.venta.iniciovencetimbrado);
        console.log("Vencimiento Final ",this.venta.vencimientotimbrado);
        console.log("Noro de Timbrado ",this.venta.nrotimbrado);
      },
      (err) => {}
    );
  }

  // Cargar configuración desde el servicio
  async loadConfig() {
    const storedConfig = await this.configService.getConfig();
    if (storedConfig) {
      this.config = storedConfig;
      console.log('Config cargada:', this.config);
    } else {
      console.warn('No se encontró la configuración.');
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

  detalles: DetalleProducto[] = [];
  productoSeleccionado = {
    codprod: '',
    descripcion: '',
    cantidad: 0,
    costo: 0,
    precio: 0,
    ivaporcentaje: 0,
    impuesto: 0,
  };
  codigoProductoSeleccionado = '';

  totalVenta() {
    return Math.ceil(
      this.detalles.reduce(
        (totalneto, detalle) => totalneto + detalle.precio * detalle.cantidad,
        0
      )
    );
  }

  gravadas5() {
    return Math.ceil(
      this.detalles.reduce(
        (total5, detalle) =>
          detalle.ivaporcentaje === 5
            ? total5 + detalle.precio * detalle.cantidad
            : total5,
        0
      )
    );
  }

  gravadas10() {
    return Math.ceil(
      this.detalles.reduce(
        (total10, detalle) =>
          detalle.ivaporcentaje === 10
            ? total10 + detalle.precio * detalle.cantidad
            : total10,
        0
      )
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
      iddetalle:0,
      codprod: this.productoSeleccionado.codprod,
      comentario: this.productoSeleccionado.descripcion,
      cantidad: this.productoSeleccionado.cantidad,
      prcosto: this.productoSeleccionado.costo,
      precio: this.productoSeleccionado.precio,
      ivaporcentaje: this.productoSeleccionado.ivaporcentaje,
      porcentaje:this.productoSeleccionado.ivaporcentaje,
      impuesto: this.productoSeleccionado.ivaporcentaje,
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
    this.productoSeleccionado = {
      codprod: detalle.codprod,
      descripcion: detalle.descripcion,
      cantidad: detalle.cantidad,
      costo: detalle.costo,
      precio: detalle.precio,
      ivaporcentaje: detalle.ivaporcentaje,
      impuesto: detalle.impuesto,
    };
    this.detalles.splice(index, 1);
  }

  // Restablecer los datos del producto seleccionado
  resetProductoSeleccionado() {
    this.productoSeleccionado = {
      codprod: '',
      descripcion: '',
      cantidad: 0,
      costo: 0,
      ivaporcentaje: 0,
      precio: 0,
      impuesto: 0,
    };
    this.codigoProductoSeleccionado = '';
  }

  ValidarCliente() {
    const cliente = this.clientes.find(
      (c) => String(c.codigo) === String(this.venta.cliente) // Convierte ambos a strings si es necesario
    );
    if (cliente) {
      this.venta.cliente = cliente.codigo;
      this.venta.clienteNombre = cliente.nombre;
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
        this.venta.cliente = cliente.codigo;
        this.venta.clienteNombre = cliente.nombre;
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
        ivaporcentaje: producto.ivaporcentaje ? parseFloat(producto.ivaporcentaje) : 0,
        costo: parseFloat(producto.costo),
        precio: parseFloat(producto.precio_maximo),
        impuesto: producto.ivaporcentaje ? parseFloat(producto.ivaporcentaje) : 0,
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
          impuesto: producto.ivaporcentaje ? parseFloat(producto.ivaporcentaje) : 0,
          ivaporcentaje: producto.ivaporcentaje ? parseFloat(producto.ivaporcentaje) : 0,
        };
        this.codigoProductoSeleccionado = producto.codigo;
      }
    });

    await modal.present();
  }

  async guardarVenta() {
    if (
      !this.venta.cliente ||
      !this.venta.comprobante ||
      this.detalles.length === 0
    ) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Faltan datos para completar la Factura',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Crear un objeto que contenga los datos necesarios para el backend
    const ventaConDetalles = {
      creferencia: this.venta.creferencia, // Referencia única
      fecha: this.venta.fecha,
      factura: +this.venta.factura, // Asegurarse de que sea un número
      formatofactura: this.venta.formatofactura, // Formato de la factura
      vencimiento: this.venta.vencimiento,
      cliente: this.venta.cliente,
      nombrecliente: this.venta.nombrecliente,
      sucursal: this.venta.sucursal,
      camion: this.venta.camion,
      moneda: this.venta.moneda,
      comprobante: +this.venta.comprobante, // Asegurarse de que sea un número
      cotizacion: this.venta.cotizacion,
      vendedor: this.venta.vendedor,
      caja: this.venta.caja,
      supago: this.venta.supago,
      sucambio: this.venta.sucambio,
      exentas: this.venta.exentas,
      gravadas10: this.gravadas10(),
      gravadas5: this.gravadas5(),
      totalneto: this.totalVenta(),
      idusuario: this.venta.idusuario,
      detalles: this.detalles.map((detalle) => {
        // Elimina 'numero' de los detalles, ya que lo genera el backend
        const { iddetalle, ...detalleSinNumero } = detalle;
        return detalleSinNumero;
      }),
    };

    // Enviar los datos al servicio de ventas para guardarlos en la base de datos
    if (!this.ventaNumero  || this.ventaNumero === 0) {
      this.ventasService.createVenta(ventaConDetalles).subscribe({
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
          console.error('Error al crear Venta:', error);
          // Manejar el error adecuadamente (mostrar un mensaje al usuario, etc.)
        },
      });
    } else {
      this.ventasService
        .update(this.ventaNumero, ventaConDetalles)
        .subscribe({
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
            console.error('Error al Actualizar Venta:', error);
            // Manejar el error adecuadamente (mostrar un mensaje al usuario, etc.)
          },
        });
    }
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
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
}
