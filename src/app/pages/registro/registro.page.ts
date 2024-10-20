import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importamos Router

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

  constructor(private alertController: AlertController, private router: Router) {} // Inyectamos el Router

  async registrarse() {
    if (
      this.nombreApellido !== '' &&
      this.correo !== '' &&
      this.telefono !== '' &&
      this.edad > 0 &&
      this.carrera !== '' &&
      this.password !== ''
    ) {
      await this.presentAlert('Registro Exitoso', 'Tus datos han sido registrados correctamente.');
      
      // Redirigimos al usuario a la página de login
      this.router.navigate(['/login']);
    } else {
      await this.presentAlert('Error', 'Por favor, completa todos los campos.');
    }
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
