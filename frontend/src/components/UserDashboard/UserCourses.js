import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserCourses = () => {
    const { id } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:1200/user/course/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourseDetails(response.data); // Assuming this returns course details
            } catch (error) {
                console.error('Error fetching course details', error);
            }
        };

        fetchCourseDetails();
    }, [id]);

    if (!courseDetails) return <p>Loading...</p>;

    return (
        <div className="user-course">
            <h1>{courseDetails.title}</h1>
            <p>{courseDetails.description}</p>
            {/* Add additional course content here, like video links, modules, etc. */}
            <button onClick={() => console.log("Start Course")}>Start Course</button> {/* Placeholder for course action */}
        </div>
    );
};

export default UserCourses;
