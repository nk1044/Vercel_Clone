import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { showToast } from '@/components/tools/toast';
import ProjectLayout from '@/components/Layout';
import { Github, ExternalLink, Activity, Clock, CheckCircle, AlertCircle, Zap, Code, Globe } from 'lucide-react';
import { parseUrl } from '@/lib/config/urlParser';

interface ProjectData {
    name: string;
    URL: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface LogData {
    status: string;
    timestamp: string;
    message: string;
}

function Index() {
    const router = useRouter();
    const { name } = router.query;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<string>();
    const [projectUrl, setProjectUrl] = useState<string | null>(null);
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [logsLoading, setLogsLoading] = useState(false);
    const [count, setCount] = useState(0);
    const pollingRef = useRef<boolean>(false);

    // will get a streamed response of logs
    const fetchLogs = async () => {
        if (!name || pollingRef.current) return;
        
        pollingRef.current = true;
        setLogsLoading(true);
        let currentCount = 0;
        let currentStatus = status;

        while (
            currentCount < 10 && 
            currentStatus?.toLowerCase() !== 'completed' && 
            currentStatus?.toLowerCase() !== 'failed' &&
            pollingRef.current
        ) {
            try {
                console.log(count);
                currentCount++;
                setCount(currentCount);
                
                const response = await axios.get(`/api/projects/${name}/logs`);
                const logData: LogData = response.data;
                
                // Add new log message to the array
                setLogs(prev => [...prev, `[${new Date(logData.timestamp).toLocaleTimeString()}] ${logData.message}`]);
                
                // Update status
                currentStatus = logData.status;
                setStatus(currentStatus);
                
                // If status is completed or failed, break the loop
                if (currentStatus.toLowerCase() === 'completed' || currentStatus.toLowerCase() === 'failed') {
                    break;
                }
                
                // Wait 10 seconds before next poll
                await new Promise(resolve => setTimeout(resolve, 10000));
                
            } catch (error) {
                console.error("Error fetching logs:", error);
                showToast('Failed to fetch build logs');
                break; // Stop polling on error
            }
        }
        
        setLogsLoading(false);
        pollingRef.current = false;
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'building':
            case 'deploying':
            case 'downloading':
                return <Activity className="w-5 h-5 text-blue-400 animate-pulse" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'building':
            case 'deploying':
            case 'downloading':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'failed':
                return 'text-red-400 bg-red-400/10 border-red-400/20';
            default:
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    useEffect(() => {
        const fetchProjectData = async () => {
            if (name) {
                try {
                    setLoading(true);
                    const response = await axios.get(`/api/projects?name=${name}`);
                    console.log("Response data:", response.data.project);
                    
                    const projectData = response.data.project as ProjectData;
                    setProjectData(projectData);
                    setStatus(projectData.status);
                    
                    const parsedUrl = parseUrl(name as string);
                    if (parsedUrl) {
                        console.log("Parsed URL:", parsedUrl);
                        setProjectUrl(parsedUrl);
                    }
                    
                    setLoading(false);
                    
                    // Start polling logs if status is not completed or failed
                    if (
                        projectData.status.toLowerCase() !== 'completed' && 
                        projectData.status.toLowerCase() !== 'failed'
                    ) {
                        fetchLogs();
                    }

                } catch (error) {
                    console.error("Error fetching project data:", error);
                    setError('Failed to fetch project data');
                    setLoading(false);
                }
            }
        }
        
        fetchProjectData();
        
        // Cleanup function to stop polling when component unmounts
        return () => {
            pollingRef.current = false;
        };
    }, []);

    return (
        <div className='min-h-screen w-full'>
            {error && (
                <div className="text-red-500 text-center mt-4">
                    <p>{error}</p>  
                </div>
            )}
            <ProjectLayout>
                <div className="w-full min-h-[90%] p-8">
                    {!loading && projectData && status ? (
                        <div className='w-full max-w-5xl mx-auto border border-neutral-800 p-6 rounded-lg shadow-lg'>

                            <div className='flex justify-between items-center mb-6 border-b border-neutral-800 p-6'>
                                <div className="flex items-center gap-3">
                                    <h2 className='text-xl font-semibold'>{projectData.name}</h2>
                                    <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${getStatusColor(status)}`}>
                                        {getStatusIcon(status)}
                                        {status}
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <button
                                        onClick={() => window.open(projectData.URL, '_blank')}
                                        className='text-sm cursor-pointer hover:text-white hover:scale-105 transition-transform hover:bg-neutral-900 p-2 border border-neutral-700 rounded-md flex items-center gap-2' >
                                        <Github className='w-4 h-4' />
                                        Repository
                                    </button>
                                    <button
                                        onClick={() => projectUrl && window.open(projectUrl, '_blank')}
                                        disabled={!projectUrl}
                                        className={`text-sm cursor-pointer hover:scale-105 transition-transform p-2 border border-neutral-700 rounded-md flex items-center gap-2 ${
                                            projectUrl 
                                                ? 'bg-neutral-100 text-neutral-900 hover:text-neutral-950 hover:bg-neutral-300' 
                                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                        }`} >
                                        <ExternalLink className='w-4 h-4' />
                                        Visit
                                    </button>
                                </div>
                            </div>

                            <div className='w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='col-span-1'>
                                    {/* Project Overview Section */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                                                <Zap className="w-5 h-5 text-blue-400" />
                                                Project Overview
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Code className="w-4 h-4 text-purple-400" />
                                                        <span className="text-sm font-medium text-gray-300">Repository</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 truncate">{projectData.URL.split('/').pop()}</p>
                                                </div>

                                                <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Globe className="w-4 h-4 text-green-400" />
                                                        <span className="text-sm font-medium text-gray-300">Deployment</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">
                                                        {status === 'Completed' ? 'Live' : 'Pending'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-neutral-900/50 to-neutral-800/30 p-4 rounded-lg border border-neutral-700">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-medium text-gray-300">Deployment Progress</span>
                                                    <span className="text-xs text-gray-400">
                                                        {status === 'Completed' ? '100%' :
                                                            status === 'Building' ? '60%' :
                                                                status === 'Deploying' ? '85%' :
                                                                    status === 'Downloading' ? '25%' : '0%'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-neutral-800 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${
                                                            status === 'Completed' ? 'bg-green-400 w-full' :
                                                            status === 'Building' ? 'bg-blue-400 w-3/5' :
                                                            status === 'Deploying' ? 'bg-blue-400 w-5/6' :
                                                            status === 'Downloading' ? 'bg-blue-400 w-1/4' :
                                                            status === 'Failed' ? 'bg-red-400 w-1/4' : 'bg-gray-400 w-0'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Build logs section - only show if status is not completed */}
                                        {(status.toLowerCase() !== 'completed' && status.toLowerCase() !== 'failed') && (
                                            <div>
                                                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                                                    <Activity className="w-5 h-5 text-orange-400" />
                                                    Build Logs
                                                    {logsLoading && <Activity className="w-4 h-4 animate-spin text-blue-400" />}
                                                </h3>
                                                <div className="bg-black/50 border border-neutral-800 rounded-lg p-4 h-64 overflow-y-auto">
                                                    {logs.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {logs.map((log, index) => (
                                                                <div key={index} className="text-xs font-mono text-gray-300">
                                                                    <span className="text-gray-500 mr-2">{index + 1}.</span>
                                                                    {log}
                                                                </div>
                                                            ))}
                                                            {logsLoading && (
                                                                <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                                                                    <Activity className="w-3 h-3 animate-spin" />
                                                                    Waiting for next update...
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            {logsLoading ? (
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Activity className="w-4 h-4 animate-spin" />
                                                                    Loading logs...
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-500 text-sm">
                                                                    No logs available yet
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Show final status for completed/failed projects */}
                                        {(status.toLowerCase() === 'completed' || status.toLowerCase() === 'failed') && (
                                            <div>
                                                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                                                    {status.toLowerCase() === 'completed' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                                    )}
                                                    Deployment {status}
                                                </h3>
                                                <div className={`p-4 rounded-lg border ${
                                                    status.toLowerCase() === 'completed' 
                                                        ? 'bg-green-400/10 border-green-400/20 text-green-400' 
                                                        : 'bg-red-400/10 border-red-400/20 text-red-400'
                                                }`}>
                                                    <p className="text-sm">
                                                        {status.toLowerCase() === 'completed' 
                                                            ? 'Your project has been successfully deployed!' 
                                                            : 'Deployment failed. Please check your project configuration and try again.'}
                                                    </p>
                                                    {logs.length > 0 && (
                                                        <details className="mt-3">
                                                            <summary className="cursor-pointer text-xs opacity-75">View build logs</summary>
                                                            <div className="mt-2 p-2 bg-black/30 rounded text-xs font-mono max-h-32 overflow-y-auto">
                                                                {logs.map((log, index) => (
                                                                    <div key={index}>{log}</div>
                                                                ))}
                                                            </div>
                                                        </details>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='col-span-1 border-l border-neutral-800 pl-6'>
                                    <h3 className='text-lg font-semibold mb-4'>Project Details</h3>
                                    <div className="space-y-4">
                                        <div className="bg-neutral-900/30 p-3 rounded-md border border-neutral-800">
                                            <p className='text-sm font-medium text-gray-300 mb-1'>GitHub Repository</p>
                                            <p className='text-xs text-gray-400 break-all'>{projectData.URL}</p>
                                        </div>

                                        <div className="bg-neutral-900/30 p-3 rounded-md border border-neutral-800">
                                            <p className='text-sm font-medium text-gray-300 mb-1'>Deployment URL</p>
                                            <p className='text-xs text-gray-400 break-all'>
                                                {projectUrl || 'Deployment pending...'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="bg-neutral-900/30 p-3 rounded-md border border-neutral-800">
                                                <p className='text-sm font-medium text-gray-300 mb-1'>Created</p>
                                                <p className='text-xs text-gray-400'>
                                                    {new Date(projectData.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>

                                            <div className="bg-neutral-900/30 p-3 rounded-md border border-neutral-800">
                                                <p className='text-sm font-medium text-gray-300 mb-1'>Last Updated</p>
                                                <p className='text-xs text-gray-400'>
                                                    {new Date(projectData.updatedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 w-full h-screen flex justify-center items-center">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 animate-spin" />
                                <p>Loading project data...</p>
                            </div>
                        </div>
                    )}
                </div>
            </ProjectLayout>
        </div>
    )
}

export default Index;