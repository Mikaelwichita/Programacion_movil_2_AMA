import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  // Importa Storage

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
    private storage: Storage  // Inyecta Storage
  ) {}

  ngOnInit() {
    // Esperar 2 segundos antes de mostrar el logo
    setTimeout(() => {
      const logo = document.querySelector('.logo') as HTMLElement;
      if (logo) {
        logo.style.opacity = '1'; // Cambia la opacidad del logo a 1 para hacerlo visible
      }

      // Esperar 1 segundo más y luego mostrar la sección de login
      setTimeout(() => {
        const loginSection = document.querySelector('.login-section');
        if (loginSection) {
          loginSection.classList.add('show'); // Agregar clase para mostrar el formulario
        }
      }, 1000); // 1000 ms = 1 segundo

    }, 2000); // 2000 ms = 2 segundos
  }

  async login() {
    // Obtener los datos almacenados
    const storedEmail = await this.storage.get('correo');
    const storedPassword = await this.storage.get('password');

    // Verificar si el correo y la contraseña coinciden
    if (this.email === storedEmail && this.password === storedPassword) {
      this.router.navigate(['/home']);
    } else {
      alert('Credenciales incorrectas. Intenta de nuevo.');
    }
  }
}
