import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../api/services/flight.service';
import { Flight } from '../api/models/flight';
import { AuthService } from '../auth/auth.service';
import { FormBuilder, Validator, Validators } from '@angular/forms';
import { BookDto } from '../api/models';

@Component({
  selector: 'app-book-flight',
  templateUrl: './book-flight.component.html',
  styleUrl: './book-flight.component.css',
})
export class BookFlightComponent implements OnInit {
  flightId: string = 'Not Loaded';
  flight: Flight = {};
  form = this.formbuilder.group({
    number: [
      1,
      Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(254),
      ]),
    ],
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    if (!this.authService.currentUser)
      this.router.navigate(['/register-passenger']);
    this.route.paramMap.subscribe((params) =>
      this.findFlight(params.get('flightId'))
    );
  }
  private findFlight = (flightId: string | null) => {
    this.flightId = flightId ?? 'not passed';

    this.flightService.findFlight({ id: this.flightId }).subscribe({
      next: (flight) => (this.flight = flight),
      error: this.handleError,
    });
  };

  private handleError = (err: any) => {
    if (err.status == 404) {
      alert('Flight not found. Please check the flight ID.');
      this.router.navigate(['/search-flights']);
    }
    if (err.status == 409) {
      console.log('err: ' + err);
      alert(JSON.parse(err.error).message);
    }
    console.log('Response Error. Status ', err.status);
    console.log('Response Error. Text ', err.statusText);

    console.log(err);
  };
  book() {
    if (this.form.invalid) return;
    console.log(
      'Booking flight',
      this.flightId,
      'with',
      this.form.get('number')?.value,
      'seats'
    );

    const booking: BookDto = {
      flightId: this.flight.id,
      passengerEmail: this.authService.currentUser?.email,
      numberOfSeats: this.form.get('number')?.value ?? undefined,
    };
    this.flightService.bookFlight({ body: booking }).subscribe({
      next: () => this.router.navigate(['/my-booking']),
      error: this.handleError,
    });
  }
  get number() {
    return this.form.controls.number;
  }
}
