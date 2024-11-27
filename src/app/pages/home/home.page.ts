import { Router } from '@angular/router';
import { WeatherService } from '../services/weather.service';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { Geolocation } from '@capacitor/geolocation';
import { Component, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { TripHistoryService } from 'src/app/services/trip-history.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{ 
  map!: mapboxgl.Map;
  startMarker!: mapboxgl.Marker;
  endMarker!: mapboxgl.Marker;
  weatherData: any;
  city: string = '';
  role: string = '';
  passengerCapacity: number = 1;
  startPoint: string = '';
  endPoint: string = '';
  tripCost: number | null = null;
  readonly conversionRate = 900;

  constructor(
    private tripHistoryService: TripHistoryService,
    private http: HttpClient,
    private weatherService: WeatherService,
    private router: Router,
    private alertController: AlertController,
    private loadingService: LoadingService
  ) {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }


  
  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.6506, -33.4372], 
      zoom: 12, 
      accessToken: environment.mapboxApiKey,
    });
  
    this.map.addControl(new mapboxgl.NavigationControl());
  }
  
  setPoint(lat: number, lng: number, isStart: boolean) {
    const coords: [number, number] = [lng, lat]; 
    
    const marker = new mapboxgl.Marker({ color: isStart ? 'green' : 'red', draggable: false })
      .setLngLat(coords)
      .setPopup(new mapboxgl.Popup().setHTML(isStart ? "Punto de partida" : "Punto de llegada")) 
      .addTo(this.map); // Fija el marcador al mapa
  
    if (isStart) {
      if (this.startMarker) {
        this.startMarker.remove(); // Elimina cualquier marcador previo
      }
      this.startMarker = marker;
    } else {
      if (this.endMarker) {
        this.endMarker.remove(); // Elimina cualquier marcador previo
      }
      this.endMarker = marker;
    }
  }

  async updateMarkers() {
    if (!this.startPoint || !this.endPoint) {
      console.error('Por favor, ingresa ambos puntos.');
      return;
    }
  
    try {
      const startCoords = await this.getCoordinates(this.startPoint);
      const endCoords = await this.getCoordinates(this.endPoint);
  
      if (startCoords && endCoords) {
        this.setPoint(startCoords[1], startCoords[0], true); 
        this.setPoint(endCoords[1], endCoords[0], false);   
  
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(startCoords); // Agrega el inicio
        bounds.extend(endCoords);   // Agrega el final
        this.map.fitBounds(bounds, { padding: 50 }); 
      }
    } catch (error) {
      console.error('Error al actualizar los marcadores:', error);
    }
  }

  async getCoordinates(address: string): Promise<[number, number] | null> {
    try {
      const response: any = await this.http
        .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
          params: { access_token: environment.mapboxApiKey },
        })
        .toPromise();
      if (!response.features || response.features.length === 0) {
        console.error('No se encontraron resultados para la dirección proporcionada.');
        return null;
      }
      return response.features[0]?.center || null; // [Longitud, Latitud]
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      return null;
    }
  }
  
  
  async getWeather() {
    try {
      await this.loadingService.showLoading();
      this.weatherData = await this.weatherService.getWeather(this.city);
    } catch (error) {
      console.error('Error al obtener los datos del clima', error);
    } finally {
      await this.loadingService.hideLoading();
    }
  }

  async getWeatherByLocation() {
    try {
      await this.loadingService.showLoading();
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      this.weatherData = await this.weatherService.getWeatherByCoordinates(latitude, longitude);
    } catch (error) {
      console.error('Error al obtener la ubicación o los datos del clima', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo obtener la ubicación actual.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      await this.loadingService.hideLoading();
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
  
   
    if (!this.startMarker || !this.endMarker) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, asegúrate de que ambos puntos estén marcados en el mapa.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    await this.loadingService.showLoading();
  
    setTimeout(async () => {
      await this.loadingService.hideLoading();
  
      // Guardar el viaje en el historial
      this.tripHistoryService.addTrip({
        startPoint: this.startPoint,
        endPoint: this.endPoint,
        role: this.role,
        tripCost: this.tripCost!,
        date: new Date(),
      });
  
      const alert = await this.alertController.create({
        header: 'Viaje Iniciado',
        message: `Tu viaje de ${this.startPoint} a ${this.endPoint} ha sido registrado. Precio estimado: $${this.tripCost} CLP.`,
        buttons: ['OK'],
      });
      await alert.present();
  
    }, 2000);
  }
  } 
