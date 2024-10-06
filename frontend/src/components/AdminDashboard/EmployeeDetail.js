import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  CartesianGrid,
} from 'recharts';

const CustomXAxis = (props) => (
  <XAxis
    {...props}
    tickFormatter={(tick) => new Date(tick).toLocaleDateString()} // Formatting date
    dataKey="updatedAt" // Make sure to match this with the actual data key for dates
  />
);

const CustomYAxis = (props) => (
  <YAxis {...props} domain={[0, 100]}>
    <Label value="Percentage" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
  </YAxis>
);

const EmployeeDetailModal = ({ employeeId, employeeName, onClose }) => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressResponse = await fetch(`http://localhost:1200/admin/employees/${employeeId}/progress`);
        const progressData = await progressResponse.json();
        setProgressData(progressData);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [employeeId]);

  const formatDataForChart = () => {
    return progressData.map(({ updatedAt, courseTitle, percentage_completed }) => ({
      updatedAt, // Use updatedAt from your Progress schema
      courseTitle,
      percentage_completed,
    }));
  };

  const chartData = formatDataForChart();

  return (
    <div className="employee-progress">
      <h3>Progress of {employeeName}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
          <CartesianGrid strokeDasharray="3 3" />
          <CustomXAxis />
          <CustomYAxis />
          <Tooltip formatter={(value) => [value, 'Progress Percentage']} />
          <Legend formatter={(value) => <span>{value}</span>} />

          {/* Create lines for each course title */}
          {Array.from(new Set(chartData.map(item => item.courseTitle))).map((courseTitle, index) => (
            <Line
              key={courseTitle} // Use course title as key
              type="monotone"
              dataKey={item => item.courseTitle === courseTitle ? item.percentage_completed : null}
              stroke={['#8CE0FF', '#FDB0C2', '#9BE69B', '#C0B6FF'][index % 4]} // Corresponding colors for lines
              strokeWidth={2}
              dot={false}
              name={courseTitle} // Course title for the legend
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeDetailModal;
