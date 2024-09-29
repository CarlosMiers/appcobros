import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes,CanActivate } from '@angular/router';
import { AuthGuard } from './utils/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./paginas/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  
  {
    path: 'menu',
    loadChildren: () => import('./paginas/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./paginas/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./paginas/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./paginas/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./paginas/productos/productos.module').then( m => m.ProductosPageModule) , canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    loadChildren: () => import('./paginas/clientes/clientes/clientes.module').then( m => m.ClientesPageModule) , canActivate: [AuthGuard]
  },
  {
    path: 'edit-clientes/:codigo',
    loadChildren: () => import('./paginas/clientes/edit-clientes/edit-clientes.module').then( m => m.EditClientesPageModule) , canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
