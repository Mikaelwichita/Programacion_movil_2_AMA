import { Injectable } from '@angular/core';

interface Trip {
  startPoint: string;
  endPoint: string;
  role: string;
  tripCost: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TripHistoryService {
  private trips: Trip[] = [];

  addTrip(trip: Trip): void {
    this.trips.push(trip);
  }

  getTrips(): Trip[] {
    return this.trips;
  }
}
