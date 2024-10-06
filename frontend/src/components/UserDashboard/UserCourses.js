import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetails = () => {
    const { id } = useParams(); // courseId from URL
    const [course, setCourse] = useState(null);
    const [completedChapters, setCompletedChapters] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseSkills, setCourseSkills] = useState([]);
    const [difficultyLevel, setDifficultyLevel] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:1200/user/course/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { course, progress } = response.data;
                setCourse(course);
                setCompletedChapters(progress.chapters_completed || 0);
                if (Array.isArray(course.skills)) {
                    setCourseSkills(course.skills.map(courseSkill => courseSkill.skill.name));
                } else {
                    setCourseSkills([]);
                }

                setDifficultyLevel(course.difficulty_level);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching course details', error);
                setError('Failed to fetch course details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id, navigate]);

    const handleChapterProgress = async (chapter) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("User is not authenticated. Redirecting to login.");
            navigate('/');
            return;
        }

        if (chapter > completedChapters) {
            try {
                setCompletedChapters(chapter);

                await axios.put('http://localhost:1200/user/update-progress', {
                    courseId: id,
                    chaptersCompleted: chapter - completedChapters
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Error updating progress', error);
                setError('Failed to update progress. Please try again.');
            }
        }
    };

    if (isLoading) {
        return <div className="loading-message">Loading course details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const handleDone = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem("userId");

        if (!token) {
            console.warn("User is not authenticated. Redirecting to login.");
            navigate('/');
            return;
        }
    
        try {
            await axios.post('http://localhost:1200/user/complete-course', {
                userId: userId, // You need to get the logged-in user's ID
                courseId: id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Course completed and skills updated!');
            navigate('/user-dashboard');
        } catch (error) {
            console.error('Error completing course', error);
            alert('Failed to complete the course. Please try again.');
        }
    };
    
    return (
        <div className="course-details">
            <h1 className="course-title">{course.title}</h1>
            <p className="difficulty-level"><strong>Difficulty Level:</strong> {difficultyLevel}</p>
            <p className="skills"><strong>Skills:</strong> {courseSkills.join(', ')}</p>

            <div className="chapter-list">
                <h2>Chapters</h2>
                <ul>
                    {Array.from({ length: course.no_of_chapters }, (_, i) => (
                        <li key={i} className="chapter-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={i < completedChapters}
                                    onChange={() => handleChapterProgress(i + 1)}
                                    disabled={i + 1 > completedChapters + 1}
                                />
                                Chapter {i + 1}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="done-button" onClick={handleDone}>
                Done
            </button>
        </div>
    );
};

export default CourseDetails;
