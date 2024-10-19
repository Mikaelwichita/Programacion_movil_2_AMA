import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage {
  constructor(public menu: MenuController) {}  // Hacer el menu público

  toggleMenu() {
    this.menu.toggle();  // Alterna la apertura/cierre del menú
  }
}
