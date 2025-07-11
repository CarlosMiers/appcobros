import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root',
})
export class BluetoothPrintService {
  private isConnected = false;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions
  ) {}

  async checkPermissions(): Promise<void> {
    const info = await Device.getInfo();
    const androidVersion = parseInt(info.osVersion || '0', 10);

    const permisos = [
      this.androidPermissions.PERMISSION.BLUETOOTH,
      this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
      this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
      this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
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
      throw new Error('Permisos insuficientes para usar Bluetooth');
    }
  }

  async connect(mac: string): Promise<void> {
    const alreadyConnected = await this.bluetoothSerial
      .isConnected()
      .catch(() => false);
    if (alreadyConnected) {
      console.log('[BLE] Ya conectado. Saltando conexión.');
      return;
    }

    return new Promise((resolve, reject) => {
      const sub = this.bluetoothSerial.connectInsecure(mac).subscribe(
        () => {
          this.isConnected = true;
          console.log('[BLE] Conexión exitosa');
          sub.unsubscribe();
          resolve();
        },
        (err) => {
          console.error('[BLE] Error de conexión:', err);
          sub.unsubscribe();
          reject(err);
        }
      );
    });
  }

  async printRaw(data: Uint8Array): Promise<void> {
    if (!data || !(data instanceof Uint8Array)) {
      throw new Error('El dato proporcionado no es un Uint8Array válido');
    }

    if (!this.isConnected) {
      throw new Error('No hay conexión activa con la impresora');
    }

    // Envía como ArrayBuffer
    const buffer = data.buffer;

    await new Promise<void>((resolve, reject) => {
      this.bluetoothSerial.write(buffer).then(
        () => {
          console.log('[BLE] Datos binarios enviados a la impresora');
          resolve();
        },
        (err) => {
          console.error('[BLE] Error al enviar:', err);
          reject(err);
        }
      );
    });
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('[BLE] Ya está desconectado, saltando...');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    this.bluetoothSerial.disconnect();
    this.isConnected = false;
    console.log('[BLE] Desconectado de la impresora');
  }
}
