import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavBar from './../Layout/UserNavBar'; // Import the UserNavBar
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const UserDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [courseProgress, setCourseProgress] = useState([]); // State for course progress
    const [markedDates, setMarkedDates] = useState([]); // State for marked dates
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/'); 
                return;
            }

            try {
                // Decode the token to extract user ID (assuming it's a JWT)
                const userId = JSON.parse(atob(token.split('.')[1])).id; // Extracting user ID from the token

                // Fetch user info
                const userResponse = await axios.get(`http://localhost:1200/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(userResponse.data.user);

                // Fetch courses
                const coursesResponse = await axios.get('http://localhost:1200/user/courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(coursesResponse.data.courses);

                // Fetch progress updates for Gantt chart using the user ID from token
                const progressResponse = await axios.get(`http://localhost:1200/user/${userId}/course-progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourseProgress(progressResponse.data);

                // Prepare marked dates for calendar
                const dates = progressResponse.data.map(progress => new Date(progress.updatedAt).toDateString());
                setMarkedDates(dates);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [navigate]);

    // Function to check if a date is marked
    const tileClassName = ({ date }) => {
        if (markedDates.includes(date.toDateString())) {
            return 'highlighted-date'; // Apply a specific class for highlighted dates
        }
        return null;
    };

    return (
        <div className="user-dashboard container mt-5">
            <UserNavBar /> {/* Use the UserNavBar component */}
            <h1 className="dashboard-title">Welcome, {userInfo.name}</h1>
            <div className="course-list">
                <h2>Your Courses</h2>
                {courses.length === 0 ? (
                    <p>No courses assigned yet.</p>
                ) : (
                    <ul className="course-items">
                        {courses.map(course => (
                            <li key={course.id} className="course-item">
                                <h3>{course.title}</h3>
                                <p>Progress: {course.percentage_completed}%</p>
                                <button className="btn btn-info" onClick={() => navigate(`/user/course/${course.id}`)}>View Course</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Calendar Section */}
            <div>
                <h2>Your Course Progress Dates</h2>
                <Calendar
                    tileClassName={tileClassName}
                    // Add more props as needed
                />
            </div>
        </div>
    );
};

export default UserDashboard;
