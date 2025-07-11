import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaCobranzaPage } from './lista-cobranza.page';

const routes: Routes = [
  {
    path: '',
    component: ListaCobranzaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaCobranzaPageRoutingModule {}
