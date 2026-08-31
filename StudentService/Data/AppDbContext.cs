using Microsoft.EntityFrameworkCore;
using StudentService.Models; 

namespace StudentService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        // DbSets represent tables
        public DbSet<Student> Students { get; set; }
        public DbSet<Performance> Performance { get; set; }
    }
}
