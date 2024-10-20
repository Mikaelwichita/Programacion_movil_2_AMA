import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  // Asegúrate de importar Storage

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombreApellido: string = '';
  correo: string = '';
  telefono: string = '';
  edad: number = 18;
  carrera: string = '';
  password: string = '';

  constructor(
    private alertController: AlertController, 
    private router: Router,
    private storage: Storage  // Inyecta Storage
  ) {}

  async registrarse() {
    if (
      this.nombreApellido !== '' &&
      this.correo !== '' &&
      this.telefono !== '' &&
      this.edad > 0 &&
      this.carrera !== '' &&
      this.password !== ''
    ) {
      const correoGuardado = await this.storage.get('correo');
      
      if (correoGuardado === this.correo) {
        // Si el correo ya está registrado, mostramos un mensaje y no continuamos con el registro
        await this.presentAlert('Usuario ya registrado', 'Este usuario ya está registrado con este correo.');
        return;
      }
      
      // Llamamos al método guardarDatos para guardar los datos
      await this.guardarDatos();

      await this.presentAlert('Registro Exitoso', 'Tus datos han sido registrados correctamente.');
      
      // Redirigimos al usuario a la página de login
      this.router.navigate(['/login']);
    } else {
      await this.presentAlert('Error', 'Por favor, completa todos los campos.');
    }
  }

  // Método para guardar los datos en Storage
  async guardarDatos() {
    await this.storage.set('nombreApellido', this.nombreApellido);
    await this.storage.set('correo', this.correo);
    await this.storage.set('telefono', this.telefono);
    await this.storage.set('edad', this.edad);
    await this.storage.set('carrera', this.carrera);
    await this.storage.set('password', this.password);
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
