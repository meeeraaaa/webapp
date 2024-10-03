import React, { useEffect, useState } from 'react';
const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:1200/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <div>No user data found.</div>;
    }

    return (
        <div className="profile">
            <h1>{user.name}'s Profile</h1>
            <h2>Email: {user.mail}</h2>
            <h3>Skills:</h3>
            <ul>
                {user.skills.map(skill => (
                    <li key={skill.skill.id}>{skill.skill.name}</li>
                ))}
            </ul>
            <h3>Completed Courses:</h3>
            <ul>
                {user.completedCourses.length > 0 ? (
                    user.completedCourses.map(course => (
                        <li key={course.id}>
                            {course.title} - Certificate: 
                            <a href={course.certificate} target="_blank" rel="noopener noreferrer">
                                View Certificate
                            </a>
                        </li>
                    ))
                ) : (
                    <li>No completed courses found.</li>
                )}
            </ul>
        </div>
    );
};

export default Profile;
