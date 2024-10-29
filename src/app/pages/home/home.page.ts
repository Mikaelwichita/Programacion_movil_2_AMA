import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../services/weather.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  weatherData: any;
  city: string = 'San Joaquin';
  role: string = '';
  passengerCapacity: number = 1;
  startPoint: string = '';
  endPoint: string = '';
  tripCost: number | null = null;
  readonly conversionRate = 900; 

  constructor(
    private weatherService: WeatherService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async getWeather() {
    try {
      this.weatherData = await this.weatherService.getWeather(this.city);
    } catch (error) {
      console.error('Error al obtener los datos del clima', error);
    }
  }

  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  onRoleChange() {
    if (this.role === 'conductor') {
      this.passengerCapacity = 1;
    }
    this.updateTripCost();
  }

  updateTripCost() {
    if (this.role && this.startPoint && this.endPoint && (this.role === 'pasajero' || this.passengerCapacity > 0)) {
      const randomCLP = Math.floor(Math.random() * (45000 - 9000 + 1)) + 9000; 
      this.tripCost = randomCLP; 
    } else {
      this.tripCost = null;
    }
  }
  
  

  async startTrip() {
    if (!this.startPoint || !this.endPoint || !this.role || (this.role === 'conductor' && this.passengerCapacity <= 0)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos requeridos antes de iniciar el viaje.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Viaje Iniciado',
      message: `Tu viaje de ${this.startPoint} a ${this.endPoint} ha comenzado. Precio estimado: $${this.tripCost} CLP.`,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
