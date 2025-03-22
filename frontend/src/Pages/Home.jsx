import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartApibackend, StartBuildbackend, StartDeployment } from '../Server/Server.js';

function Home() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Connecting to server...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('userStore');
    
    const startServers = async () => {
      if (status === 'Connecting to server...') {
        try {
          const apiResponse = await StartApibackend();
          if (apiResponse) {
            setStatus('Get Started');
            setIsLoading(false);
          }
          StartBuildbackend();
          StartDeployment();
        } catch (err) {
          console.log('An error occurred:', err);
          setStatus('Connection Error');
          setIsLoading(false);
        }
      }
    };
    
    startServers();
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header/Navbar */}
      <header className="bg-white shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-3 cursor-pointer">
            <img 
              src="https://img.icons8.com/?size=100&id=jZHNPYILDZaH&format=png&color=000000" 
              alt="DeployDirect Logo" 
              className="h-9 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800">DeployDirect</h1>
          </div>
          
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition duration-300"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Deploy Your Applications
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl">
          A simple, reliable platform for continuous deployment.
          Build, test, and deploy your code seamlessly with just a few clicks.
        </p>
        <p className="text-gray-600 text-sm mb-6">
          The backend is deployed on Render, so it may take up to 50 seconds to start.
        </p>
        
        <button
          onClick={() => navigate('/login')}
          disabled={isLoading}
          className={`px-8 py-3 text-lg font-semibold rounded-lg shadow-md flex items-center justify-center transition-all transform hover:-translate-y-1 
            ${isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {status}
            </>
          ) : (
            status
          )}
        </button>
      </main>
    </div>
  );
}

export default Home;
