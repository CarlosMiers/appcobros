import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditClientesPage } from './edit-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: EditClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditClientesPageRoutingModule {}
