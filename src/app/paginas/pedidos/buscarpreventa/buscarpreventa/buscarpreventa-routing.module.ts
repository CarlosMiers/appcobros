import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarpreventaPage } from './buscarpreventa.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarpreventaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarpreventaPageRoutingModule {}
