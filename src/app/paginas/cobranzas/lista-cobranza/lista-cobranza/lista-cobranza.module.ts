import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaCobranzaPageRoutingModule } from './lista-cobranza-routing.module';

import { ListaCobranzaPage } from './lista-cobranza.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaCobranzaPageRoutingModule
  ],
  declarations: [ListaCobranzaPage]
})
export class ListaCobranzaPageModule {}
