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

const EmployeeDetailModal = ({ employeeId, onClose }) => {
  const [progressData, setProgressData] = useState([]);
  const [userDeatils, setUserDetails] = useState([]);

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
    const fetchUserDeatils = async () => {
      try {
        const response = await fetch(`http://localhost:1200/admin/employees`);
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
    fetchUserDeatils();
  }, [employeeId]);

  const formatDataForChart = () => {
    return progressData.map(({ updatedAt, courseTitle, percentage_completed }) => ({
      updatedAt,
      courseTitle,
      percentage_completed,
    }));
  };
  function getUserNameById(userId) {
    const user = userDeatils.find(user => user.id === userId);
    return user ? user.name : "User not found";
}
  
  const chartData = formatDataForChart();

  return (
    <div className="employee-progress">
      <h3>Progress of {getUserNameById(employeeId)}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
          <CartesianGrid strokeDasharray="3 3" />
          <CustomXAxis />
          <CustomYAxis />
          <Tooltip formatter={(value) => [value, 'Progress Percentage']} />
          <Legend formatter={(value) => <span>{value}</span>} />

          {Array.from(new Set(chartData.map(item => item.courseTitle))).map((courseTitle, index) => (
            <Line
              key={courseTitle} // course title as key
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
