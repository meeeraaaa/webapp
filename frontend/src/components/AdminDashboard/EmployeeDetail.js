import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const CustomXAxis = (props) => <XAxis {...props} />;
const CustomYAxis = (props) => <YAxis {...props} />;

const EmployeeDetailModal = ({ employeeId, onClose }) => {
    const [courses, setCourses] = useState([]);
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        // Fetch employee courses and progress
        const fetchCourses = async () => {
            try {
                const coursesResponse = await fetch(`http://localhost:1200/admin/employees/${employeeId}/courses`);
                const coursesData = await coursesResponse.json();
                setCourses(coursesData);

                const progressResponse = await fetch(`http://localhost:1200/admin/employees/${employeeId}/progress`);
                const progressData = await progressResponse.json();
                setProgressData(progressData);
            } catch (error) {
                console.error('Error fetching courses or progress:', error);
            }
        };

        fetchCourses();
    }, [employeeId]);

    const formatDataForChart = () => {
        const chartData = {};

        progressData.forEach(entry => {
            const date = entry.date;
            Object.keys(entry).forEach(courseTitle => {
                if (courseTitle !== 'date') {
                    if (!chartData[courseTitle]) {
                        chartData[courseTitle] = [];
                    }
                    chartData[courseTitle].push({ date, percentage: entry[courseTitle] });
                }
            });
        });

        return Object.keys(chartData).map(courseTitle => ({
            courseTitle,
            data: chartData[courseTitle],
        }));
    };

    const chartData = formatDataForChart();

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
                                <td>{new Date(course.updatedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No courses found for this employee.</p>
            )}

            {/* Line Chart for Progress Over Time */}
            <h3>Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData.flatMap(course => course.data)}>
                    <CustomXAxis dataKey="date" />
                    <CustomYAxis />
                    <Tooltip />
                    <Legend />
                    {chartData.map((course, index) => (
                        <Line 
                            key={index}
                            type="monotone"
                            dataKey="percentage"
                            data={course.data}
                            stroke={['#edfaff', '#88f9bb', '#4dbf85', '#008953'][index]}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EmployeeDetailModal;
