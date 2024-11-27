import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditClientesPageRoutingModule } from './edit-clientes-routing.module';
import { EditClientesPage } from './edit-clientes.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditClientesPageRoutingModule, 
    CommonModule,
    IonicModule,
  ],
  declarations: [EditClientesPage]  
})
export class EditClientesPageModule {}
