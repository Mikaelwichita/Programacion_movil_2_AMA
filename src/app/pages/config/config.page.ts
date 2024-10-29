import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage {
  darkMode = false;
  daltonicMode = false;
  notificationsEnabled = false;
  fontSize = 1;

  constructor(public menu: MenuController) {}

  toggleMenu() {
    this.menu.toggle();
  }

  // Cambiar al Modo Oscuro
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  // Cambiar al Modo de Colores para Daltonismo
  toggleDaltonicMode() {
    document.body.classList.toggle('daltonic-mode', this.daltonicMode);
  }

  // Cambiar Tamaño de Fuente
  changeFontSize() {
    document.documentElement.style.setProperty('--font-size', `${this.fontSize}em`);
  }

  // Activar/Desactivar Notificaciones
  toggleNotifications() {
    if (this.notificationsEnabled) {
      console.log('Notificaciones activadas');
      // Lógica adicional para activar notificaciones
    } else {
      console.log('Notificaciones desactivadas');
      // Lógica adicional para desactivar notificaciones
    }
  }
}
