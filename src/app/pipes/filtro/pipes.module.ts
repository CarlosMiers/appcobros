import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [FiltroPipe],  // Declara el pipe
  exports: [FiltroPipe],  // Exporta el pipe para que pueda ser utilizado fuera del módulo
  imports: [CommonModule]  // Asegúrate de importar CommonModule si usas directivas de Angular
})
export class PipesModule {}