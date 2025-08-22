import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Device } from '@capacitor/device';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Caja } from 'src/app/models/cajas/cajas';
import { CuentaClientes } from 'src/app/models/cuenta-clientes/cuenta-clientes';
import { BuscarClientesPage } from 'src/app/paginas/clientes/buscar-clientes/buscar-clientes/buscar-clientes.page';
import { CajasService } from 'src/app/services/cajas/cajas.service';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { CobranzasService } from 'src/app/services/cobranzas/cobranzas.service';
import { ConfigService } from 'src/app/services/configuracion/configuracion.service';
import { CuentaClientesService } from 'src/app/services/cuenta-clientes/cuenta-clientes.service';

interface FacturaDetalle {
  idcobro: number;
  iddetalle: any;
  idfactura: number;
  nrofactura: string;
  emision: string;
  comprobante: any;
  saldo: number;
  pago: number;
  capital: number;
  diamora: number;
  mora: number;
  gastos_cobranzas: number;
  moneda: number;
  amortiza: number;
  minteres: number;
  vence: string;
  acreedor: number;
  cuota: number;
  numerocuota: number;
  importe_iva: number;
  punitorio: number;
  fechacobro: string;
  seleccionado?: boolean; // Propiedad que usas en el componente, pero no en el objeto 'cobro'
  documento?: string;
  iddocumento?: number;
  vencimiento?: string;
}

@Component({
  selector: 'app-detalle-cobranza',
  templateUrl: './detalle-cobranza.page.html',
  styleUrls: ['./detalle-cobranza.page.scss'],
})
export class DetalleCobranzaPage implements OnInit {
  pageTitle: string = 'Nuevo';
  idcobro: number = 0;
  numeroRecibo: number = 0;
  // Datos del cobro
  codigoClienteSeleccionado: number = 0;
  clienteNombre = '';

  monedaSeleccionada: number = 1;
  fechaCobro: string = new Date().toISOString().slice(0, 10);
  observacionCobro: string = '';

  // Datos auxiliares
  cuentasFiltradas: any[] = [];
  codigoCliente: number = 0;
  nombreCliente: string = '';
  public cuentasPendientes: CuentaClientes[] = [];
  public totalSeleccionado: number = 0; // Propi

  config = {
    vendedor: null,
    caja: null,
    camion: null,
    moneda: null,
    sucursal: null,
    cobrador: null,
  };

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

  cobranza = {
    idcobro: 0,
    numero: 0,
    importe: 0,
    idpagos: '',
    sucursal: 0,
    cobrador: 0,
    fecha: new Date().toISOString(),
    cliente: 0,
    clienteNombre: '', // Corregido: esta propiedad se usa para la interfaz de usuario
    nombrecliente: '', // Corregido: esta propiedad se usa para el objeto de guardado
    moneda: 1,
    cotizacionmoneda: 0,
    codusuario: 0,
    totalpago: 0,
    observacion: '',
    asiento: 0,
    caja: 0,
  };

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private configService: ConfigService,
    private cuentaClienteService: CuentaClientesService,
    private _cobranzaService: CobranzasService,
    private _cajaService: CajasService,
    public modalCtrl: ModalController,
    private clienteServices: ClientesService, // private cobranzaService: CobranzaService, // private cuentaClientesService: CuentaClientesService
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions
  ) {}

  clientes: any[] = [];
  clienteSeleccionado: any;
  selectedClient: any;

  async ngOnInit() {
    this.idcobro = this.route.snapshot.params['id'];
    this.loadClientes();
    await this.loadConfig();
    this.ObtenerCaja();
    if (this.idcobro == 0) {
      this.pageTitle = '🧾 Nuevo Cobro';
      this.cobranza = {
        idcobro: 0,
        numero: 0,
        importe: 0,
        idpagos: this.generarReferencia(),
        sucursal: this.config.sucursal || 1,
        cobrador: this.config.cobrador || 1,
        fecha: new Date().toISOString().substring(0, 10),
        clienteNombre: '',
        nombrecliente: '',
        cliente: 0,
        moneda: 1,
        cotizacionmoneda: 1,
        codusuario: parseInt(localStorage.getItem('idusuario') || '0', 10), // usuario por defecto,,
        totalpago: 0,
        observacion: '',
        asiento: 0,
        caja: this.config.caja || 1,
      };
    } else {
      this.pageTitle = '🧾 Editar Cobro ';
      this.loadCobranza(this.idcobro);
    }
  }

  async loadClientes() {
    try {
      // Usamos el servicio para obtener todos los clientes
      const data = await this.clienteServices.getTodos();
      this.clientes = data; // Asigna los clientes obtenidos
    } catch (error) {
      // Puedes agregar un mensaje adicional de error aquí si es necesario
    }
  }

  generarReferencia(): string {
    const timestamp = Date.now().toString(); // Convierte el timestamp a string
    const randomString = Math.random().toString(36).substring(2, 20); // Genera una cadena aleatoria de 18 caracteres
    return (timestamp + randomString).substring(0, 30); // Asegura que tenga exactamente 30 caracteres
  }

  async loadCobranza(idcobro: number) {
    // const cobranza = await this.cobranzaService.getCobranzaById(idcobro);
    // this.clienteSeleccionado = cobranza.cliente;
    // this.monedaSeleccionada = cobranza.moneda;
    // this.fechaCobro = cobranza.fecha;
    // this.observacionCobro = cobranza.observacion;
    // this.loadCuentasPendientes();
  }

  async loadConfig() {
    const storedConfig = await this.configService.getConfig();
    if (storedConfig) {
      this.config = storedConfig;
    } else {
      console.warn('No se encontró la configuración.');
    }
  }

  async ObtenerCaja() {
    const cajaId = this.config.caja ?? 1; // Usa 1 como valor por defecto si es null
    try {
      // Hacemos la solicitud para obtener la caja con el ID correspondiente
      const data = await this._cajaService.getCaja(cajaId);

      // Asignamos la respuesta a EditCaja
      this.EditCaja = data;
      const numero = Number(this.EditCaja.recibo) + 1;
      // Asignamos el número de factura formateado y otros valores
      this.cobranza.numero = numero;
      (this.cobranza.fecha = new Date().toISOString().substring(0, 10)),
        console.log(this.cobranza.fecha);
    } catch (error) {
      // Manejo de errores si algo falla en la solicitud
      console.error('Error al obtener la caja:', error);
    }
  }

  recalcularTotal() {
    this.totalSeleccionado = this.cuentasPendientes
      .filter((c) => c.seleccionado)
      .reduce((sum, c) => sum + Number(c.pago || c.saldo), 0);
  }

  getMonedaTexto(monedaId: number): string {
    return monedaId === 1 ? '₲' : '$';
  }

  volver() {
    this.router.navigate(['/lista-cobranza']);
  }

  validarCliente() {
    const cliente = this.clientes.find(
      (c) => String(c.codigo) === String(this.cobranza.cliente) // Convierte ambos a strings si es necesario
    );
    if (cliente) {
      this.cobranza.cliente = cliente.codigo;
      this.cobranza.clienteNombre = cliente.nombre;
      this.cobranza.nombrecliente = cliente.nombre; // Corregido: Asignar también a nombrecliente
      this.loadCuentasPendientes();
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
        this.cobranza.cliente = cliente.codigo;
        this.cobranza.clienteNombre = cliente.nombre;
        this.cobranza.nombrecliente = cliente.nombre; // Corregido: Asignar a nombrecliente
        this.loadCuentasPendientes();
      }
    });
    await modal.present();
  }

  async loadCuentasPendientes() {
    console.log(
      'Cargando cuentas pendientes para el cliente:',
      this.cobranza.cliente
    );

    if (this.cobranza.cliente > 0) {
      try {
        const data = await this.cuentaClienteService.getCuentaCliente(
          this.cobranza.cliente.toString(),
          this.cobranza.moneda.toString()
        );

        this.cuentasPendientes = Array.isArray(data)
          ? data.map((item) => ({ ...item, seleccionado: false }))
          : [{ ...data, seleccionado: false }];

        console.log('Datos de cuentas cargados:', this.cuentasPendientes);
      } catch (error) {
        console.error('Error al cargar las cuentas:', error);
      }
    } else {
      this.cuentasPendientes = [];
      return;
    }
  }

  async guardarCobro() {
    const cuentasSeleccionadas = this.cuentasPendientes.filter(
      (c) => c.seleccionado
    );

    if (cuentasSeleccionadas.length === 0) {
      console.warn('No se seleccionaron cuentas.');
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debe seleccionar al menos una factura para realizar el cobro.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (!this.cobranza.cliente) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Faltan datos para completar el Recibo',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const totalSeleccionado = this.cuentasPendientes
      .filter((c) => c.seleccionado)
      .reduce((sum, c) => sum + Number(c.pago || c.saldo), 0);

    const cobro = {
      idcobro: this.cobranza.idcobro,
      numero: this.cobranza.numero,
      importe: 0, // No se usa directamente
      idpagos: this.cobranza.idpagos,
      sucursal: this.cobranza.sucursal || 1,
      cobrador: this.cobranza.cobrador || 1,
      fecha: this.cobranza.fecha || new Date().toISOString().substring(0, 10),
      cliente: this.cobranza.cliente || 0,
      clienteNombre: this.cobranza.clienteNombre || '', // Usar clienteNombre para la interfaz de usuario
      nombrecliente: this.cobranza.nombrecliente || '', // Usar nombrecliente para el objeto de guardado
      moneda: this.cobranza.moneda || 1,
      cotizacionmoneda: this.cobranza.cotizacionmoneda || 1,
      codusuario:
        this.cobranza.codusuario ||
        parseInt(localStorage.getItem('idusuario') || '0', 10),
      totalpago: totalSeleccionado,
      valores: totalSeleccionado,
      observacion: this.cobranza.observacion || '',
      asiento: 0,
      caja: this.cobranza.caja || this.config.caja || 1,

      detalles: cuentasSeleccionadas.map((c) => ({
        idcobro: this.cobranza.idcobro,
        iddetalle: this.cobranza.idpagos,
        idfactura: c.iddocumento,
        nrofactura: c.documento,
        emision: c.fecha,
        comprobante: c.comprobante,
        saldo: c.saldo,
        pago: Number(c.pago || c.saldo), // Asegurar que es un número
        capital: c.saldo,
        diamora: 0,
        mora: 0,
        gastos_cobranzas: 0,
        moneda: c.moneda,
        amortiza: 0,
        minteres: 0,
        vence: c.vencimiento,
        acreedor: 0,
        cuota: c.cuota,
        numerocuota: c.numerocuota,
        importe_iva: 0,
        punitorio: 0,
        fechacobro:
          this.cobranza.fecha || new Date().toISOString().substring(0, 10),
      })),
    };


    try {
      if (this.idcobro == 0) {
        const response = await this._cobranzaService.createCobranza(cobro);

        const toast = await this.toastController.create({
          message: response.message,
          duration: 3000,
          position: 'middle',
          cssClass: 'custom-toast',
        });

        await this.updateRecibo();
        // Imprimir el recibo
        await this.imprimirRecibo(cobro);
        await toast.present();
      }
    } catch (error) {
      console.error('Error al guardar cobro:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al guardar el cobro. ' + (error as any)?.message,
        buttons: ['OK'],
      });
      await alert.present();
    }
    this.router.navigate(['/lista-cobranza']);
  }

  async updateRecibo() {
    this.EditCaja.recibo = this.cobranza.numero;
    try {
      await this._cajaService.updateReciboCaja(this.EditCaja);
    } catch (error) {
      console.error('Error al actualizar el recibo:', error);
    }
  }

  async imprimirRecibo(cobro: any) {
    const impresoraMAC = this.EditCaja.impresoracaja; // Cambiar por la MAC real
    const contenidoTicket = this.generarTicketTexto(cobro); // Genera Uint8Array

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

      this.bluetoothSerial.connectInsecure(impresoraMAC).subscribe(
        async () => {
          console.log('Conectado a la impresora.');
          await new Promise((r) => setTimeout(r, 1500));
          await this.bluetoothSerial.write(contenidoTicket); // Aquí va el ticket real
          await new Promise((r) => setTimeout(r, 500));
          await this.bluetoothSerial.disconnect();
          alert('Factura impresa correctamente.');
        },
        (error) => {
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
  generarTicketTexto(cobro: any): Uint8Array {
    let contenido = '';

    const centrado = '\x1B\x61\x01';
    const izquierda = '\x1B\x61\x00';
    const negritaOn = '\x1B\x45\x01';
    const negritaOff = '\x1B\x45\x00';

    // Encabezado
    contenido += centrado + negritaOn;

    contenido += `${localStorage.getItem('empresa') || ''}\n`;
    contenido += `${localStorage.getItem('ruc') || ''}\n`;
    contenido += `${localStorage.getItem('direccion') || ''}\n`;
    contenido += `${localStorage.getItem('telefono') || ''}\n`;
    contenido += `${localStorage.getItem('ramo') || ''}\n`;
    contenido += `Fecha: ${this.formatearFechaPY(cobro.fecha)}\n`;
    contenido += `Hora: ${new Date().toLocaleTimeString()}\n`;
    contenido += `Cliente: ${cobro.nombrecliente}\n`; // Corregido: Usar 'nombrecliente'
    contenido += `RECIBO DE DINERO: ${cobro.numero}\n`;
    contenido += negritaOff + izquierda;

    // Detalle de facturas cobradas
    contenido += centrado + negritaOn;
    contenido += 'DETALLE DE COBRO\n';
    contenido += 'Nro Factura   Saldo   Pago\n';
    contenido += negritaOff + izquierda;
    // Se recorre el array `detalles` del objeto `cobro`

    cobro.detalles.forEach((d: FacturaDetalle) => {
      // Corregido: Eliminar el filtro por 'seleccionado' ya que 'detalles' solo contiene los seleccionados
      const nroFactura = d.nrofactura.slice(0, 15);
      const saldo = Number(d.saldo).toFixed(0); // Asegurarse de que es un número
      const pago = Number(d.pago).toFixed(0); // Asegurarse de que es un número

      let linea = `${nroFactura.padEnd(15)}`;
      linea += `${saldo.padStart(7)}`;
      linea += `${pago.padStart(7)}\n`;
      contenido += linea;
    });

    // Totales
    contenido += `TOTAL PAGADO: ${
      Number(cobro.totalpago).toFixed(0).padStart(15)
    }\n`; // Corregido: Usar 'totalpago'

    // Mensaje final
    contenido += centrado;
    contenido += 'Gracias por su Pago\n\n\n';

    // Corte de papel (si aplica)
    contenido += '\x1D\x56\x00';

    const encoder = new TextEncoder();
    return encoder.encode(contenido);
  }

  formatearFechaPY(fechaISO: string): string {
    const [año, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${año}`;
  }
}
