import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto'; 

export default function CourseCompletionChart() {
  const [completionData, setCompletionData] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 

  // Fetch available courses to display in the dropdown
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:1200/admin/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCompletionData = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:1200/admin/course/${courseId}/completion-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompletionData(response.data);
    } catch (error) {
      console.error('Error fetching completion data:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCompletionData(courseId);
    }
  }, [courseId]);

  // x-axis (designations) and data (completed/notCompleted)
  const xLabels = completionData.map((item) => item.designation);
  const completedData = completionData.map((item) => item.completed);
  const notCompletedData = completionData.map((item) => item.notCompleted);

  // Data for the Bar chart
  const data = {
    labels: xLabels,
    datasets: [
      {
        label: 'Completed',
        data: completedData,
        backgroundColor: '#CFC9FF',
      },
      {
        label: 'Not Completed',
        data: notCompletedData,
        backgroundColor: '#FFF2F1',
      },
    ],
  };

  // Handle course selection
  const handleCourseSelect = (id) => {
    setCourseId(id);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="course-completion-container">
      {/* Custom Dropdown */}
      <div className="custom-dropdown">
        <div className="dropdown-label" onClick={() => setIsOpen(!isOpen)}>
          {courseId ? courses.find(course => course.id === courseId)?.title : 'Select Course'}
        </div>
        {isOpen && (
          <div className="dropdown-options">
            {courses.map((course) => (
              <div
                key={course.id}
                className="dropdown-option"
                onClick={() => handleCourseSelect(course.id)}
              >
                {course.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render the bar chart if data is available */}
      {completionData.length > 0 && (
        <div className="chart-container">
          <Bar data={data} width={700} height={400} />
        </div>
      )}
    </div>
  );
}
