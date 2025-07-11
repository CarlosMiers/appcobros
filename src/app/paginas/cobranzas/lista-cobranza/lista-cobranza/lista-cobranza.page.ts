import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-cobranza',
  templateUrl: './lista-cobranza.page.html',
  styleUrls: ['./lista-cobranza.page.scss'],
})
export class ListaCobranzaPage implements OnInit {
  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {}

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
}
