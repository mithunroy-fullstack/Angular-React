import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceResponse,PredictionsResponse  } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  // Set the base URL for the Python container/service
  private baseUrl = 'http://localhost:8000/api/reports'; 

  constructor(private http: HttpClient) {}

  // Existing attendance method
  getAttendanceSummary(): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${this.baseUrl}/attendance-trends`);
  }

  // NEW METHOD: Fetches the machine learning predictive data arrays
  getPerformancePredictions(): Observable<PredictionsResponse> {
    return this.http.get<PredictionsResponse>(`${this.baseUrl}/performance-predictions`);
  }

}
