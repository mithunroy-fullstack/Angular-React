export interface Student {
  id: number;
  name: string;
  email: string;  
}

export interface AttendanceRecord {
  StudentId: number;
  Name: string;
  attendance_rate: number;
}

export interface AttendanceResponse {
  attendanceSummary: AttendanceRecord[];
}

export interface PerformancePrediction {
  student_id: number;
  Name: string;
  attendance_rate: number;
  courseName: string;
  examDate: string;
  score: number;
  grade: string;
  predicted_score: number;
}

export interface PredictionsResponse {
  predictions: PerformancePrediction[];
}
