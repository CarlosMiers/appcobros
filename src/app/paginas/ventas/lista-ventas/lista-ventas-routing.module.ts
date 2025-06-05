import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaVentasPage } from './lista-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: ListaVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaVentasPageRoutingModule {}
