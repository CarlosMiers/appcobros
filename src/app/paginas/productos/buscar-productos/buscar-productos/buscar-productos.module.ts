import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarProductosPageRoutingModule } from './buscar-productos-routing.module';

import { BuscarProductosPage } from './buscar-productos.page';
import { PipesModule } from 'src/app/pipes/filtro/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    BuscarProductosPageRoutingModule
  ],
  declarations: [BuscarProductosPage]
})
export class BuscarProductosPageModule {}
