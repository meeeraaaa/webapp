import React, { useEffect, useState } from 'react';
import { FaEdit, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';

const CourseTable = () => {
  const [courses, setCourses] = useState([]);

  // Fetch courses data from the API
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
                <Button variant="link" className="p-0 me-2" title="Edit">
                  <FaEdit color="blue" />
                </Button>
                <Button variant="link" className="p-0" title="Assign">
                  <FaUserPlus color="green" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CourseTable;
