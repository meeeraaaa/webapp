import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

const AddCourse = () => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState({ label: "Easy", value: "Easy" });
  const [noOfChapters, setNoOfChapters] = useState(1);
  const [duration, setDuration] = useState(0.0);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Fetch skills from the backend using async/await
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:1200/admin/skills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Format skills for react-select
        const formattedSkills = response.data.map((skill) => ({
          label: skill.name,
          value: skill.id,
        }));
        setSkills(formattedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  // Handle form submission with async/await
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const courseData = {
      title,
      difficulty_level: difficultyLevel.value, // Get value from the selected option
      no_of_chapters: noOfChapters,
      duration,
      skills: selectedSkills.map((skill) => skill.value), // Get value from selected skills
    };

    try {
      const response = await axios.post(
        "http://localhost:1200/admin/add-course",
        courseData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Course added successfully:", response.data);
      handleClose(); // Close modal after success
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  // Difficulty Level options
  const difficultyOptions = [
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
  ];

  return (
    <div>
      {/* Button to trigger the modal */}
      <Button variant="primary" onClick={handleShow}>
        Add Course
      </Button>

      {/* Modal for adding course */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Title Input */}
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Difficulty Level Dropdown using react-select */}
            <Form.Group controlId="formDifficulty">
              <Form.Label>Difficulty Level</Form.Label>
              <Select
                options={difficultyOptions}
                value={difficultyLevel}
                onChange={(selectedOption) => setDifficultyLevel(selectedOption)}
                isClearable
                required
              />
            </Form.Group>

            {/* Number of Chapters Input */}
            <Form.Group controlId="formNoOfChapters">
              <Form.Label>Number of Chapters</Form.Label>
              <Form.Control
                type="number"
                value={noOfChapters}
                onChange={(e) => setNoOfChapters(e.target.value)}
                min={1}
                required
              />
            </Form.Group>

            {/* Duration Input */}
            <Form.Group controlId="formDuration">
              <Form.Label>Duration (in hours)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min={0.1}
                required
              />
            </Form.Group>

            {/* Skills Dropdown using react-select */}
            <Form.Group controlId="formSkills">
              <Form.Label>Skills</Form.Label>
              <Select
                isMulti
                options={skills}
                value={selectedSkills}
                onChange={(selectedOptions) => setSelectedSkills(selectedOptions || [])}
                placeholder="Select skills"
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddCourse;
