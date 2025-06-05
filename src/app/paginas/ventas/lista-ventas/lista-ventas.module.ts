import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaVentasPageRoutingModule } from './lista-ventas-routing.module';

import { ListaVentasPage } from './lista-ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaVentasPageRoutingModule
  ],
  declarations: [ListaVentasPage]
})
export class ListaVentasPageModule {}
