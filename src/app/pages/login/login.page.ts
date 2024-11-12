import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  // Importa Storage
import { LoadingController, ToastController } from '@ionic/angular';  // Importa ToastController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,  // Inyecta LoadingController
    private toastController: ToastController       // Inyecta ToastController
  ) {}

  ngOnInit() {
    setTimeout(() => {
      const logo = document.querySelector('.logo') as HTMLElement;
      if (logo) {
        logo.style.opacity = '1'; 
      }

      setTimeout(() => {
        const loginSection = document.querySelector('.login-section');
        if (loginSection) {
          loginSection.classList.add('show'); 
        }
      }, 1000);
    }, 2000);
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
      duration: 3000  
    });
    await loading.present();

    const usuarios: any[] = await this.storage.get('usuarios') || [];
    const usuarioEncontrado = usuarios.find(u => u.correo.trim().toLowerCase() === this.email.trim().toLowerCase());

    if (usuarioEncontrado) {
      if (usuarioEncontrado.password === this.password) {
        await this.storage.set('usuarioSesion', {
          nombreApellido: usuarioEncontrado.nombreApellido,
          correo: usuarioEncontrado.correo,
          telefono: usuarioEncontrado.telefono,
          edad: usuarioEncontrado.edad,
          carrera: usuarioEncontrado.carrera,
          password: usuarioEncontrado.password
        });

        await loading.dismiss();
        this.router.navigate(['/home']);
      } else {
        await loading.dismiss();
        this.presentToast('Contraseña incorrecta. Intenta de nuevo.');
      }
    } else {
      await loading.dismiss();
      this.presentToast('Usuario no encontrado. Intenta de nuevo.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración del toast
      position: 'top', // Posición del toast
      color: 'danger'  // Color de alerta en caso de error
    });
    await toast.present();
  }
}
