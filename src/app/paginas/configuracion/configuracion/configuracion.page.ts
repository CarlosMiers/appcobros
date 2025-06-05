import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/configuracion/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  config = {
    vendedor: null,
    caja: null,
    chofer: null,
    moneda: null,
    sucursal: null
  };

  constructor(
    private configService: ConfigService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const savedConfig = await this.configService.getConfig();
    if (savedConfig) {
      this.config = savedConfig;
    }
  }

  async guardar() {
    if (
      this.config.vendedor == null ||
      this.config.caja == null ||
      this.config.chofer == null ||
      this.config.moneda == null ||
      this.config.sucursal == null
    ) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    await this.configService.saveConfig(this.config);
    alert('Configuración guardada correctamente.');
    this.navCtrl.back();
  }
}

