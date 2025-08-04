import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-cobranza',
  templateUrl: './lista-cobranza.page.html',
  styleUrls: ['./lista-cobranza.page.scss'],
})
export class ListaCobranzaPage implements OnInit {
  constructor(public modalCtrl: ModalController,public router: Router) {}

  ngOnInit() {}

    async dismiss() {
     this.router.navigate(['/menu']);
  }

}
