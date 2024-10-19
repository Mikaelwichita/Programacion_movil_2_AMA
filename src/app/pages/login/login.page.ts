import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

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

  login() {
    
    if (this.email === 'usuario@ejemplo.com' && this.password === 'contraseña') {
      
      this.router.navigate(['/home']);
    } else {
      
      alert('Credenciales incorrectas. Intenta de nuevo.');
    }
  }
}
