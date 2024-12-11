import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isChangingPassword: boolean = false;
  usuario: any = null;

  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async handleAction() {
    if (!this.isChangingPassword) {
      const loading = await this.loadingController.create({
        message: 'Verificando correo...',
        spinner: 'crescent',
        duration: 2000, 
      });
      await loading.present();  

      
      const usuarios: any[] = (await this.storage.get('usuarios')) || [];
      this.usuario = usuarios.find(u => u.correo.trim().toLowerCase() === this.email.trim().toLowerCase());

      setTimeout(async () => {
        if (this.usuario) {
          this.isChangingPassword = true; 
        } else {
          this.presentToast('Correo no encontrado.');
        }
        await loading.dismiss();  
      }, 2000); 
    } else {
      
      if (this.newPassword !== this.confirmPassword) {
        this.presentToast('Las contraseñas no coinciden.');
        return;
      }

      this.usuario.password = this.newPassword;
      const usuarios: any[] = (await this.storage.get('usuarios')) || [];
      const index = usuarios.findIndex(u => u.correo === this.usuario.correo);
      if (index !== -1) {
        usuarios[index] = this.usuario;
        await this.storage.set('usuarios', usuarios);
        this.presentToast('Contraseña actualizada correctamente.', 'success');
        this.router.navigate(['/login']);
      }
    }
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
