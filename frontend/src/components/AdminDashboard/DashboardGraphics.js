//C:\Users\AnanyaSarkar\project\webapp\frontend\src\components\AdminDashboard\DashboardGraphics.js
import React from 'react';
import CourseCompletionChart from './Charts/CourseCompletionChart'; 
import PopulationByDesignation from './Charts/PopulationCountByDesignation';
import SkillsByDesignation from './Charts/SkillsByDesignation';
const DashboardGraphics = () => {
  return (
    <div>
      <h2>Employee Course Completion Status</h2>
      <CourseCompletionChart />
      <PopulationByDesignation />
      <SkillsByDesignation/>
    </div>
  );
};

export default DashboardGraphics;
