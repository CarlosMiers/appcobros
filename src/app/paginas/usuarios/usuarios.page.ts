import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { MenuPage } from '../menu/menu.page';
import { ConfigEmpresaService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  loading: boolean = false;
  mensaje: String = '';
  idusuario: number = 0;
  descripcion: string = '';
  loginacceso: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;



  constructor(
    private _userService: UserService,
    private router: Router,
    public loadingService: LoadingService,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    configserviceEmpresa: ConfigEmpresaService
  ) {}
  ngOnInit() {}

  Ingresar() {
    if (this.loginacceso == '' || this.password == '') {
      this.loadingService.present({
        message: 'Ingrese los Datos de Usuario',
        duration: 1000,
      });

      return;
    }

    const user: Usuario = {
      loginacceso: this.loginacceso,
      descripcion: this.descripcion,
      password: this.password,
      idusuario: this.idusuario,
    };

    this.loading = true;
    this._userService.login(user).subscribe({
      next: (token) => {
        // Si el token viene como string JSON, lo parseamos
        //        const data = typeof token === 'string' ? JSON.parse(token) : token;
        const data = typeof token === 'string' ? JSON.parse(token) : token;

        localStorage.setItem('token', data.token); // Guarda el JWT
        localStorage.setItem('idusuario', data.userId.toString()); // Guarda el ID como string
        this.configuracion(new ConfigEmpresaService());

        this.Menu(); // Redirección a menú
        this.loginacceso = '';
        this.password = '';
        this.dismiss(); // Cierra el modal o diálogo de login
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        console.log('Error de Conexión');
        this.loadingService.present({
          message: 'El Usuario ' + this.loginacceso + ' no Existe ' + e,
          duration: 5000,
        });
      },
    });
  }

  async Menu() {
    const modal = await this.modalCtrl.create({
      component: MenuPage,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'menu-modal',
    });

    return await modal.present();
  }

  Registrar() {
    this.router.navigate(['register']);
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  submitForm() {
    //this.router.navigate(['/home']);
    this.router.navigate(['/menu']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async configuracion(
    configserviceEmpresa: ConfigEmpresaService
  ): Promise<void> {
    try {
      const configArray = await configserviceEmpresa.getConfig();
      console.log('Configuración obtenida:', configArray);

      if (Array.isArray(configArray) && configArray.length > 0) {
        const config = configArray[0]; // 👈 Acceder al primer elemento del array
        localStorage.setItem('empresa', JSON.stringify(config.empresa));
        localStorage.setItem('ruc', JSON.stringify(config.ruc));
        localStorage.setItem('direccion',JSON.stringify(config.direccion || ''));
        localStorage.setItem('telefono', JSON.stringify(config.telefono || ''));
        localStorage.setItem('fax', JSON.stringify(config.fax || ''));
        localStorage.setItem('mail', JSON.stringify(config.mail || ''));
        localStorage.setItem('web', JSON.stringify(config.web || ''));
        localStorage.setItem('ramo', JSON.stringify(config.ramo || ''));
        localStorage.setItem('responsable', JSON.stringify(config.responsable || ''));
      } else {
        console.warn('⚠️ No se recibió ninguna configuración en el array.');
      }
    } catch (error) {
      console.error('Error obteniendo configuración:', error);
    }
  }
}
