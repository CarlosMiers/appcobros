import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public loadingController: LoadingController) {
  }

  async present(options: object) {
    // Descartar todos los cargadores pendientes antes de crear el nuevo
    await this.dismiss();

    await this.loadingController
      .create(options)
      .then(res => {
        res.present();
      });
  }

  /**
   * Descartar todos los cargadores pendientes, si los hay
   */
  async dismiss() {
    while (await this.loadingController.getTop() !== undefined) {
      await this.loadingController.dismiss();
    }
  }
}