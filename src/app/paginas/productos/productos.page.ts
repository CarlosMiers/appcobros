import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  textoBuscar='';
  constructor() { }

  ngOnInit() {
  }

  buscar(event :any) {
    this.textoBuscar = event.detail.value;
  }

}
