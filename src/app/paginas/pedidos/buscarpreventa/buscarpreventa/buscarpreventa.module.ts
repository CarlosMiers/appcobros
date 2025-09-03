import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarpreventaPageRoutingModule } from './buscarpreventa-routing.module';

import { BuscarpreventaPage } from './buscarpreventa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarpreventaPageRoutingModule
  ],
  declarations: [BuscarpreventaPage]
})
export class BuscarpreventaPageModule {}
