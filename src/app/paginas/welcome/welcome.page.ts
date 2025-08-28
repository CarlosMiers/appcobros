import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss']
})
export class WelcomePage implements OnInit {

  constructor(
    public modalCtrl: ModalController, 
    private router: Router
  ) {}

  ngOnInit() {
    // Opcional: Agregar lógica de inicialización
    this.preloadImages();
  }

  login() {
    this.router.navigate(['/usuarios']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  openWebsite() {
    window.open('https://www.synsa.com.py', '_blank');
  }

  private preloadImages() {
    // Precargar el logo para evitar flickering
    const img = new Image();
    img.src = '../../../assets/img/logo.jpg';
  }
}