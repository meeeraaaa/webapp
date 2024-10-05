// AssignCourseModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';

const AssignCourseModal = ({ show, handleClose, courseId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Fetch employees data excluding those already assigned to the course
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch employees
        const employeesResponse = await axios.get('http://localhost:1200/admin/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch already assigned employees for this course
        const assignedEmployeesResponse = await axios.get(
          `http://localhost:1200/admin/courses/${courseId}/employees`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const assignedEmployeeIds = assignedEmployeesResponse.data.map((employee) => employee.userId);

        // Filter out employees already assigned to the course
        const availableEmployees = employeesResponse.data.filter(
          (employee) => !assignedEmployeeIds.includes(employee.id)
        );

        setEmployees(availableEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (courseId) {
      fetchEmployees();
    }
  }, [courseId]);

  // Handle assignment of selected employees
  const handleAssign = async () => {
    try {
      const token = localStorage.getItem('token');
      // Assign selected employees to the course
      await Promise.all(
        selectedEmployees.map(async (employee) => {
          await axios.post(
            'http://localhost:1200/admin/assign-course',
            {
              userId: employee.id,
              courseId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
      );

      alert('Course assigned successfully');
      handleClose(); // Close the modal after assignment
    } catch (error) {
      console.error('Error assigning course:', error);
      alert('Error assigning course');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmployees">
            <Form.Label>Select Employees</Form.Label>
            <Multiselect
              options={employees}
              selectedValues={selectedEmployees}
              onSelect={(selectedList) => setSelectedEmployees(selectedList)}
              onRemove={(selectedList) => setSelectedEmployees(selectedList)}
              displayValue="name" // Display employee names in the dropdown
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAssign}>
          Assign Course
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignCourseModal;
