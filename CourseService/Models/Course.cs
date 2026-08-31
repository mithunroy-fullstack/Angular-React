namespace CourseService.Models
{
    public class Course
    {
        public int Id { get; set; }              // Primary key
        public string? Title { get; set; }       // Course name
        public string? Description { get; set; } // Short summary
        public int Duration { get; set; }        // Duration in hours
        public string? Instructor { get; set; }  // Instructor name
    }
}
