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
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Device } from '@capacitor/device';

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
    private configService: ConfigService,
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions
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
        camion: this.config.camion || 1, // Camión por defecto
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
      this.titulo = '🧾 Editar Venta ';
      this.loadVentaDesdeApi(this.ventaNumero);
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

    try {
      // Hacemos la solicitud para obtener la caja con el ID correspondiente
      const data = await this._cajaService.getCaja(cajaId);

      // Asignamos la respuesta a EditCaja
      this.EditCaja = data;
      console.log('Caja obtenida:', this.EditCaja);

      const expedicion = this.EditCaja.expedicion;
      const factura = Number(this.EditCaja.factura) + 1;
      const facturaFormateada = factura.toString().padStart(7, '0');
      const numeroid = `${expedicion}-${facturaFormateada}`;

      // Asignamos el número de factura formateado y otros valores
      this.venta.formatofactura = numeroid;
      this.venta.factura = Number(numeroid.replace(/-/g, '')); // Actualiza el número de factura en la venta
      this.venta.iniciovencetimbrado = data.iniciotimbrado;
      this.venta.vencimientotimbrado = data.vencetimbrado;
      this.venta.nrotimbrado = data.timbrado;
    } catch (error) {
      // Manejo de errores si algo falla en la solicitud
      console.error('Error al obtener la caja:', error);
    }
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
      iddetalle: 0,
      codprod: this.productoSeleccionado.codprod,
      comentario: this.productoSeleccionado.descripcion,
      cantidad: this.productoSeleccionado.cantidad,
      prcosto: this.productoSeleccionado.costo,
      precio: this.productoSeleccionado.precio,
      ivaporcentaje: this.productoSeleccionado.ivaporcentaje,
      porcentaje: this.productoSeleccionado.ivaporcentaje,
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
        ivaporcentaje: producto.ivaporcentaje
          ? parseFloat(producto.ivaporcentaje)
          : 0,
        costo: parseFloat(producto.costo),
        precio: parseFloat(producto.precio_maximo),
        impuesto: producto.ivaporcentaje
          ? parseFloat(producto.ivaporcentaje)
          : 0,
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
          impuesto: producto.ivaporcentaje
            ? parseFloat(producto.ivaporcentaje)
            : 0,
          ivaporcentaje: producto.ivaporcentaje
            ? parseFloat(producto.ivaporcentaje)
            : 0,
        };
        this.codigoProductoSeleccionado = producto.codigo;
      }
    });

    await modal.present();
  }

  async guardarVenta() {
    // Validación de campos obligatorios
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
      idventa: this.venta.idventa, // ID de la venta, si es una nueva será 0
      creferencia: this.venta.creferencia, // Referencia única
      fecha: this.venta.fecha,
      factura: +this.venta.factura, // Asegurarse de que sea un número
      formatofactura: this.venta.formatofactura, // Formato de la factura
      vencimiento: this.venta.vencimiento,
      cliente: this.venta.cliente,
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
      cuotas: this.venta.cuotas,
      iniciovencetimbrado: this.venta.iniciovencetimbrado,
      vencimientotimbrado: this.venta.vencimientotimbrado,
      nrotimbrado: this.venta.nrotimbrado,
      idusuario: this.venta.idusuario,
      detalles: this.detalles.map((detalle) => {
        // Elimina 'numero' de los detalles, ya que lo genera el backend
        const { iddetalle, ...detalleSinNumero } = detalle;
        return detalleSinNumero;
      }),
    };

    try {
      // Enviar los datos al servicio de ventas para guardarlos en la base de datos
      if (!this.ventaNumero || this.ventaNumero === 0) {
        const response = await this.ventasService.createVenta(ventaConDetalles);

        // Mostramos un toast con la respuesta
        const toast = await this.toastController.create({
          message: response.message,
          duration: 3000,
          position: 'middle',
          cssClass: 'custom-toast',
        });

        this.updateFactura();
        // Presentar el toast y cerrar el modal
        await toast.present();
        this.imprimirTicket(ventaConDetalles)
        this.dismiss();
      } else {
        // Si ya existe una venta, actualizarla
        const response = await this.ventasService.updateVenta(
          this.ventaNumero,
          ventaConDetalles
        );

        // Mostrar el mensaje de éxito
        const toast = await this.toastController.create({
          message: response.message,
          duration: 3000,
          position: 'middle',
          cssClass: 'custom-toast',
        });

        await toast.present();
        this.imprimirTicket(ventaConDetalles)
        this.dismiss();
      }
    } catch (error) {
      console.error('Error al guardar/actualizar venta:', error);
      // Manejar el error de forma adecuada (alerta, mensaje en consola, etc.)
    }
  }

  async loadVentaDesdeApi(numeroVenta: number) {
    try {
      // Llamamos al servicio para obtener la venta por su número
      const data = await this.ventasService.getVentaByNumero(numeroVenta);

      // Asigna los valores del objeto recibido
      this.venta = {
        idventa: data.idventa,
        formatofactura: data.formatofactura,
        factura: data.factura,
        creferencia: data.creferencia,
        fecha: data.fecha, // <-- Agregado
        vencimiento: data.vencimiento,
        camion: data.camion,
        sucursal: data.sucursal,
        moneda: data.moneda,
        comprobante: data.comprobante,
        cotizacion: data.cotizacion,
        vendedor: data.vendedor,
        caja: data.caja,
        supago: data.supago,
        sucambio: data.sucambio,
        exentas: data.exentas,
        gravadas10: data.gravadas10,
        gravadas5: data.gravadas5,
        totalneto: data.totalneto,
        cuotas: data.cuotas,
        iniciovencetimbrado: data.iniciovencetimbrado,
        vencimientotimbrado: data.vencimientotimbrado,
        nrotimbrado: data.nrotimbrado,
        idusuario: data.idusuario,
        cliente: data.cliente,
        nombrecliente: data.nombrecliente ?? data.clientenombre ?? '', // <-- Agregado
        clienteNombre: data.clientenombre,
      };

      // Asigna los detalles y extrae el nombre del producto
      this.detalles = data.detalles.map((detalle: any) => ({
        ...detalle,
        descripcion: detalle.producto?.descripcion || '',
      }));
    } catch (error) {
      console.error('Error al cargar la venta:', error);
    }
  }

  async updateFactura() {
    // Creamos el objeto con el código de la caja que queremos actualizar
    const caja = {
      codigo: this.venta.caja, // Este es el código de la venta o caja que quieres actualizar
    };

    try {
      // Llamamos al servicio para actualizar la factura usando await
      const response = await this._cajaService.updateFacturaCaja(caja);

      // Aquí puedes manejar la respuesta si es necesario
      console.log('Factura actualizada:', response);
    } catch (error) {
      // Manejo de errores
      console.error('Error al actualizar la factura:', error);
    }
  }


  // Paso 3: Enviar un texto de prueba ESC/POS a la impresora
  async imprimirTest() {
    const impresoraMAC = 'DC:0D:30:77:1E:46'; // Cambiar por MAC real
    const textoTest = 'PRUEBA DE IMPRESIÓN\n\n';

    try {
      const deviceInfo = await Device.getInfo();
      const androidVersion = parseInt(deviceInfo.osVersion || '0', 10);
      console.log('Versión de Android:', androidVersion);

      const permisos = [
        this.androidPermissions.PERMISSION.BLUETOOTH,
        this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
        this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      ];

      if (androidVersion >= 13) {
        permisos.push(this.androidPermissions.PERMISSION.NEARBY_WIFI_DEVICES);
      }

      await this.androidPermissions.requestPermissions(permisos);

      const result = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT
      );

      if (!result.hasPermission) {
        alert('No se concedieron los permisos necesarios.');
        return;
      }

      console.log('Intentando conectar a la impresora...');

      this.bluetoothSerial.connectInsecure(impresoraMAC).subscribe(
        async () => {
          console.log('Conectado a la impresora.');

          await new Promise((r) => setTimeout(r, 1500));

          await this.bluetoothSerial.write(textoTest);
          console.log('Texto enviado correctamente.');

          await new Promise((r) => setTimeout(r, 500));

          await this.bluetoothSerial.disconnect();
          console.log('Desconectado de la impresora.');

          alert('Texto de prueba impreso exitosamente');
        },
        (error) => {
          console.error('Error de conexión:', error);
          alert(
            'No se pudo conectar a la impresora. Verifica que esté encendida y emparejada.'
          );
        }
      );
    } catch (error) {
      console.error('Error durante la impresión:', error);

      const message = (error as any)?.message || '';

      if (message.includes('Unable to connect')) {
        alert(
          'No se pudo conectar a la impresora. Verifica que esté encendida y emparejada.'
        );
      } else if (message.includes('write')) {
        alert('Error al enviar datos. Verifica el formato del texto.');
      } else {
        alert('Error inesperado: ' + JSON.stringify(error));
      }
    }
  }

  async imprimirTicket(ventaConDetalles: any) {
    const impresoraMAC = 'DC:0D:30:77:1E:46'; // Cambiar por la MAC real
    const contenidoTicket = this.generarTicketTexto(ventaConDetalles); // Genera Uint8Array

    try {
      const deviceInfo = await Device.getInfo();
      const androidVersion = parseInt(deviceInfo.osVersion || '0', 10);
      console.log('Versión de Android:', androidVersion);

      const permisos = [
        this.androidPermissions.PERMISSION.BLUETOOTH,
        this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
        this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      ];

      if (androidVersion >= 13) {
        permisos.push(this.androidPermissions.PERMISSION.NEARBY_WIFI_DEVICES);
      }

      await this.androidPermissions.requestPermissions(permisos);

      const result = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT
      );

      if (!result.hasPermission) {
        alert('No se concedieron los permisos necesarios.');
        return;
      }

      console.log('Intentando conectar a la impresora...');

      this.bluetoothSerial.connectInsecure(impresoraMAC).subscribe(
        async () => {
          console.log('Conectado a la impresora.');

          await new Promise((r) => setTimeout(r, 1500));

          await this.bluetoothSerial.write(contenidoTicket); // Aquí va el ticket real
          console.log('Ticket enviado correctamente.');

          await new Promise((r) => setTimeout(r, 500));

          await this.bluetoothSerial.disconnect();
          console.log('Desconectado de la impresora.');

          alert('Factura impresa correctamente.');
        },
        (error) => {
          console.error('Error de conexión:', error);
          alert(
            'No se pudo conectar a la impresora. Verifica que esté encendida y emparejada.'
          );
        }
      );
    } catch (error) {
      console.error('Error durante la impresión:', error);

      const message = (error as any)?.message || '';

      if (message.includes('Unable to connect')) {
        alert(
          'No se pudo conectar a la impresora. Verifica que esté encendida y emparejada.'
        );
      } else if (message.includes('write')) {
        alert('Error al enviar datos. Verifica el formato del texto.');
      } else {
        alert('Error inesperado: ' + JSON.stringify(error));
      }
    }
  }

  // Paso 4: Generar el texto completo del ticket (usando ESC/POS)
  generarTicketTexto(ventaConDetalles: any): Uint8Array {
    let contenido = '';

    const centrado = '\x1B\x61\x01';
    const izquierda = '\x1B\x61\x00';
    const negritaOn = '\x1B\x45\x01';
    const negritaOff = '\x1B\x45\x00';

    // Encabezado
    contenido += centrado + negritaOn;
    contenido += 'FACTURA ELECTRÓNICA\n';
    contenido += 'GO-LINK COMERCIO\n';
    contenido += negritaOff + izquierda;
    contenido += '-'.repeat(32) + '\n';

    // Datos generales
    contenido += `Fecha: ${ventaConDetalles.fecha}\n`;
    contenido += `Factura Nº: ${ventaConDetalles.factura}\n`;
    contenido += `Cliente: ${
      ventaConDetalles.cliente?.nombre || ventaConDetalles.cliente
    }\n`;
    contenido += `Sucursal: ${ventaConDetalles.sucursal}\n`;
    contenido += `Camión: ${ventaConDetalles.camion}\n`;
    contenido += `Vendedor: ${ventaConDetalles.vendedor}\n`;
    contenido += `Moneda: ${ventaConDetalles.moneda}\n`;
    contenido += '-'.repeat(32) + '\n';

    // Timbrado
    contenido += `Timbrado: ${ventaConDetalles.nrotimbrado}\n`;
    contenido += `Válido: ${ventaConDetalles.iniciovencetimbrado} al\n         ${ventaConDetalles.vencimientotimbrado}\n`;
    contenido += '-'.repeat(32) + '\n';

    // Detalle de productos
    contenido += 'Detalle de productos:\n';
    ventaConDetalles.detalles.forEach((d: any) => {
      const descripcion = d.producto?.descripcion || d.descripcion;
      const precioTotal = (Number(d.cantidad) * Number(d.precio)).toFixed(0);

      contenido += descripcion.slice(0, 32) + '\n';
      const lineaPrecio =
        `${d.cantidad} x ${d.precio}`.padEnd(16) +
        `= ${precioTotal}`.padStart(14);
      contenido += lineaPrecio + '\n';
    });

    contenido += '-'.repeat(32) + '\n';

    // Totales
    contenido += `GRAV. 10%: ${ventaConDetalles.gravadas10
      .toFixed(0)
      .padStart(20)}\n`;
    contenido += `GRAV. 5%:  ${ventaConDetalles.gravadas5
      .toFixed(0)
      .padStart(20)}\n`;
    contenido += `EXENTAS:   ${(ventaConDetalles.exentas?.toFixed(0) || 0)
      .toString()
      .padStart(20)}\n`;
    contenido += `TOTAL:     ${ventaConDetalles.totalneto
      .toFixed(0)
      .padStart(20)}\n`;

    contenido += '-'.repeat(32) + '\n';

    // Mensaje final
    contenido += centrado;
    contenido += '¡Gracias por su compra!\n\n\n';

    // Corte de papel (si aplica)
    contenido += '\x1D\x56\x00';

    const encoder = new TextEncoder();
    return encoder.encode(contenido);
  }
  // Paso 5: Imprimir el ticket completo

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
