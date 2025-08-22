import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleCobranzaPage } from './detalle-cobranza.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCobranzaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCobranzaPageRoutingModule {}
