import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  
import { LoadingController, ToastController } from '@ionic/angular';  

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
    private loadingController: LoadingController,  
    private toastController: ToastController       
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

        // Emitir el evento para actualizar los datos en app.component.ts
        window.dispatchEvent(new CustomEvent('usuarioSesionActualizada'));

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
      duration: 2000, 
      position: 'top', 
      color: 'danger'  
    });
    await toast.present();
  }
}
