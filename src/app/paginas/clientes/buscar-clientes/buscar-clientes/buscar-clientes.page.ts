import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SharedClienteService } from 'src/app/services/clientes/shared-cliente.service';

@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-clientes.page.html',
  styleUrls: ['./buscar-clientes.page.scss'],
})
export class BuscarClientesPage {
  clientes: any[] = []; // Array de clientes que recibimos desde la página anterior
  clienteSeleccionado: any = null;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    private sharedClienteService: SharedClienteService
  ) {
    // Recibir los clientes enviados desde la página anterior
    //  const navigation = this.router.getCurrentNavigation();
    //    this.clientes = navigation?.extras.state?.['clientes'] || [];
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.clientes = navigation.extras.state['clientes'];
    }
  }

  //onClientSelected(client: any) { this.sharedClienteService.setSelectedClient(client); this.router.navigate(['/componente-inicial']); }

  // Función para buscar un cliente por código o nombre
  buscarCliente(event: any) {
    const query = event.target.value.toLowerCase();
    this.clientes = this.clientes.filter(
      (c) =>
        c.codigo.toLowerCase().includes(query) ||
        c.nombre.toLowerCase().includes(query)
    );
  }

  // Seleccionar un cliente y enviarlo de vuelta a la página anterior
  seleccionarCliente(cliente: any) {
    //    this.navCtrl.back();
    {
      this.sharedClienteService.setSelectedClient(cliente);
      this.router.navigate(['/detalle-pedido']);
    }
  }
}
