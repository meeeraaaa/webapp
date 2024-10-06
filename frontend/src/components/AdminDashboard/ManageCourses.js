import React from 'react';
import AddCourse from './AddCourseModal';
import CourseTable from './CourseTable';
import { Row, Col } from 'react-bootstrap';
import Navbar from "./../Layout/NavBar";

const ManageCourses = () => {
  return (
    <div className="container-fluid">
      <Navbar />
      <Row className="mb-3">
        <Col>
          <AddCourse /> 
        </Col>
      </Row>
      <Row>
        <Col>
          <CourseTable /> 
        </Col>
      </Row>
    </div>
  );
};

export default ManageCourses;
