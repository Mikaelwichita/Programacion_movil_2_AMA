import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';  
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  nombreApellido: string = '';
  correo: string = ''; 
  telefono: string = '';
  edad: number = 18;
  carrera: string = '';
  password: string = ''; 
  fotoPerfil: string | null = null; 

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storage: Storage,
    public menu: MenuController  
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
      this.password = usuarioSesion.password || ''; 
      this.fotoPerfil = usuarioSesion.fotoPerfil || null; 
    }
  }

  // Metodo para manejar la selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfil = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async confirmarCambios() {
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
            // Obtener los usuarios guardados
            const usuarios: any[] = await this.storage.get('usuarios') || [];
  
            // Buscar al usuario actual en la lista
            const usuarioIndex = usuarios.findIndex(u => u.correo === this.correo);
            if (usuarioIndex > -1) {
              // Actualizar solo los campos que tienen valor
              if (this.nombreApellido) {
                usuarios[usuarioIndex].nombreApellido = this.nombreApellido;
              }
              if (this.telefono) {
                usuarios[usuarioIndex].telefono = this.telefono;
              }
              if (this.edad) {
                usuarios[usuarioIndex].edad = this.edad;
              }
              if (this.carrera) {
                usuarios[usuarioIndex].carrera = this.carrera;
              }
              if (this.password) {
                usuarios[usuarioIndex].password = this.password;
              }
              // Actualizar foto de perfil
              if (this.fotoPerfil) {
                usuarios[usuarioIndex].fotoPerfil = this.fotoPerfil;
              }
  
              // Guardar los cambios en el Storage
              await this.storage.set('usuarios', usuarios);
  
              // Actualizar el usuario de la sesion actual
              await this.storage.set('usuarioSesion', usuarios[usuarioIndex]);
  
              // Alerta de exito
              await this.presentAlert('Cambios guardados', 'Tus datos han sido actualizados correctamente.');
  
              // Redirigir a la página principal o recargar datos
              this.router.navigate(['/home']);
            } else {
              await this.presentAlert('Error', 'No se encontró el usuario.');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
