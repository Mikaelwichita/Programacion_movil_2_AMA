import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { TripHistoryService } from 'src/app/services/trip-history.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  trips: any[] = [];

  constructor(
    public menu: MenuController,
    private tripHistoryService: TripHistoryService
  ) {}

  ngOnInit() {
    this.trips = this.tripHistoryService.getTrips();
  }

  toggleMenu() {
    this.menu.toggle();
  }
}
