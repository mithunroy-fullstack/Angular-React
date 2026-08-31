import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { StudentService } from '../../services/student.service';
import { ReportingService } from '../../services/reporting.service';
import { Student,AttendanceRecord,PerformancePrediction  } from '../../models/student';

@Component({
  selector: 'app-student-dashboard-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-dashboard-component.html',
  styleUrl: './student-dashboard-component.scss'
})
export class StudentDashboardComponent implements OnInit {

  students: Student[] = [];
  attendanceData: AttendanceRecord[] = [];
  predictionsData: PerformancePrediction[] = [];
  studentForm!: FormGroup;

  isEditMode = false;

  selectedStudentId: number | null = null;

  loading = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,private cdr: ChangeDetectorRef, private reportingService: ReportingService 
  ) {}

  ngOnInit(): void {

    this.createForm();

    this.loadStudents();
    this.loadReportingService();
    this.loadPerformancePredictions();
  }


  // --------------------------------------------------
  // Create Reactive Form
  // --------------------------------------------------

  createForm(): void {

    this.studentForm = this.fb.group({

      id: [0],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

      

    });
  }

  loadPerformancePredictions(): void {
    this.reportingService.getPerformancePredictions().subscribe({
      next: (response) => {
        this.predictionsData = response.predictions || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load performance predictions';
        console.error(err);
      }
    });
  }

  loadReportingService():void{
    this.reportingService.getAttendanceSummary().subscribe({
      next: (response) => {
        this.attendanceData = response.attendanceSummary;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reporting data';
        console.error(err);
      }
    });
  }
  
// --------------------------------------------------
// GET ALL STUDENTS
// GET: api/Student
// --------------------------------------------------

loadStudents(): void {
  this.loading = true;
  this.errorMessage = '';

  this.studentService.getAllStudents().subscribe({
    next: (data: Student[]) => {
      // 1. Fallback to an empty array if the API returns null, undefined, or 0 bytes
      this.students = data || [];
      console.log('API responded successfully. Students array:', this.students);
      
      // 2. CRITICAL: Turn off the loading state immediately so the table container can unhide
      this.loading = false; 
       this.cdr.detectChanges(); 
    },
    error: (err) => {
      this.errorMessage = 'Failed to load students.';
      console.error('API Error details:', err);
      this.loading = false; // Ensure loading stops on network/auth failure
       this.cdr.detectChanges(); 
    }
  });
}



  // --------------------------------------------------
  // CREATE STUDENT
  // POST: api/Student
  // --------------------------------------------------

  saveStudent(): void {

    if (this.studentForm.invalid) {

      this.studentForm.markAllAsTouched();

      return;
    }

    this.clearMessages();

    const student: Student = this.studentForm.value;

    // -----------------------------------------------
    // CREATE
    // -----------------------------------------------

    if (!this.isEditMode) {

      this.studentService.createStudent(student).subscribe({

        next: (createdStudent) => {

          this.successMessage =
            'Student created successfully.';

          this.students.push(createdStudent);

          this.resetForm();
        },

        error: (error) => {

          console.error('Create error:', error);

          this.errorMessage =
            'Unable to create student.';
        }

      });

    }

    // -----------------------------------------------
    // UPDATE
    // -----------------------------------------------

    // -----------------------------------------------
// UPDATE
// -----------------------------------------------
          // -----------------------------------------------
    // UPDATE
    // -----------------------------------------------
    else {
      if (this.selectedStudentId === null) {
        return;
      }

      this.studentService
        .updateStudent(this.selectedStudentId, student)
        .subscribe({
          next: () => {
            console.log('PUT successful');
            this.successMessage = 'Student updated successfully.';
            
            // 1. Load the fresh array from the database first
            this.studentService.getAllStudents().subscribe({
              next: (data: Student[]) => {
                this.students = data;
                
                // 2. Clear out edit tracking flags ONLY after the UI has received the new data
                this.resetForm(); 
              },
              error: (err) => {
                console.error('Reload error:', err);
              }
            });
          },
          error: (error) => {
            console.error('Update error:', error);
            this.errorMessage = 'Unable to update student.';
          }
        });
    }

  }


  // --------------------------------------------------
  // EDIT STUDENT
  // GET: api/Student/{id}
  // --------------------------------------------------

  editStudent(student: Student): void {

    this.isEditMode = true;

    this.selectedStudentId = student.id;

    this.studentForm.patchValue({

      id: student.id,

      name: student.name,

      email: student.email      

    });

    this.clearMessages();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // --------------------------------------------------
  // DELETE STUDENT
  // DELETE: api/Student/{id}
  // --------------------------------------------------

  deleteStudent(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.studentService.deleteStudent(id).subscribe({

      next: () => {

        this.successMessage =
          'Student deleted successfully.';

        this.students =
          this.students.filter(
            student => student.id !== id
          );
           this.cdr.detectChanges(); 
      },

      error: (error) => {

        console.error('Delete error:', error);

        this.errorMessage =
          'Unable to delete student.';
      }

    });
  }


  // --------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------

  cancelEdit(): void {

    this.resetForm();
  }


  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  resetForm(): void {

    this.isEditMode = false;

    this.selectedStudentId = null;

    this.studentForm.reset({
      id: 0,
      name: '',
      email: ''
      
    });
  }


  // --------------------------------------------------
  // CLEAR MESSAGES
  // --------------------------------------------------

  clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';
  }


  // --------------------------------------------------
  // FORM VALIDATION HELPERS
  // --------------------------------------------------

  get name() {
    return this.studentForm.get('name');
  }

  get email() {
    return this.studentForm.get('email');
  }

  logout(): void {
    localStorage.removeItem('token'); // clear JWT or session data
    alert('You have been logged out.');
    window.location.href = 'http://localhost:4200/login';

  }

 

}