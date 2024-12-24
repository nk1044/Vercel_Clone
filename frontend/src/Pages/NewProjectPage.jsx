import React, { useState, useEffect } from 'react';
import { CreateProject, GetProjects, getProjectStatus, StartDeployment } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';

function NewProjectPage() {
  const [gitUrl, setgitUrl] = useState("");
  const [projectId, setprojectId] = useState("");
  const setProjectUrls = useUser((state) => state.setProjectUrls);
  const [newPr, setNewPr] = useState(false);
  const [PrCompleted, setPrCompleted] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [newProjectId, setnewProjectId] = useState("");
  const deploymentUri = String(import.meta.env.VITE_DEPLOYMENT_URI);


  const fetchProjects = async () => {
    try {
      const projects = await GetProjects();
      // console.log("All projects after adding new one: ", projects);
      if (projects) {
        const sortedProjects = [...projects].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setProjectUrls(sortedProjects);
      }
      // console.log("Project Id: ", project_Id);

    } catch (error) {
      console.error("Failed to fetch projects: ", error);
    }
  };


  const UpdateProjectStatus = async (id) => {

    setTimeout(async () => {
      const res = await getProjectStatus({ projectId: id });
      // console.log("status response: ", res);
      setStatus(res);
      if (res === "Completed") {
        setStatus("Completed");
        setPrCompleted(true);
        fetchProjects();
        return;
      } else {
        UpdateProjectStatus(id);
      }
    }, 1000);
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gitUrl.trim()) {
      console.error("GitHub URL is required.");
      return;
    }
    try {
      const project = { gitUrl, projectId };
      const newProject = await CreateProject(project);
      setnewProjectId(newProject.name);
      StartDeployment();
      if (newProject) {
        console.log("Project created in page: ", newProject);
        setNewPr(true);
        setStatus(newProject.status);
        UpdateProjectStatus(newProject._id);
      } else {
        console.error("Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-50">
      <div className="border shadow-lg bg-white p-6 rounded-lg flex flex-col gap-6 w-full max-w-md">
        {newPr ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Project Created</h1>
            {PrCompleted ? (
              <div className='flex flex-col gap-4 w-full'>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <a
                  href={`http://${newProjectId}.${deploymentUri}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                </a>
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => {
                    setNewPr(false);
                    setPrCompleted(false);
                    setStatus("Pending");
                  }}
                >
                  Create New Project
                </button>

              </div>
            ) : (
              <div className="flex justify-center items-center gap-4 font-semibold text-lg">
                <span>Status: {status}</span>
              </div>
            )}
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Create New Project</h1>
            <input
              type="text"
              placeholder="Paste GitHub URL"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setgitUrl(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Project Name (optional)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setprojectId(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default NewProjectPage;
