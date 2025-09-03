import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListaPedido } from 'src/app/models/pedidos/lista-pedidos';
import { ListaPedidosService } from 'src/app/services/pedidos/lista-pedidos.service';

@Component({
  selector: 'app-buscarpreventa',
  templateUrl: './buscarpreventa.page.html',
  styleUrls: ['./buscarpreventa.page.scss'],
})
export class BuscarpreventaPage implements OnInit {


  listaPedido: ListaPedido[] = [];
  preventasFiltradas: any[] = [];
  textoBuscar = '';

  constructor(
    private modalCtrl: ModalController,
    private listaPedidosService: ListaPedidosService // Inyecta el servicio de preventas
  ) {}

  ngOnInit(): void {
    this.cargarPreventas();
  }

  async cargarPreventas() {
    try {
      // Llama al servicio para obtener todas las preventas
      const data = await this.listaPedidosService.getListaPedidosActivos();
      this.listaPedido = Array.isArray(data) ? data : [data];
      this.preventasFiltradas = [...this.listaPedido]; // Inicializa la lista filtrada
      console.log('Preventas cargadas:', this.listaPedido);
    } catch (error) {
      console.error('Error al cargar las preventas:', error);
      // Aquí puedes mostrar un toast o una alerta al usuario
    }
  }

  buscarPreventa(event: any) {
    const query = event.target.value.toLowerCase();
    this.textoBuscar = query;
    if (query.length > 0) {
      this.preventasFiltradas = this.listaPedido.filter(
        (p) =>
          String(p.numero).includes(query) || // Busca por número
          (p.nombrecliente && p.nombrecliente.toLowerCase().includes(query)) // Busca por nombre del cliente si existe
      );
    } else {
      this.preventasFiltradas = [...this.listaPedido]; // Restablece la lista si la búsqueda está vacía
    }
  }

  seleccionarPreventa(preventa: any) {
    this.modalCtrl.dismiss(preventa); // Devuelve la preventa seleccionada
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }

}
