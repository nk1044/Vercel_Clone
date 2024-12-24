import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { GetProjects } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';

function Project_SubPage() {
  const project_urls = useUser((state) => state.project_urls);
  const [Projects, setProjects] = useState(project_urls);
  const setProjectUrls = useUser((state) => state.setProjectUrls);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await GetProjects();
        // console.log("all projects: ", projects);
        if (projects) {
          const sortedProjects = [...projects].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setProjectUrls(sortedProjects);
          setProjects(sortedProjects);
        }
      } catch (error) {
        console.log("Failed to fetch projects: ", error);
      }
    };

    if (project_urls.length === 0) {
      fetchProjects();
    }
  }, []);

  return (
    <div className='w-full h-full flex justify-center bg-gray-100'>
      <div className='w-full max-w-4xl bg-white rounded-lg shadow-lg p-3 overflow-auto'>
        <h1 className='text-2xl font-bold mb-4 text-center text-gray-700'>Your Projects</h1>
        <ul className='space-y-4'>
          {Array.isArray(Projects) && Projects.length > 0 ? (
            Projects.map((project) => (
              <li key={project._id} className=''>
                <ProjectCard project={project} />
              </li>
            ))
          ) : (
            <p className='text-center text-gray-500'>No projects available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Project_SubPage;
