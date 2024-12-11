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
import * as turf from "@turf/turf";



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
  duocSedes = [
    { nombre: 'Duoc UC - Sede Plaza Oeste', lat: -33.50742, lng: -70.72646 },
    { nombre: 'Duoc UC - Sede Maipú', lat: -33.51333, lng: -70.75444 },
    { nombre: 'Duoc UC - Sede San Joaquín', lat: -33.50158, lng: -70.61539 },
    { nombre: 'Duoc UC - Sede Puente Alto', lat: -33.60867, lng: -70.57966 },
    { nombre: 'Duoc UC - Sede Antonio Varas', lat: -33.42628, lng: -70.62697 },
    { nombre: 'Duoc UC - Sede Alameda', lat: -33.45729, lng: -70.64891 },
    { nombre: 'Duoc UC - Sede Ñuñoa', lat: -33.46342, lng: -70.60972 },
    { nombre: 'Duoc UC - Sede Macul', lat: -33.47512, lng: -70.60450 },
    { nombre: 'Duoc UC - Sede San Carlos de Apoquindo', lat: -33.41981, lng: -70.58992 },
];
  

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

  selectedStartPoint: any = null;

  onStartPointChange(event: any) {
    const selectedSede = event.detail.value;
    if (selectedSede) {
      this.startPoint = selectedSede.nombre; // Actualiza el nombre del punto de partida
      this.setPoint(selectedSede.lat, selectedSede.lng, true); // Marca la sede en el mapa
      this.map.flyTo({ center: [selectedSede.lng, selectedSede.lat], zoom: 15 }); // Mueve el mapa hacia la sede
    }
  }

  isPointInRegion(lat: number, lng: number): boolean {
    const point = turf.point([lng, lat]);
    const region = turf.polygon(this.regionMetropolitanaBounds.coordinates);
    return turf.booleanPointInPolygon(point, region);
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
  
    // Listener para mantener los marcadores fijos al hacer zoom
    this.map.on('zoom', () => {
      if (this.startMarker) {
        this.startMarker.setLngLat(this.startMarker.getLngLat());
      }
      if (this.endMarker) {
        this.endMarker.setLngLat(this.endMarker.getLngLat());
      }
    });
  }
  
  regionMetropolitanaBounds: any = {
    type: "Polygon",
    coordinates: [
      [
        [-71.3026, -33.7886], // Punto noroeste
        [-70.3484, -33.7886], // Punto noreste
        [-70.3484, -34.2486], // Punto sureste
        [-71.3026, -34.2486], // Punto suroeste
        [-71.3026, -33.7886], // Cerramos el polígono
      ],
    ],
  };
  
  
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
        // Validar si el punto final está en la Región Metropolitana
        const isValid = this.isPointInRegion(endCoords[1], endCoords[0]);
        if (!isValid) {
          const alert = await this.alertController.create({
            header: 'Ubicación no válida',
            message: 'Tu ubicación final está fuera de la Región Metropolitana.',
            buttons: ['OK'],
          });
          await alert.present();
          return;
        }
  
        this.setPoint(startCoords[1], startCoords[0], true); 
        this.setPoint(endCoords[1], endCoords[0], false);   
  
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(startCoords); 
        bounds.extend(endCoords);   
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
