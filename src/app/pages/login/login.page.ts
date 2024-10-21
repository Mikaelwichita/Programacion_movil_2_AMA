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
    // Obtener el array de usuarios almacenado
    const usuarios: any[] = await this.storage.get('usuarios') || [];
  
    // Buscar el usuario que coincida con el correo ingresado
    const usuarioEncontrado = usuarios.find(u => u.correo === this.email);
  
    if (usuarioEncontrado) {
      // Verificar si la contraseña coincide
      if (usuarioEncontrado.password === this.password) {
        // Guardar los datos del usuario en Storage para la sesión, incluyendo la carrera
        await this.storage.set('usuarioSesion', {
          nombreApellido: usuarioEncontrado.nombreApellido,
          carrera: usuarioEncontrado.carrera,  // Almacenar la carrera del usuario
        });
  
        // Redirige a la página de inicio
        this.router.navigate(['/home']);
      } else {
        alert('Contraseña incorrecta. Intenta de nuevo.');
      }
    } else {
      alert('Usuario no encontrado. Intenta de nuevo.');
    }
  }
  
}
