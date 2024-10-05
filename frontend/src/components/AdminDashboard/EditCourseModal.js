import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditCourseModal = ({ show, handleClose, courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    difficulty_level: '',
    no_of_chapters: '',
    duration: '',
    skillIds: [],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:1200/admin/course', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token
          },
        });
        const selectedCourse = response.data.find(course => course.id === courseId);
        if (selectedCourse) {
          setCourseData(selectedCourse);
          setFormData({
            title: selectedCourse.title,
            difficulty_level: selectedCourse.difficulty_level,
            no_of_chapters: selectedCourse.no_of_chapters,
            duration: selectedCourse.duration,
            skillIds: selectedCourse.skills.map(skill => skill.id), // Assuming skill objects have an id property
          });
        } else {
          setError('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Error fetching course data. Please try again later.');
      }
    };

    const fetchSkills = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:1200/admin/skills', {
            headers: {
              Authorization: `Bearer ${token}`, // Include token
            },
          });
          setSkills(response.data);
        } catch (error) {
          console.error('Error fetching skills:', error);
          setError('Error fetching skills. Please try again later.');
        }
      };

    if (show && courseId) {
      fetchCourses();
      fetchSkills();
    }
  }, [show, courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:1200/admin/update-course/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token
        },
      });
      handleClose(); // Close modal after submission
      // Optionally refresh course list or handle success state here
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Error updating course. Please try again later.');
    }
  };

  if (!courseData) return null; // Render nothing if no course data is available

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
            />
          </Form.Group>
          <Form.Group controlId="difficulty_level">
            <Form.Label>Difficulty Level</Form.Label>
            <Form.Control 
              as="select" 
              name="difficulty_level" 
              value={formData.difficulty_level} 
              onChange={handleChange}
            >
              <option value="">Select</option>
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
            />
          </Form.Group>
          <Form.Group controlId="duration">
            <Form.Label>Duration (hrs)</Form.Label>
            <Form.Control 
              type="number" 
              name="duration" 
              value={formData.duration} 
              onChange={handleChange} 
            />
          </Form.Group>
          {/* Render skill selection here, e.g., checkboxes or multi-select */}
          <Button variant="primary" type="submit">
            Update Course
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCourseModal;
