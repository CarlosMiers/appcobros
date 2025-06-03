import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCajasPageRoutingModule } from './edit-cajas-routing.module';

import { EditCajasPage } from './edit-cajas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCajasPageRoutingModule
  ],
  declarations: [EditCajasPage]
})
export class EditCajasPageModule {}
