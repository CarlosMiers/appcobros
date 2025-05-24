import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarProductosPage } from './buscar-productos.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarProductosPageRoutingModule {}
