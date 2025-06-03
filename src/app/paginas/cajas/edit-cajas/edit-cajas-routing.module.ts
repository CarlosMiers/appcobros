import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCajasPage } from './edit-cajas.page';

const routes: Routes = [
  {
    path: '',
    component: EditCajasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCajasPageRoutingModule {}
