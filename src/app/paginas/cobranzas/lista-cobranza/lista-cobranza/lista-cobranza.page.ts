import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ListaCobranza } from 'src/app/models/cobranzas/lista-cobranzas';
import { ListaCobranzasService } from 'src/app/services/cobranzas/lista-cobranzas.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-lista-cobranza',
  templateUrl: './lista-cobranza.page.html',
  styleUrls: ['./lista-cobranza.page.scss'],
})
export class ListaCobranzaPage implements OnInit {
  fechainicio: any;
  fechafinal: any;
  ListaCobranzas: any = [];
  totalcobranza: number = 0;
  nombreCliente: string = '';

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    private navCtrl: NavController,
    public loadingService: LoadingService,
    private listaCobranzasService: ListaCobranzasService
  ) {}

  ngOnInit() {
    const listaCobranza: ListaCobranza = {
      idcobro: 0,
      idpagos: '',
      numero: 0,
      sucursal: 0,
      cobrador: 0,
      fecha: new Date(),
      cliente: 0,
      moneda: 0,
      cotizacionmoneda: 0,
      codusuario: 0,
      valores: 0,
      totalpago: 0,
      observacion: '',
      asiento: 0,
      caja: 0,
    };

    this.fechainicio = new Date().toISOString().substring(0, 10);
    this.fechafinal = new Date().toISOString().substring(0, 10);
    this.Consultar();
  }

  async dismiss() {
    this.router.navigate(['/menu']);
  }

  ConsultarB() {
    if (!this.fechainicio || !this.fechafinal) return;
    this.listaCobranzasService
      .getCobranzasCabecera(
        parseInt(localStorage.getItem('idusuario') || '0', 10),
        this.fechainicio,
        this.fechafinal
      )
      .then((data) => {
        this.ListaCobranzas = data;
      });
  }

  async Consultar() {
    this.totalcobranza = 0;

    // Mostrar mensaje de carga
    this.loadingService.present({
      message: 'Aguarde un Momento.',
      duration: 300,
    });

    try {
      // Llamada al servicio con el token y parámetros necesarios
       const data = await this.listaCobranzasService.getCobranzasCabecera(
        parseInt(localStorage.getItem('idusuario') || '0', 10),
        this.fechainicio,
        this.fechafinal
      );
      // Cargar los datos en el array
      this.ListaCobranzas    = data;
      // Calcular el total
      let totalRow = this.ListaCobranzas.length;
      totalRow -= 1;
      for (let i = 0; i <= totalRow; i++) {
        this.totalcobranza += parseFloat(this.ListaCobranzas[i].totalpago);
      }
    } catch (err) {
      // Manejo de errores
      console.error('Error al cargar la lista de ventas:', err);
      // Aquí puedes mostrar un mensaje al usuario o hacer algo más
    } finally {
      // Finalización de la carga
      this.loadingService.dismiss();
    }
  }

  async OpenEditCobranza(idCobro: number) {
          await this.navCtrl.navigateForward(`/detalle-cobranza/${idCobro}`);
  }



  
}
