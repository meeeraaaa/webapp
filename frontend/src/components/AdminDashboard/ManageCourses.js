import React from 'react';
import AddCourse from './AddCourse';
import CourseTable from './CourseTable';
import { Row, Col } from 'react-bootstrap';

const ManageCourses = () => {
  return (
    <div className="container-fluid">
      <Row className="mb-3">
        <Col>
          <AddCourse /> {/* Add Course Button */}
        </Col>
      </Row>
      <Row>
        <Col>
          <CourseTable /> {/* Course Table */}
        </Col>
      </Row>
    </div>
  );
};

export default ManageCourses;
