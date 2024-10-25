import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  weatherData: any;
  city: string = 'Santiago';

  constructor(private weatherService: WeatherService, private router: Router) {}

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
}
