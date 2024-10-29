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
    private storage: Storage  
  ) {}

  ngOnInit() {
    // Esperar 2 segundos antes de mostrar el logo
    setTimeout(() => {
      const logo = document.querySelector('.logo') as HTMLElement;
      if (logo) {
        logo.style.opacity = '1'; // Cambia la opacidad del logo 
      }

      // Esperar 1 segundo más y luego mostrar la seccion de login
      setTimeout(() => {
        const loginSection = document.querySelector('.login-section');
        if (loginSection) {
          loginSection.classList.add('show'); 
        }
      }, 1000); // 1000 ms = 1 segundo

    }, 2000); // 2000 ms = 2 segundos
  }

  async login() {
    // Obtener el array de usuarios almacenado
    const usuarios: any[] = await this.storage.get('usuarios') || [];

    // Buscar el usuario que coincida con el correo ingresado 
    const usuarioEncontrado = usuarios.find(u => u.correo.trim().toLowerCase() === this.email.trim().toLowerCase());

    if (usuarioEncontrado) {

      if (usuarioEncontrado.password === this.password) {
        // Guardar todos los datos del usuario 
        await this.storage.set('usuarioSesion', {
          nombreApellido: usuarioEncontrado.nombreApellido,
          correo: usuarioEncontrado.correo,        
          telefono: usuarioEncontrado.telefono,    
          edad: usuarioEncontrado.edad,           
          carrera: usuarioEncontrado.carrera,      
          password: usuarioEncontrado.password     
        });

        // Redirige a la pagina de inicio
        this.router.navigate(['/home']);
      } else {
        alert('Contraseña incorrecta. Intenta de nuevo.');
      }
    } else {
      alert('Usuario no encontrado. Intenta de nuevo.');
    }
  }
}
