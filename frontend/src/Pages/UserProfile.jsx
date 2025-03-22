import React, { useState } from 'react';
import Project_SubPage from './Project_SubPage';
import NewProjectPage from './NewProjectPage';
import { logoutUser , StartApibackend} from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';
import { useNavigate } from 'react-router-dom';


function UserProfile() {
  const [Right, setRight] = useState('Project');
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const setProjectUrls = useUser((state) => state.setProjectUrls);
  const [log_out_status, setlog_out_status] = useState('Logout')
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setlog_out_status('Logging Out...')
      await logoutUser();
      setUser(null);
      localStorage.removeItem('userStore');
      setProjectUrls([]);
      navigate('/');
    } catch (error) {
      console.log('Failed to logout user in UserProfile: ', error);
    }
  };


  return (
    <div className="bg-gray-100 w-full min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-300 w-full h-[8vh] flex justify-between items-center px-4">
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://img.icons8.com/?size=100&id=jZHNPYILDZaH&format=png&color=000000"
            alt="logo1"
            className="h-8"
          />
          <h2 className="text-2xl font-extrabold text-gray-800 sm:block hidden">DeployDirect</h2>
        </div>
        <div className="flex items-center gap-4">
          
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
            onClick={logout}
          >
            {log_out_status}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="w-full h-[92vh] grid grid-cols-10 grid-rows-12 gap-2 p-4 rounded-lg">
        {/* Left Side */}
        <div className="col-span-10 sm:col-span-3 sm:row-span-12 row-span-2 bg-white shadow-md rounded-lg p-4 border">
          <div className="flex sm:flex-col gap-4 sm:gap-2 justify-around">
            <button
              onClick={() => setRight('Project')}
              className={`py-2 px-4 rounded-lg text-gray-800 font-semibold ${Right === 'Project'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
                }`}
            >
              Projects
            </button>
            <button
              onClick={() => setRight('NewProject')}
              className={`py-2 px-4 rounded-lg text-gray-800 font-semibold ${Right === 'NewProject'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
                }`}
            >
              New Project
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-10 sm:col-span-7 sm:row-span-12 row-span-10  bg-white shadow-lg rounded-lg p-2 border">
          {Right === 'Project' ? <Project_SubPage /> : <NewProjectPage />}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
