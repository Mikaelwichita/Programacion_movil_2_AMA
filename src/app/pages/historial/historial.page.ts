import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage {
  constructor(public menu: MenuController) {}  // Hacer el menu público

  toggleMenu() {
    this.menu.toggle();  // Alterna la apertura/cierre del menú
  }
}
