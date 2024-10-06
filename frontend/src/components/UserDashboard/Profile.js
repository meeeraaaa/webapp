import React, { useEffect, useState } from "react";
import UserNavBar from "./../Layout/UserNavBar";
import "./../../styles/App.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:1200/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        console.log(data); // Log the API response
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
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
    <div className="profile container mt-5">
      <UserNavBar />
      <h1 className="profile-title">{user?.name || "User"}'s Profile</h1>
      <h2>Email: {user.mail}</h2>
      <h3>{user.designation}</h3>
      <h3>Skills:</h3>
      <ul className="skills-list">
    {user.skills.length > 0 ? (
        user.skills.map((skill, index) => (
            <li key={index} className="skill-item">
                {skill ? skill : 'Unknown Skill'} {/* Ensure skill is defined */}
            </li>
        ))
    ) : (
        <li>No skills available.</li>
    )}
</ul>

      <h3>Completed Courses:</h3>
      <ul className="courses-list">
        {user.completedCourses?.length > 0 ? (
          user.completedCourses.map((course) => (
            <li key={course.id} className="course-item">
              {course.title} - Certificate:
              <a
                href={course.certificate}
                target="_blank"
                rel="noopener noreferrer"
              >
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
