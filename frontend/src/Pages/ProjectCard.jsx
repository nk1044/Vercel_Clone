import React from 'react';

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${formattedDate} ${formattedTime}`;
}



function ProjectCard({ project }) {
  const date = formatDateTime(project?.createdAt);
  const name = String(project?.name).replaceAll('_', ' ') || 'Project Name';
  const deploymentUri = String(import.meta.env.VITE_DEPLOYMENT_URI);

  return (
    <div className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-2 truncate">{name}</h1>
      <p className="text-sm text-gray-500 truncate">
        {date ? `Created at: ${date}` : 'Description of the project'}
      </p>
      <p className="text-sm text-gray-500 truncate">
        {project?.URL ? `GitHub URL: ${project?.URL}` : 'GitHub URL'}
      </p>
      <p className="text-sm text-gray-500 truncate">
        {project?.status ? `Current Status: ${project?.status}` : 'Pending'}
      </p>
      <div className="flex justify-between items-center mt-4">
        <button
          className={`${project?.status === "Completed" ? "cursor-pointer" : "cursor-not-allowed"} bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300`}
          disabled={project?.status !== "Completed"}>
          <a
            href={`http://${project?.name}.${deploymentUri}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </button>

      </div>
    </div>
  );
}

export default ProjectCard;
