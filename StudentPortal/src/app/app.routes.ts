import { Routes } from '@angular/router';
import { LoginComponent  } from './login/login';
import { StudentDashboardComponent } from './student/student-dashboard-component/student-dashboard-component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent  },
  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

