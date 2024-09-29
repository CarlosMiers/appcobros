import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  mensaje: String = '';
  idusuario: number = 0;
  comitente : string ='';
  loginacceso: string = '';
  password: string = '';
  confirmPassword: string = '';
  cedula: string = '';
  loading: boolean = false;
  signupView: boolean = false;

  cCedula:String = '';

  constructor(private _userService: UserService, private router: Router, public loadingService: LoadingService) { }

  ngOnInit() {
  }

  toggleSignUpView() {
    this.signupView = !this.signupView
  }

  Ingresar() {
    if (this.loginacceso == '' || this.password == '' || this.cedula == '') {
      this.loadingService.present({
        message: 'Ingrese los Datos de Usuario',
        duration: 1000
      });

      return;
    }

    const user: Usuario = {
      loginacceso: this.loginacceso,
      password: this.password,
      idusuario: this.idusuario,
    }

    this.loading = true;
    this._userService.login(user).subscribe({
      next: (token) => {
        //SE ALMACENA EN localStorage el token y el numero de cedula
        localStorage.setItem('token', token);
        localStorage.setItem('cedula', this.cedula);
        this.router.navigate(['/menu']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;

        this.loadingService.present({
          message: 'El Usuario ' + this.loginacceso + ' no Existe',
          duration: 800
        });
      }
    })
  }


  AgregarUsuario() {
    //validamos
    if (this.loginacceso == '' || this.password == '' || this.confirmPassword == '' ) {
      console.log('Todos los campos son obligatorios');
      this.loadingService.present({
        message: 'Todos los Campos son Obligatorios.',
        duration: 300
      });
      return;
    }

    if (this.password != this.confirmPassword) {
      this.loadingService.present({
        message: 'Los Passwords son Diferentes',
        duration: 300
      });
      return;
    }

    //creamos el objeto
    const usuario: Usuario = {
      idusuario: this.idusuario,
      loginacceso: this.loginacceso,
      password: this.password,
    }
    this.loading = true;
    this._userService.signIn(usuario).subscribe({
      next: (v) => {
        this.loading = false;
        this.loadingService.present({
          message: 'El Usuario ' + this.loginacceso + ' fue Registrado con éxito", "Usuario Registrado',
          duration: 800
        });
        this.toggleSignUpView();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.loadingService.present({
          message: 'El Usuario ' + this.loginacceso + ' ya Existe',
          duration: 800
        });
      },
      complete: () => console.info('complete')
    })
  }

}
