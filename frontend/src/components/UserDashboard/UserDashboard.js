//C:\Users\AnanyaSarkar\Documents\project\webapp\frontend\src\components\UserDashboard\UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    //const [error, setError] = useState(null);
    

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); 
                return;
            }

            try {
                // Fetch user info and courses from backend
                const userResponse = await axios.get('http://localhost:1200/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(userResponse.data.user);

                const coursesResponse = await axios.get('http://localhost:1200/user/courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(coursesResponse.data.courses);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [navigate]);


    return (
        <div className="user-dashboard">
            <h1 className="dashboard-title">Welcome, {userInfo.name}</h1>
            <nav className="user-nav">
                <button onClick={() => navigate('/profile')}>Profile</button>
                {/* <button onClick={() => navigate('/user/courses')}>Courses</button> */}
                <button onClick={() => localStorage.removeItem('token') && navigate('/login')}>Logout</button>
            </nav>
            <div className="course-list">
                <h2>Your Courses</h2>
                {courses.length === 0 ? (
                    <p>No courses assigned yet.</p>
                ) : (
                    <ul>
                        {courses.map(course => (
                            <li key={course.id}>
                                <h3>{course.title}</h3>
                                <p>Progress: {course.percentage_completed}%</p>
                                <button onClick={() => navigate(`/user/course/${course.id}`)}>View Course</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
