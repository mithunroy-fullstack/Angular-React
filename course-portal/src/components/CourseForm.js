import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCourse, getCourseById, updateCourse } from '../services/courseService';

function CourseForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // if present, we’re editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });

  // Load course data if editing
  useEffect(() => {
    if (id) {
      getCourseById(id).then(data => setFormData(data));
    }
  }, [id]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCourse(id, formData);
        alert('✅ Course updated successfully!');
      } else {
        await createCourse(formData);
        alert('✅ Course added successfully!');
      }
      navigate('/course/dashboard');
    } catch (error) {
      console.error('❌ Error saving course:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">{id ? 'Edit Course' : 'Add New Course'}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter course description"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Duration (hrs)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter duration"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter instructor name"
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success">
                {id ? 'Update Course' : 'Add Course'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/course/dashboard')}
              >
                ← Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseForm;
