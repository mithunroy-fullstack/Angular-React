import React, { useEffect, useState } from 'react';
import { getCourses, deleteCourse } from '../services/courseService';
import { useNavigate } from 'react-router-dom';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      console.log('✅ Token saved to localStorage:', tokenFromUrl);
    }
  }, []);

  useEffect(() => {
    getCourses().then(data => setCourses(data));
  }, []);

  const handleDelete = async (id) => {
    await deleteCourse(id);
    setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Available Courses</h2>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate('/course/add')}
          >
            + Add Course
          </button>
          <button
            className="btn btn-dark"
            onClick={() => {
              localStorage.removeItem('token'); // clear JWT
              alert('You have been logged out.');
              window.location.href = 'http://localhost:4200/login'; // ✅ redirect to Angular login page
            }}
          >
            Logout
          </button>

        </div>
      </div>


      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Duration (hrs)</th>
                <th>Instructor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td><strong>{course.title}</strong></td>
                  <td>{course.description}</td>
                  <td>{course.duration}</td>
                  <td>{course.instructor}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm me-2"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/course/edit/${course.id}`)}
                    >
                      Edit
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default CourseList;
