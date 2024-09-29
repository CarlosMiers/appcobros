import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})

  export class MenuPage implements OnInit {
      
      componentes: Array<{icon:string,name:string,redirectTo:string}> = [
        {
        icon: 'people',
        name: 'productos',
        redirectTo: "/productos",
        },
        {
          icon: 'people',
          name: 'clientes',
          redirectTo: "/clientes",
          }
  
        // Añade aquí otras rutas según sea necesario
      ];

    
    constructor(
    ) { }
  
    ngOnInit() {
    }
   
  }
  
  
  