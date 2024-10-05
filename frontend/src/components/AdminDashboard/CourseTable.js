import React, { useEffect, useState } from 'react';
import { FaEdit, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import AssignCourseModal from './AssignCourseModal'; 
import EditCourseModal from './EditCourseModal';

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:1200/admin/courses',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);
  const handleShowAssignModal = (courseId) => {
    setSelectedCourseId(courseId);
    setShowAssignModal(true);
  };

  const handleShowEditModal = (courseId) => {
    setSelectedCourseId(courseId);
    setShowEditModal(true);
  };

  // Hide the modals
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedCourseId(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCourseId(null);
  };

  return (
    <Container>
      <h2 className="my-4">Course Table</h2>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Difficulty Level</th>
            <th>No. of Chapters</th>
            <th>Duration (hrs)</th>
            <th>Skills</th>
            <th>Number of Employees Assigned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.title}</td>
              <td>{course.difficulty_level}</td>
              <td>{course.no_of_chapters}</td>
              <td>{course.duration}</td>
              <td>{course.skills.join(', ')}</td>
              <td>{course.numberOfEmployeesAssigned}</td>
              <td>
              <Button variant="link" className="p-0 me-2" title="Edit" onClick={() => handleShowEditModal(course.id)}>
                  <FaEdit color="blue" />
                </Button>
                <Button
                  variant="link"
                  className="p-0"
                  title="Assign"
                  onClick={() => handleShowAssignModal(course.id)}
                >
                  <FaUserPlus color="green" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedCourseId && (
        <AssignCourseModal
          show={showAssignModal}
          handleClose={handleCloseAssignModal}
          courseId={selectedCourseId}
        />
      )}
      {selectedCourseId && (
        <EditCourseModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          courseId={selectedCourseId}
        />
      )}

    </Container>
  );
};

export default CourseTable;
