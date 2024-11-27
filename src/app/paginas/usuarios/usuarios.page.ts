import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  loading: boolean = false;
  mensaje: String = '';
  idusuario: number = 0;
  descripcion:string='';
  loginacceso: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private _userService: UserService, private router: Router, public loadingService: LoadingService,
    private navCtrl: NavController, public modalCtrl: ModalController,) { }
  ngOnInit() {

  }

  Ingresar() {
    if (this.loginacceso == '' || this.password == '' ) {
      this.loadingService.present({
        message: 'Ingrese los Datos de Usuario',
        duration: 1000
      });

      return;
    }

    const user: Usuario = {
      loginacceso: this.loginacceso,
      descripcion:this.descripcion,
      password: this.password,
      idusuario: this.idusuario,
    }

    this.loading = true;
    this._userService.login(user).subscribe({
      next: (token) => {
        //SE ALMACENA EN localStorage el token y el numero de cedula
        localStorage.setItem('token', token);
        localStorage.setItem('loginacceso', this.loginacceso);
        localStorage.setItem('idusuario', this.idusuario.toString());
        console.log("CODIGO USUARIO "+this.idusuario.toString())
                
        this.router.navigate(['/menu']);
        this.loginacceso = '';
        this.password = '';
        this.dismiss();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        console.log("Error de Conexión");  
        this.loadingService.present({
          message: 'El Usuario ' + this.loginacceso + ' no Existe '+e,
          duration: 800
        });
      }
    })
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
}
