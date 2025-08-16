import { Component } from '@angular/core';
import { FlightService } from '../api/services/flight.service';
import { Flight } from '../api/models/flight';

@Component({
  selector: 'app-search-flights',
  templateUrl: './search-flights.component.html',
  styleUrl: './search-flights.component.css',
})
export class SearchFlightsComponent {
  searchResult: Flight[] = [];
  constructor(private flightService: FlightService) {}
  search() {
    this.flightService.searchFlight({}).subscribe({
      next: (response) => (this.searchResult = response),
      error: this.handleError,
    });
  }
  private handleError(err: any) {
    console.log('Response Error. Status ', err.status);
    console.log('Response Error. Text ', err.statusText);

    console.log(err);
  }
}
