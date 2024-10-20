import { Component } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';  // Importamos Storage

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private menu: MenuController,
    private router: Router,
    private alertController: AlertController,  // Importamos AlertController
    private storage: Storage                   // Inyectamos Storage
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menu.close();
      });

    // Inicializamos el Storage
    this.initStorage();
  }

  // Método para inicializar el Storage
  async initStorage() {
    await this.storage.create();
  }

  // Método para mostrar la alerta de confirmación de cierre de sesión
  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('El usuario canceló el cierre de sesión.');
          }
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para cerrar sesión y redirigir a la página de login
  logout() {
    // Aquí puedes limpiar cualquier dato de sesión o storage si es necesario
    this.router.navigate(['/login']);  // Redirige al login
    this.menu.close();  // Cierra el menú si está abierto
  }
}
