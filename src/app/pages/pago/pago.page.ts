import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage {
  constructor(public menu: MenuController) {}  // Hacer el menu público

  toggleMenu() {
    this.menu.toggle();  // Alterna la apertura/cierre del menú
  }
}
