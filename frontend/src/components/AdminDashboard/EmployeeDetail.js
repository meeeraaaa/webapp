import React from 'react';

const EmployeeDetailModal = ({ employeeId, courses, onClose }) => {
    return (
        <div className="employee-courses">
          <h3>Courses Assigned</h3>
          {courses.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Difficulty Level</th>
                  <th>Chapters Completed</th>
                  <th>Total Chapters</th>
                  <th>Completion Percentage</th>
                  <th>Duration (hours)</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.course.title}</td>
                    <td>{course.course.difficulty_level}</td>
                    <td>{course.chapters_completed}</td>
                    <td>{course.course.no_of_chapters}</td>
                    <td>{course.percentage_completed}%</td>
                    <td>{course.course.duration}</td>
                    <td>{new Date(course.updatedAt).toLocaleDateString()}</td> {/* Last updated date */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No courses found for this employee.</p>
          )}
        </div>
      );
      
};

export default EmployeeDetailModal;
