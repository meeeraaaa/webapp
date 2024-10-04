import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetails = () => {
    const { id } = useParams(); // courseId from URL
    const [course, setCourse] = useState(null);
    const [completedChapters, setCompletedChapters] = useState(0); // number of chapters completed
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
    // const [userName, setUserName] = useState('');
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
                // course details and user's progress
                const response = await axios.get(`http://localhost:1200/user/course/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('this is what i am getting' ,response.data); 
                // const { course, progress, user  } = response.data;
                const { course, progress  } = response.data;
                setCourse(course);
                setCompletedChapters(progress.chapters_completed || 0); 
                // setUserName(user.name); 
                //setCourseSkills(course.skills.map(courseSkill => courseSkill.skill.name)); // course skills
                if (Array.isArray(course.skills)) {
                    setCourseSkills(course.skills.map(courseSkill => courseSkill.skill.name)); // course skills
                } else {
                    setCourseSkills([]); // or handle the case when there are no skills
                }
                
                setDifficultyLevel(course.difficulty_level); 
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching course details', error);
                setError('Failed to fetch course details. Please try again later.');
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id, navigate]);

    // Handle when user checks off chapters
    const handleChapterProgress = async (chapter) => {
        const token = localStorage.getItem('token');
        // const userId = localStorage.getItem('userId');
        console.log(localStorage.getItem('token'));
        // console.log(localStorage.getItem('userId'));

        // Check for token and userId
        if (!token) {
            console.warn("User is not authenticated. Redirecting to login.");
            navigate('/');
            return; // stop further execution
        }
    
        // Proceed to update chapter progress
        if (chapter > completedChapters) {
            try {
                setCompletedChapters(chapter);
    
                await axios.put('http://localhost:1200/user/update-progress', {
                    // userId: userId,
                    courseId: id,
                    chaptersCompleted: chapter - completedChapters // only marking one chapter as completed
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
        return <div>Loading course details...</div>;
    }

    if (error) {
        return <div>{error}</div>; 
    }

    //  "Done" button - redirect user
    const handleDone = () => {
        alert('Progress saved!');
        navigate('/user-dashboard'); // dashboard after completion
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="course-details">
            <h1>{course.title}</h1>
            {/* <p>User: {userName}</p>  */}
            <p>Difficulty Level: {difficultyLevel}</p> 
            <p>Skills: {courseSkills.join(', ')}</p> 
            
            <div className="chapter-list">
                <h2>Chapters</h2>
                <ul>
                    {Array.from({ length: course.no_of_chapters }, (_, i) => (
                        <li key={i}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={i < completedChapters} // Mark the checkbox as checked if the chapter is completed
                                    onChange={() => handleChapterProgress(i + 1)}
                                    disabled={i + 1 > completedChapters + 1} // Only allow the next chapter to be checked
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
