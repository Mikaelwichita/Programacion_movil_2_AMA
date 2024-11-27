import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';  
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Location } from '@angular/common';  

interface Usuario {
  nombreApellido: string;
  correo: string;
  telefono: string;
  edad: number;
  carrera: string;
  password: string;
}

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
    private storage: Storage,
    private loadingController: LoadingController,
    private location: Location 
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
      const loading = await this.loadingController.create({
        message: 'Registrando usuario...',
        spinner: 'crescent',
      });
      await loading.present();

      const usuarios: Usuario[] = (await this.storage.get('usuarios')) || [];
      const usuarioExistente = usuarios.find(u => u.correo === this.correo);

      if (usuarioExistente) {
        await loading.dismiss();
        await this.presentAlert('Usuario ya registrado', 'Este correo ya está registrado.');
        return;
      }

      await this.guardarDatos(usuarios);
      await loading.dismiss();

      await this.presentAlert(
        '¡Bienvenido!',
        `Hola, ${this.nombreApellido}. Te has registrado exitosamente en nuestra app. ¡Esperamos que disfrutes la experiencia!`
      );

      this.router.navigate(['/login']);
    } else {
      await this.presentAlert('Error', 'Por favor, completa todos los campos.');
    }
  }

  async guardarDatos(usuarios: Usuario[]) {
    const usuario: Usuario = {
      nombreApellido: this.nombreApellido,
      correo: this.correo,
      telefono: this.telefono,
      edad: this.edad,
      carrera: this.carrera,
      password: this.password,
    };

    usuarios.push(usuario);
    await this.storage.set('usuarios', usuarios);
    await this.storage.set('usuarioSesion', usuario);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  volverAtras() {
    this.location.back(); 
  }
}
