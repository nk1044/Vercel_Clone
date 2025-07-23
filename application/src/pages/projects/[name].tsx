import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { showToast } from '@/components/tools/toast';
import ProjectLayout from '@/components/Layout';

function index() {
    const router = useRouter();
    const { name } = router.query;

    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (name) {
                try {
                    // const response = await axios.get(`/api/projects/${name}`);
                    // setProjectData(response.data);
                    console.log("Fetching project data for:", name);
                    
                } catch (error) {
                    console.error("Error fetching project data:", error);
                }
            }
        }
        fetchProjectData();
    }, [name]);
  return (
    <div className='min-h-screen w-full'>
        <ProjectLayout>
            <div className="w-full min-h-[90%] p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Project: {name}</h1>
                {projectData ? (
                    <div className="text-white">
                        {/* Render project details here */}
                        <p>Project Name: {name}</p>
                        {/* Add more project details as needed */}
                    </div>
                ) : (
                    <p className="text-gray-400">Loading project data...</p>
                )}
            </div>
        </ProjectLayout>
    </div>
  )
}

export default index;