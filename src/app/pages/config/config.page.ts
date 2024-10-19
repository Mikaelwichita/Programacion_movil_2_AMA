import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage {
  constructor(public menu: MenuController) {}  // Hacer el menu público

  toggleMenu() {
    this.menu.toggle();  // Alterna la apertura/cierre del menú
  }
}
