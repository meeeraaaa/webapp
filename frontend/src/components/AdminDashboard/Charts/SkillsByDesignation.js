import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

export default function SkillsByDesignation() {
    const [skills, setSkills] = useState([]);
    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [designationData, setDesignationData] = useState([]);

    // Fetch available skills
    const fetchSkills = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get('http://localhost:1200/admin/skills', {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              });
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    // Fetch designation count for the selected skill
    const fetchDesignationData = async (skillId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`http://localhost:1200/admin/skills/${skillId}/designations`, {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              });
            setDesignationData(response.data);
        } catch (error) {
            console.error('Error fetching designation data:', error);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        if (selectedSkillId) {
            fetchDesignationData(selectedSkillId); 
        }
    }, [selectedSkillId]);

    const labels = designationData.map(item => item.designation);
    const dataCounts = designationData.map(item => item.count);

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                ],
            },
        ],
    };

    return (
        <div className="skills-container">
            {/* Dropdown to select a skill */}
            <select className="skills-dropdown" onChange={(e) => setSelectedSkillId(e.target.value)} value={selectedSkillId}>
                <option value="">Select Skill</option>
                {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                        {skill.name}
                    </option>
                ))}
            </select>

            {/* Render the pie chart if data is available */}
            {designationData.length > 0 && (
                <div className="chart-container">
                    <Pie data={data} />
                </div>
            )}
        </div>
    );
}
