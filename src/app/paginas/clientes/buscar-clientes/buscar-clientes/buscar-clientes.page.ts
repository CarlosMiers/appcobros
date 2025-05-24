import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-clientes.page.html',
  styleUrls: ['./buscar-clientes.page.scss'],
})
export class BuscarClientesPage {
  @Input() clientes: any[] = []; // Recibidos como input desde el modal
  clientesFiltrados: any[] = [];
  textoBuscar = '';
  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.clientesFiltrados = [...this.clientes]; // copia para filtrar sin perder datos originales
  }

  buscarCliente(event: any) {
    const query = event.target.value.toLowerCase();
    this.textoBuscar = event.detail.value;
    this.clientesFiltrados = this.clientes.filter(
      (c) =>
        c.codigo.toLowerCase().includes(query) ||
        c.nombre.toLowerCase().includes(query)
    );
  }

  seleccionarCliente(cliente: any) {
    this.modalCtrl.dismiss(cliente); // devuelve el cliente seleccionado
  }

  cancelar() {
    this.modalCtrl.dismiss(null); // o simplemente this.modalCtrl.dismiss();
  }
}
