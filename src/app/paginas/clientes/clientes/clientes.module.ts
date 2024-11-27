import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesPageRoutingModule } from './clientes-routing.module';
import { PipesModule } from "../../../pipes/filtro/pipes.module";
import { ClientesPage } from './clientes.page';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipesModule,
    ClientesPageRoutingModule
  ],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
