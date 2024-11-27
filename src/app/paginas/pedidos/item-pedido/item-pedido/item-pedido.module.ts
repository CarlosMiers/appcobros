import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemPedidoPageRoutingModule } from './item-pedido-routing.module';

import { ItemPedidoPage } from './item-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemPedidoPageRoutingModule
  ],
  declarations: [ItemPedidoPage]
})
export class ItemPedidoPageModule {}
