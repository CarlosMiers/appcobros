import { Component } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Platform, AlertController, ModalController } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Device } from '@capacitor/device';
import { CajasService } from '../services/cajas/cajas.service';
import { Caja } from '../models/cajas/cajas';
import { ConfigService } from 'src/app/services/configuracion/configuracion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  dispositivos: any[] = [];
  dispositivoSeleccionado: any;

  //NECESARIO PARA OBTENER LOS DATOS DE LA FACTURA A EMITIR

  mensajeToast: string = '';
  nombreDispositivo: string = '';
  macDispositivo: string = '';

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

  config = {
    vendedor: null,
    caja: null,
    camion: null,
    moneda: null,
    sucursal: null,
  };

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    private bluetoothSerial: BluetoothSerial,
    private platform: Platform,
    private configService: ConfigService,
    private alertCtrl: AlertController,
    private _cajaService: CajasService,
    private androidPermissions: AndroidPermissions
  ) {}

  async ngOnInit() {
    await this.loadConfig();
    await this.platform.ready();
    await this.verificarPermisosBluetooth();
    this.bluetoothSerial.isEnabled().then(
      () => this.alerta('✅ Bluetooth activado'),
      () => this.bluetoothSerial.enable()
    );
  }

  async verificarPermisosBluetooth() {
    const deviceInfo = await Device.getInfo();
    const sdkVersion = parseInt(deviceInfo.osVersion?.split('.')[0] || '0');

    const permisos = [
      this.androidPermissions.PERMISSION.BLUETOOTH,
      this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
      this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
      this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
    ];

    if (sdkVersion >= 12) {
      permisos.push(
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
        this.androidPermissions.PERMISSION.BLUETOOTH_SCAN
      );
    }

    if (sdkVersion < 10) {
      permisos.push(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
    }

    try {
      await this.androidPermissions.requestPermissions(permisos);
      console.log('✅ Permisos Bluetooth otorgados');
    } catch (e) {
      this.alerta('❌ No se pudieron conceder permisos Bluetooth');
    }
  }

  listarDispositivos() {
    this.bluetoothSerial.list().then(
      (dispositivos) => (this.dispositivos = dispositivos),
      (error) => this.alerta('❌ Error al listar dispositivos: ' + error)
    );
  }

  conectar(dispositivo: any) {
    this.dispositivoSeleccionado = dispositivo;
    this.bluetoothSerial.connect(dispositivo.address).subscribe(
      () => this.alerta('✅ Conectado a ' + dispositivo.name),
      (error) => this.alerta('❌ Error al conectar: ' + error)
    );
  }

  async imprimirTicket() {
    if (!this.dispositivoSeleccionado) {
      this.alerta('⚠️ Seleccioná un dispositivo');
      return;
    }
    let ticket = 'PRUEBA DE IMPRESION\n';

    await this.bluetoothSerial.write(ticket);

    await this.bluetoothSerial.disconnect().then(
      () => console.log('🔌 Desconectado exitosamente'),
      (err) => console.warn('⚠️ Falló la desconexión:', err)
    );
  }

  async alerta(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Información',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async updateImpresora() {
    if (!this.dispositivoSeleccionado?.address) {
      this.alerta('⚠️ No hay dispositivo seleccionado para guardar');
      return;
    }

    this.EditCaja.impresoracaja = this.dispositivoSeleccionado.address;
    this.EditCaja.codigo = this.config.caja ?? 1;

    this.nombreDispositivo = this.dispositivoSeleccionado.name || 'Sin nombre';
    this.macDispositivo = this.dispositivoSeleccionado.address;

    try {
      const response = await this._cajaService.updateImpresoraCaja(
        this.EditCaja
      );

      console.log('🧾 Respuesta API:', response);

      if (response?.status === 200 || response?.ok === true) {
        this.mostrarToast('✅ Impresora guardada correctamente');
      } else {
        this.mostrarToast('⚠️ No se pudo guardar la impresora');
      }
    } catch (error) {
      console.error('❌ Error al guardar impresora:', error);
      this.mostrarToast('❌ Error de conexión con la API');
    }
  }

  async mostrarToast(mensaje: string) {
    this.mensajeToast = mensaje;
    setTimeout(() => (this.mensajeToast = ''), 2500);
  }

  async loadConfig() {
    const storedConfig = await this.configService.getConfig();
    if (storedConfig) {
      this.config = storedConfig;
      console.log('Config cargada:', this.config);
    } else {
      console.warn('No se encontró la configuración.');
    }
  }

  async dismiss() {
    this.router.navigate(['/menu']);
  }
}
