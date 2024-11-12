import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'ee5ab4352a57c98322952ce4c34d8a8b';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor() { }

  async getWeather(city: string) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el clima:', error);
      throw error;
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          lat: lat,
          lon: lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el clima por coordenadas:', error);
      throw error;
    }
  }
}
