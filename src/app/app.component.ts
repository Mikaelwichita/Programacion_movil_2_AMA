import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';  // Importamos Storage

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  nombreUsuario: string = '';
  carreraUsuario: string = '';  // Cambiamos de rolUsuario a carreraUsuario

  constructor(
    private menu: MenuController,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage  // Inyectamos Storage
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

  async ngOnInit() {
    await this.loadUserData();  // Cargar los datos del usuario al iniciar la app
  }

  async loadUserData() {
    const usuarioSesion = await this.storage.get('usuarioSesion');  // Recupera el usuario actual desde Storage
    
    if (usuarioSesion) {
      this.nombreUsuario = usuarioSesion.nombreApellido;  // Asigna el nombre
      this.carreraUsuario = usuarioSesion.carrera || 'Carrera no asignada';  // Asigna la carrera del usuario
    }
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
  async logout() {
    // Eliminar los datos del usuario de la sesión
    await this.storage.remove('usuarioSesion');
    this.nombreUsuario = '';  // Borra el nombre del usuario
    this.carreraUsuario = '';  // Borra la carrera del usuario

    // Redirige al login
    this.router.navigate(['/login']);
    this.menu.close();  // Cierra el menú si está abierto
  }
}
