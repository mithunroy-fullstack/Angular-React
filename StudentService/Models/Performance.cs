using System;

namespace StudentService.Models
{
    public class Performance
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public DateTime ExamDate { get; set; }
        public decimal Score { get; set; }
        public string Grade { get; set; } = string.Empty;
    }
}
