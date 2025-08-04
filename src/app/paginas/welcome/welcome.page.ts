import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuariosPage } from '../usuarios/usuarios.page';
import { RegisterPage } from '../register/register.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  constructor(public modalCtrl: ModalController, private router: Router) {}

  ngOnInit() {}

  login() {
    this.router.navigate(['/usuarios']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  /*  async login() {
    const modal = await this.modalCtrl.create({
      component: UsuariosPage,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'login-modal',
    })

    return await modal.present();
  }

  async register() {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'register-modal',
    })

    return await modal.present();
  }*/
}
