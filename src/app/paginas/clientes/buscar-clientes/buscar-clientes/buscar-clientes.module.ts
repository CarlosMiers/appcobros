import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarClientesPageRoutingModule } from './buscar-clientes-routing.module';

import { BuscarClientesPage } from './buscar-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarClientesPageRoutingModule
  ],
  declarations: [BuscarClientesPage]
})
export class BuscarClientesPageModule {}
