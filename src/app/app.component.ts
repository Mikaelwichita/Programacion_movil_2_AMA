import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';  

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  nombreUsuario: string = '';
  carreraUsuario: string = '';  
  fotoPerfil: string | null = null; 

  constructor(
    private menu: MenuController,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage  
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menu.close();
      });

    
    this.initStorage();
  }

  
  async initStorage() {
    await this.storage.create();
  }

  async ngOnInit() {
    // Cargar los datos iniciales del usuario
    await this.loadUserData();

    // Escuchar cambios en los datos del usuario
    window.addEventListener('usuarioSesionActualizada', async () => {
      await this.loadUserData();
    });
  }

  async loadUserData() {
    const usuarioSesion = await this.storage.get('usuarioSesion');  
    
    if (usuarioSesion) {
      this.nombreUsuario = usuarioSesion.nombreApellido;  
      this.carreraUsuario = usuarioSesion.carrera || 'Carrera no asignada';  
      this.fotoPerfil = usuarioSesion.fotoPerfil || null;  
    }
  }

  
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

  async logout() {
   
    await this.storage.remove('usuarioSesion');
    this.nombreUsuario = '';  
    this.carreraUsuario = '';  
    this.fotoPerfil = null; 

    this.router.navigate(['/login']);
    this.menu.close();  
  }
}
