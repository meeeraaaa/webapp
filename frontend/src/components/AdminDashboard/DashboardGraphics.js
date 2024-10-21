import React from 'react';
import CourseCompletionChart from './Charts/CourseCompletionChart'; 
import PopulationByDesignation from './Charts/PopulationCountByDesignation';
import SkillsByDesignation from './Charts/SkillsByDesignation';
import CourseDifficultyChart from './Charts/CourseDifficulty';

const DashboardGraphics = () => {
  return (
    <div>
      <h2>Employee Course Completion Status</h2>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-6">
            <CourseCompletionChart />
          </div>
          <div className="col-12 col-lg-6">
            <PopulationByDesignation />
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-lg-6">
            <SkillsByDesignation />
          </div>
          <div className="col-12 col-lg-6">
            <CourseDifficultyChart /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraphics;
