import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

export default function CourseDifficultyChart() {
  const [difficultyData, setDifficultyData] = useState([]);

  // Fetch course difficulty data from the API
  const fetchCourseDifficultyData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const response = await axios.get('http://localhost:1200/admin/courses/difficulty-distribution', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert the response into an array suitable for charting
      const processedData = Object.entries(response.data).map(([difficulty, count]) => ({
        difficulty,
        count,
      }));

      setDifficultyData(processedData);
    } catch (error) {
      console.error('Error fetching course difficulty data:', error);
    }
  };

  useEffect(() => {
    fetchCourseDifficultyData(); // Fetch data on component mount
  }, []);

  // Prepare data for the Pie chart
  const labels = difficultyData.map((item) => item.difficulty);
  const counts = difficultyData.map((item) => item.count);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Courses',
        data: counts,
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
      },
    ],
  };

  return (
    <div className="difficulty-chart-container">
      <h2 className="difficulty-chart-title">Course Difficulty Distribution</h2>
      {/* Render the pie chart if data is available */}
      {difficultyData.length > 0 && (
        <div className="chart-container">
          <Pie data={data} width={400} height={400} />
        </div>
      )}
    </div>
  );
}
