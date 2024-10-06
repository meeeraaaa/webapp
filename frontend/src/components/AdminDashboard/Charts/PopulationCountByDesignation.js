import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto'; 

export default function PopulationByDesignation() {
  const [populationData, setPopulationData] = useState([]);

  // Fetch employee data from the API
  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const response = await axios.get('http://localhost:1200/admin/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Process the employee data to count number of employees by designation
      const designationCount = {};
      response.data.forEach(employee => {
        const designation = employee.designation.title;
        if (designationCount[designation]) {
          designationCount[designation]++;
        } else {
          designationCount[designation] = 1;
        }
      });

      // Convert the designationCount object to an array for charting
      const processedData = Object.keys(designationCount).map(key => ({
        designation: key,
        count: designationCount[key],
      }));

      setPopulationData(processedData);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeData(); // Fetch data on component mount
  }, []);

  // Prepare data for the Bar chart
  const xLabels = populationData.map((item) => item.designation);
  const employeeCounts = populationData.map((item) => item.count);

  const data = {
    labels: xLabels,
    datasets: [
      {
        label: 'Number of Employees',
        data: employeeCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
      },
    ],
  };

  return (
    <div className="population-container">
      <h2 className="population-title">Employee Population by Designation</h2>
      {/* Render the bar chart if data is available */}
      {populationData.length > 0 && (
        <div className="chart-container">
          <Bar data={data} width={700} height={400} />
        </div>
      )}
    </div>
  );
}
