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

        this.router.navigate(['/menu']);
        this.password = '';
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

  
    openWebsite() {
      window.open('https://www.synsa.com.py', '_blank');
    }
  

  Registrar() {
    this.router.navigate(['/register']);
  }

  dismiss() {
    this.router.navigate(['/welcome']);

    //   return await this.modalCtrl.dismiss();
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
      const configArr = await configserviceEmpresa.getConfig(); // recibe el objeto directamente
      const data =
        typeof configArr === 'string' ? JSON.parse(configArr) : configArr;
      localStorage.setItem('empresa', data.empresa || '');
      localStorage.setItem('ruc', data.ruc || '');
      localStorage.setItem('direccion', data.direccion || '');
      localStorage.setItem('telefono', data.telefono || '');
      localStorage.setItem('fax', data.fax || '');
      localStorage.setItem('mail', data.mail || '');
      localStorage.setItem('web', data.web || '');
      localStorage.setItem('ramo', data.ramo || '');
      localStorage.setItem('responsable', data.responsable || '');
    } catch (error) {
      console.error('❌ Error obteniendo configuración:', error);
    }
  }
}
