import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  loading: boolean = false;
  mensaje: String = '';
  idusuario: number = 0;
  descripcion: string = '';
  loginacceso: string = '';
  password: string = '';
  confirmPassword: string = '';
  cedula: string = '';

  showPassword: boolean = false;

  // Función para alternar la visibilidad de la contraseña

  constructor(
    public modalCtrl: ModalController,
    private _userService: UserService,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async AgregarUsuario() {
    // Validación de campos
    if (
      this.loginacceso == '' ||
      this.password == '' ||
      this.confirmPassword == ''
    ) {
      console.log('Todos los campos son obligatorios');
      this.loadingService.present({
        message: 'Todos los Campos son Obligatorios.',
        duration: 300,
      });
      return;
    }

    if (this.password != this.confirmPassword) {
      this.loadingService.present({
        message: 'Los Passwords son Diferentes',
        duration: 300,
      });
      return;
    }

    // Creamos el objeto usuario
    const usuario: Usuario = {
      idusuario: this.idusuario,
      descripcion: this.descripcion,
      loginacceso: this.loginacceso,
      password: this.password,
    };

    this.loading = true;

    try {
      // Llamamos al servicio signIn usando el método nativo Http
      const response = await this._userService.signIn(usuario);

      this.loading = false;
      this.loadingService.present({
        message: 'El Usuario ' + this.loginacceso + ' fue Registrado con éxito',
        duration: 800,
      });

      this.dismiss();
      // this.router.navigate(['/usuarios']); // Si necesitas redirigir después del registro
    } catch (error) {
      this.loading = false;
      console.error('Error al registrar el usuario:', error);
      this.loadingService.present({
        message:
          'El Usuario ' + this.loginacceso + ' no existe o no es un Cliente',
        duration: 800,
      });
    }
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
}
