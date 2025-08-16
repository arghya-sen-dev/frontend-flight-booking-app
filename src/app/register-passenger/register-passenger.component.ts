import { Component } from '@angular/core';
import { PassengerService } from '../api/services/passenger.service';
import { FormBuilder, Validator, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-passenger',
  templateUrl: './register-passenger.component.html',
  styleUrl: './register-passenger.component.css',
})
export class RegisterPassengerComponent {
  constructor(
    private passengerService: PassengerService,
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  form = this.formbuilder.group({
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
    ],
    firstName: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
      ]),
    ],
    lastName: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
      ]),
    ],
    isFemale: [true, Validators.required],
  });
  checkPassenger(): void {
    const params = { email: this.form.get('email')?.value ?? '' };
    this.passengerService.findPassenger(params).subscribe({
      next: this.login,
      error: (err) => {
        if (err.status != 404) console.error(err);
      },
    });
  }
  register() {
    if (this.form.invalid) {
      return;
    }
    console.log('Registering passenger with data: ', this.form.value);
    this.passengerService
      .registerPassenger({ body: this.form.value })
      .subscribe({
        next: this.login,
        error: (err) => {
          console.error(err);
        },
      });
  }
  private login = () => {
    this.authService.loginUser({
      email: this.form.get('email')?.value ?? '',
    });
    this.router.navigate(['/search-flights']);
  };
}
