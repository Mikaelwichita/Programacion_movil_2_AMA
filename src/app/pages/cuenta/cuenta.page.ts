import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';  // Importa MenuController
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  // Importa Storage

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  nombreApellido: string = '';
  correo: string = ''; // Se puede dejar vacío, ya no es obligatorio
  telefono: string = '';
  edad: number = 18;
  carrera: string = '';
  password: string = ''; // Mantener el campo de contraseña

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storage: Storage,
    public menu: MenuController  // Inyecta el MenuController correctamente
  ) {}

  async ngOnInit() {
    // Cargar datos del usuario al iniciar la página
    await this.loadUserData();
  }

  // Método para cargar los datos del usuario actual
  async loadUserData() {
    const usuarioSesion = await this.storage.get('usuarioSesion');
    if (usuarioSesion) {
      this.nombreApellido = usuarioSesion.nombreApellido || '';
      this.correo = usuarioSesion.correo || '';
      this.telefono = usuarioSesion.telefono || '';
      this.edad = usuarioSesion.edad || 18;
      this.carrera = usuarioSesion.carrera || '';
      this.password = usuarioSesion.password || ''; // Cargar la contraseña
    }
  }

  // Método para confirmar los cambios
  async confirmarCambios() {
    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Seguro quieres hacer los cambios?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cambios cancelados');
          }
        },
        {
          text: 'Sí',
          handler: async () => {
            // Validar que todos los campos estén completos, excepto el correo
            if (
              this.nombreApellido !== '' &&
              this.telefono !== '' &&
              this.edad > 0 &&
              this.carrera !== '' &&
              this.password !== '' // Mantener la validación de la contraseña
            ) {
              // Cargar todos los usuarios
              const usuarios: any[] = await this.storage.get('usuarios') || [];

              // Buscar al usuario actual en la lista
              const usuarioIndex = usuarios.findIndex(u => u.correo === this.correo);
              if (usuarioIndex > -1) {
                // Actualizar los datos del usuario
                usuarios[usuarioIndex] = {
                  nombreApellido: this.nombreApellido,
                  correo: this.correo,
                  telefono: this.telefono,
                  edad: this.edad,
                  carrera: this.carrera,
                  password: this.password // Mantener la contraseña
                };

                // Guardar los cambios en el Storage
                await this.storage.set('usuarios', usuarios);

                // Actualizar el usuario de la sesión actual
                await this.storage.set('usuarioSesion', usuarios[usuarioIndex]);

                // Alerta de éxito
                await this.presentAlert('Cambios guardados', 'Tus datos han sido actualizados correctamente.');

                // Redirigir a la página principal o recargar datos
                this.router.navigate(['/home']);
              } else {
                await this.presentAlert('Error', 'No se encontró el usuario.');
              }
            } else {
              await this.presentAlert('Error', 'Por favor, completa todos los campos.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
