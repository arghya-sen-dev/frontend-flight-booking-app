import { Component, OnInit } from '@angular/core';
import { BookingRm, BookDto } from '../api/models';
import { BookingService } from '../api/services/booking.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent implements OnInit {
  bookings!: BookingRm[];
  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.bookingService
      .listBooking({ email: this.authService.currentUser?.email ?? '' })
      .subscribe({
        next: (r) => (this.bookings = r),
        error: (e) => this.handleError,
      });
  }
  private handleError(error: any): void {
    console.error('An error occurred:', error.status);
    console.error('An error occurred: error statusText', error.statusText);
    console.error(error);

    // Optionally, you can display an error message to the user
  }
  cancel(booking: BookingRm) {
    const dto: BookDto = {
      flightId: booking.flightId,
      numberOfSeats: booking.numberOfBookedSeats,
      passengerEmail: booking.passengerEmail,
    };

    this.bookingService.cancelBooking({ body: dto }).subscribe({
      next: (_) => (this.bookings = this.bookings.filter((b) => b != booking)),
      error: this.handleError,
    });
  }
}
