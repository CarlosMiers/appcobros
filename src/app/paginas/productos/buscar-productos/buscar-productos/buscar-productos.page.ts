import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-productos',
  templateUrl: './buscar-productos.page.html',
  styleUrls: ['./buscar-productos.page.scss'],
})
export class BuscarProductosPage {
  @Input() productos: any[] = [];
  productosFiltrados: any[] = [];
  textoBuscar = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.productosFiltrados = [...this.productos];
  }

  buscarProducto(event: any) {
    const query = event.target.value.toLowerCase();
    this.textoBuscar = event.detail.value;
    this.productosFiltrados = this.productos.filter(
      (p) =>
        p.codprod.toLowerCase().includes(query) ||
        p.descripcion.toLowerCase().includes(query)
    );
  }

  seleccionarProducto(producto: any) {
    this.modalCtrl.dismiss(producto);
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }
}
