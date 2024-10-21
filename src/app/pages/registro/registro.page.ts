import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  // Asegúrate de importar Storage

// Define la interfaz para el usuario
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
    private storage: Storage  // Inyecta Storage
  ) {}

  // Método para registrar el usuario
  async registrarse() {
    // Validación de los campos
    if (
      this.nombreApellido !== '' &&
      this.correo !== '' &&
      this.telefono !== '' &&
      this.edad > 0 &&
      this.carrera !== '' &&
      this.password !== ''
    ) {
      // Verifica si ya existe un usuario con el mismo correo
      const usuarios: Usuario[] = await this.storage.get('usuarios') || [];
      const usuarioExistente = usuarios.find(u => u.correo === this.correo);

      if (usuarioExistente) {
        // Si el correo ya está registrado, mostramos un mensaje
        await this.presentAlert('Usuario ya registrado', 'Este correo ya está registrado.');
        return;
      }

      // Si no existe, guarda el nuevo usuario
      await this.guardarDatos(usuarios);
      
      // Alerta de éxito
      await this.presentAlert('Registro Exitoso', 'Tus datos han sido registrados correctamente.');
      
      // Redirige al usuario a la página de login
      this.router.navigate(['/login']);
    } else {
      // Si falta algún campo, muestra un mensaje de error
      await this.presentAlert('Error', 'Por favor, completa todos los campos.');
    }
  }

  // Método para guardar los datos en Storage
  async guardarDatos(usuarios: Usuario[]) {
    const usuario: Usuario = {
      nombreApellido: this.nombreApellido,
      correo: this.correo,
      telefono: this.telefono,
      edad: this.edad,
      carrera: this.carrera,
      password: this.password,
    };

    // Guarda el nuevo usuario en el array y almacénalo en Storage
    usuarios.push(usuario);
    await this.storage.set('usuarios', usuarios);

    // También almacenamos el usuario actual en 'usuarioSesion'
    await this.storage.set('usuarioSesion', usuario);  // Guarda el usuario que acaba de registrarse
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
