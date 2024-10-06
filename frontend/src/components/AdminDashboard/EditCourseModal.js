import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditCourseModal = ({ show, handleClose, courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    difficulty_level: '',
    no_of_chapters: '',
    duration: '',
  });

  useEffect(() => {
    // Fetch specific course details by courseId
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:1200/admin/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const selectedCourse = response.data;
        if (selectedCourse) {
          setCourseData(selectedCourse);
          setFormData({
            title: selectedCourse.title,
            difficulty_level: selectedCourse.difficulty_level,
            no_of_chapters: selectedCourse.no_of_chapters,
            duration: selectedCourse.duration,
          });
        } else {
          setError('Course not found');
        }
      } catch (error) {
        setError('Error fetching course data. Please try again later.');
      }
    };

    if (show && courseId) {
      fetchCourseDetails();
    }
  }, [show, courseId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Updating course with ID:', courseId, 'and data:', formData); // Log the update attempt
  
      const response = await axios.put(`http://localhost:1200/admin/update-course/${courseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Course updated successfully:', response.data);
      handleClose(); // Close modal after submission
    } catch (error) {
      console.error('Error updating course:', error);
      if (error.response) {
        console.error('Response data:', error.response.data); // Log response data
        console.error('Response status:', error.response.status); // Log status code
        setError('Error updating course: ' + error.response.data.message || 'Please try again later.'); // Show specific error message
      } else if (error.request) {
        console.error('Request data:', error.request); // Log request if no response was received
        setError('No response received. Please try again later.');
      } else {
        console.error('Error message:', error.message); // Log other errors
        setError('Error: ' + error.message);
      }
    }
  };
  

  // Do not render modal if no course data is available
  if (!courseData) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required
            />
          </Form.Group>
          <Form.Group controlId="difficulty_level">
            <Form.Label>Difficulty Level</Form.Label>
            <Form.Control 
              as="select" 
              name="difficulty_level" 
              value={formData.difficulty_level} 
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="no_of_chapters">
            <Form.Label>No. of Chapters</Form.Label>
            <Form.Control 
              type="number" 
              name="no_of_chapters" 
              value={formData.no_of_chapters} 
              onChange={handleChange} 
              min="1"
              required
            />
          </Form.Group>
          <Form.Group controlId="duration">
            <Form.Label>Duration (hrs)</Form.Label>
            <Form.Control 
              type="number" 
              name="duration" 
              value={formData.duration} 
              onChange={handleChange} 
              step="0.1"
              min="0.1"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update Course
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCourseModal;
