import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async saveConfig(data: any) {
    await this._storage?.set('config', data);
  }

  async getConfig(): Promise<any> {
    return await this._storage?.get('config');
  }
}
