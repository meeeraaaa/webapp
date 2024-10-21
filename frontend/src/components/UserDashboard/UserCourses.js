import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavBar from './../Layout/UserNavBar';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
                // Fetch course and progress details
                const response = await axios.get(`http://localhost:1200/user/course/${id}/progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { course, progress } = response.data;

                // Set course details
                setCourse(course);
                setCompletedChapters(progress.completed_chapters || 0);

                // Set skills if they exist
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

        // Only allow updating the next chapter in sequence
        if (chapter === completedChapters + 1) {
            try {
                await axios.put('http://localhost:1200/user/update-progress', {
                    courseId: id,
                    chaptersCompleted: 1 // Increment by 1 chapter
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Update local state to reflect progress
                setCompletedChapters(chapter);

                // If all chapters are completed, trigger course completion
                if (chapter === course.no_of_chapters) {
                    handleDone();
                }
            } catch (error) {
                console.error('Error updating progress', error);
                setError('Failed to update progress. Please try again.');
            }
        }
    };

    const handleDone = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem("userId");

        if (!token) {
            console.warn("User is not authenticated. Redirecting to login.");
            navigate('/');
            return;
        }

        try {
            // Make the API call to complete the course
            await axios.post('http://localhost:1200/user/complete-course', {
                userId: userId,
                courseId: id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Course completed, certificate generated, and skills updated!');
            navigate('/user-dashboard');
        } catch (error) {
            console.error('Error completing course', error);
            alert('Failed to complete the course. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="loading-message">Loading course details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="course-details">
            <UserNavBar />
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
                                    checked={i < completedChapters} // Mark chapters as checked if completed
                                    onChange={() => handleChapterProgress(i + 1)}
                                    disabled={i + 1 > completedChapters + 1} // Disable future chapters
                                />
                                Chapter {i + 1}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Button Row for 'Update' and 'Finish' */}
            <div className="button-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                {/* Update Button - Link to Dashboard */}
                <Link className="btn btn-secondary" to="/user-dashboard">
                    Update
                </Link>

                {/* Finish Button */}
                <button
                    className="btn btn-primary"
                    onClick={handleDone}
                    disabled={completedChapters < course.no_of_chapters}
                >
                    Finish
                </button>
            </div>
        </div>
    );
};

export default CourseDetails;
