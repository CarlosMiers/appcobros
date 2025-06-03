import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './utils/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
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
    path: 'clientes',
    loadChildren: () => import('./paginas/clientes/clientes/clientes.module').then( m => m.ClientesPageModule) , canActivate: [AuthGuard]
  },
  {
    path: 'edit-clientes/:codigo',
    loadChildren: () => import('./paginas/clientes/edit-clientes/edit-clientes.module').then( m => m.EditClientesPageModule) , canActivate: [AuthGuard]
  },
  {
    path: 'productos',
    loadChildren: () => import('./paginas/productos/lista-productos/productos/productos.module').then( m => m.ProductosPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'edit-productos',
    loadChildren: () => import('./paginas/productos/edit-productos/edit-productos/edit-productos.module').then( m => m.EditProductosPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'lista-pedidos',
    loadChildren: () => import('./paginas/pedidos/lista-pedidos/lista-pedidos/lista-pedidos.module').then( m => m.ListaPedidosPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'detalle-pedido',
    loadChildren: () => import('./paginas/pedidos/detalle-pedido/detalle-pedido/detalle-pedido.module').then( m => m.DetallePedidoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'item-pedido',
    loadChildren: () => import('./paginas/pedidos/item-pedido/item-pedido/item-pedido.module').then( m => m.ItemPedidoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'buscar-clientes',
    loadChildren: () => import('./paginas/clientes/buscar-clientes/buscar-clientes/buscar-clientes.module').then( m => m.BuscarClientesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'buscar-productos',
    loadChildren: () => import('./paginas/productos/buscar-productos/buscar-productos/buscar-productos.module').then( m => m.BuscarProductosPageModule)
  },
  {
    path: 'cajas',
    loadChildren: () => import('./paginas/cajas/cajas/cajas.module').then( m => m.CajasPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'edit-cajas',
    loadChildren: () => import('./paginas/cajas/edit-cajas/edit-cajas.module').then( m => m.EditCajasPageModule), canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
