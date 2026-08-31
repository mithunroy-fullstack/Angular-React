using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using StudentService.Data;
using StudentService.Models;
using Microsoft.EntityFrameworkCore;

namespace StudentService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();
            return Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
        }

       [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, Student student)
        {
            // Check whether URL ID and Student ID are the same
            if (id != student.Id)
                return BadRequest();

            // Find existing student
            var existingStudent = await _context.Students.FindAsync(id);

            // Student doesn't exist
            if (existingStudent == null)
                return NotFound();

            // Update properties
            existingStudent.Name = student.Name;
            existingStudent.Email = student.Email;           

            // Save changes
            await _context.SaveChangesAsync();

            // Update successful
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }

      [HttpGet("/api/performance")]
        public async Task<IActionResult> GetPerformanceData()
        {
            var result = await (from p in _context.Performance
                                join s in _context.Students on p.StudentId equals s.Id
                                select new
                                {
                                    p.StudentId,
                                    s.Name,
                                    p.CourseName,
                                    p.ExamDate,
                                    p.Score,
                                    p.Grade
                                }).ToListAsync();

            return Ok(result);
        }



    }
}
