import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'http://localhost:5258/api/Student';
  //private apiUrl = 'http://localhost:8001/api/reports/students';

  constructor(private http: HttpClient) {}

  // GET: api/Student
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // GET: api/Student/{id}
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // POST: api/Student
  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  // PUT: api/Student/{id}
  updateStudent(id: number, student: Student): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      student
    );
  }

  // DELETE: api/Student/{id}
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}