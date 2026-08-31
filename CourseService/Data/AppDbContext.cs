using Microsoft.EntityFrameworkCore;
using CourseService.Models; 

namespace CourseService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        // DbSets represent tables
        public DbSet<Course> Courses { get; set; }
    }
}
