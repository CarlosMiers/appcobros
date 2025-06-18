import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { MenuPage } from '../menu/menu.page';

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
    public modalCtrl: ModalController
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

        console.log('Token recibido:', data);

        localStorage.setItem('token', data.token); // Guarda el JWT
        localStorage.setItem('idusuario', data.userId.toString()); // Guarda el ID como string

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

}
