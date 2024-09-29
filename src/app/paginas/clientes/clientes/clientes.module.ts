import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';
import { PipesModule } from "../../../pipes/filtro/pipes.module";
import { ClientesPage } from './clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ClientesPageRoutingModule
  ],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
