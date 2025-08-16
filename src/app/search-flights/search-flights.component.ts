import { Component, OnInit } from '@angular/core';
import { FlightService } from '../api/services/flight.service';
import { Flight } from '../api/models/flight';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search-flights',
  templateUrl: './search-flights.component.html',
  styleUrl: './search-flights.component.css',
})
export class SearchFlightsComponent implements OnInit {
  searchResult: Flight[] = [];
  constructor(private flightService: FlightService, private fb: FormBuilder) {}
  searchForm = this.fb.group({
    from: [''],
    destination: [''],
    fromDate: [''],
    toDate: [''],
    numberOfPassengers: [1],
  });

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.flightService.searchFlight(this.searchForm.value).subscribe({
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
