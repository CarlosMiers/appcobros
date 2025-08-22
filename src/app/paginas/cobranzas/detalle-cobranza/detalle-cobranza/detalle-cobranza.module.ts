import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCobranzaPageRoutingModule } from './detalle-cobranza-routing.module';

import { DetalleCobranzaPage } from './detalle-cobranza.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DetalleCobranzaPageRoutingModule
  ],
  declarations: [DetalleCobranzaPage]
})
export class DetalleCobranzaPageModule {}
