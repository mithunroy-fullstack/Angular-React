import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ]

    });
  }


  onSubmit(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }


    console.log(
      'Login form:',
      this.loginForm.value
    );


    this.authService
      .login(this.loginForm.value)
      .subscribe({

        next: (res) => {

          console.log(
            'Login API Response:',
            res
          );


          // API response:
          // {
          //   "token": "eyJhbGciOiJIUzI1NiIs..."
          // }

          const token = res.token;

          console.log(
            'JWT Token:',
            token
          );


          if (!token) {

            console.error(
              'Token not found in response'
            );

            return;
          }


          // Save JWT
          localStorage.setItem(
            'token',
            token
          );


          // Get role from JWT
          const role =
            this.authService.getRoleFromToken(token);


          console.log(
            'Role from JWT:',
            role
          );


          // Student
          if (role === 'Student') {

            console.log(
              'Student login successful'
            );

            this.router.navigate([
              '/student/dashboard'
            ]);

          }

          // Course Admin
         else if (role === 'CourseAdmin') {
          console.log('Course Admin login successful');

          // Optional: show a short transition message
          alert('Redirecting to Course Portal...');

          // ✅ Redirect to React CoursePortal
          window.location.href = `http://localhost:3000/course/dashboard?token=${token}`;

        }

          // Unknown role
          else {

            console.error(
              'Unknown role:',
              role
            );

          }

        },

        error: (err) => {

          console.error(
            'Login failed:',
            err
          );

        }

      });
  }
}