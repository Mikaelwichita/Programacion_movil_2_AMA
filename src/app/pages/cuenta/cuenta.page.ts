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

  // Variables para almacenar datos originales
  originalData: any = {};

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storage: Storage,
    public menu: MenuController  
  ) {}

  async ngOnInit() {
    await this.loadUserData();
  }

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

      // Guardamos los datos originales para detectar cambios
      this.originalData = { ...usuarioSesion };
    }
  }

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
    const changedFields: string[] = this.detectChanges();

    if (changedFields.length > 0) {
      const alertMessage = `Has hecho cambios en los siguientes campos: ${changedFields.join(', ')}`;

      const alert = await this.alertController.create({
        header: 'Confirmación de Cambios',
        message: alertMessage,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cambios cancelados');
            }
          },
          {
            text: 'Guardar',
            handler: async () => {
              const usuarios: any[] = await this.storage.get('usuarios') || [];
              const usuarioIndex = usuarios.findIndex(u => u.correo === this.correo);
              if (usuarioIndex > -1) {
                if (this.nombreApellido) usuarios[usuarioIndex].nombreApellido = this.nombreApellido;
                if (this.telefono) usuarios[usuarioIndex].telefono = this.telefono;
                if (this.edad) usuarios[usuarioIndex].edad = this.edad;
                if (this.carrera) usuarios[usuarioIndex].carrera = this.carrera;
                if (this.password) usuarios[usuarioIndex].password = this.password;
                if (this.fotoPerfil) usuarios[usuarioIndex].fotoPerfil = this.fotoPerfil;

                await this.storage.set('usuarios', usuarios);
                await this.storage.set('usuarioSesion', usuarios[usuarioIndex]);

                // Emitir el evento para notificar los cambios
                window.dispatchEvent(new CustomEvent('usuarioSesionActualizada'));

                await this.presentAlert('Cambios guardados', 'Tus datos han sido actualizados correctamente.');
                this.router.navigate(['/home']);
              } else {
                await this.presentAlert('Error', 'No se encontró el usuario.');
              }
            }
          }
        ]
      });

      await alert.present();
    } else {
      await this.presentAlert('Sin Cambios', 'No has realizado ningún cambio.');
    }
  }

  detectChanges(): string[] {
    const changedFields: string[] = [];

    if (this.nombreApellido !== this.originalData.nombreApellido) changedFields.push('Nombre y Apellido');
    if (this.telefono !== this.originalData.telefono) changedFields.push('Teléfono');
    if (this.edad !== this.originalData.edad) changedFields.push('Edad');
    if (this.carrera !== this.originalData.carrera) changedFields.push('Carrera');
    if (this.password !== this.originalData.password) changedFields.push('Contraseña');
    if (this.fotoPerfil !== this.originalData.fotoPerfil) changedFields.push('Foto de Perfil');

    return changedFields;
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
