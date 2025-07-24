import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectLayout from "@/components/Layout";
import { showToast } from "@/components/tools/toast";
import axios from 'axios';
import { useSession } from "next-auth/react";
import {Github, Link, CircleSmall, Plus} from 'lucide-react';
import { parseUrl } from '@/lib/config/urlParser';

interface Project {
    _id: string;
    name: string;
    URL: string;
    status: string;
    createdAt: string;
}

function ProjectsPage() {
    const router = useRouter();
    const {status } = useSession();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/auth');
        }
    }, [status, router]);
    useEffect(() => {
        if (status !== 'authenticated') return;
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/projects');
                const data = await response.data;
                console.log("Fetched projects:", data.projects);
                if (!response.status || !data.projects) {
                    throw new Error('Failed to fetch projects');
                }

                setProjects(data.projects);
                showToast('✅ Projects fetched successfully!');
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
                setError(msg);
                showToast(`❌ ${msg}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [status]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Show loading while checking session
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Checking authentication...
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <ProjectLayout>
                <div className="w-full min-h-[90%] p-8">
                    <div className="flex justify-between items-center mb-8 mx-auto max-w-[80%]">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                            <p className="text-gray-400">Manage and monitor your deployed projects</p>
                        </div>
                        <button
                            onClick={() => router.push('/projects/newProject')}
                            className="px-6 py-3 bg-neutral-800 flex gap-2 cursor-pointer text-white rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
                        >
                            <Plus/> Create New Project
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64 text-gray-400">
                            Loading projects...
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-64 text-red-400">
                            {error}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64 text-gray-400">
                            <div className="text-xl mb-2">No projects found</div>
                            <div>Create your first project to get started</div>
                        </div>
                    ) : (
                        <div className="space-y-4 flex flex-col items-center">
                            {projects.map((project, index) => (
                                <div
                                    key={project._id || index}
                                    className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 hover:bg-gray-750 transition-colors min-w-[80%]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-6">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-xl flex items-center gap-2 cursor-pointer font-semibold text-white mb-1"
                                                        onClick={() => router.push(`/projects/${project.name}`)}>
                                                        <CircleSmall/> {project.name || 'Untitled Project'}
                                                    </h3>
                                                    <div className="flex items-center gap-4 pl-1 text-sm">
                                                        <a
                                                            href={`http://${parseUrl(project.name)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1"
                                                        >
                                                            <Link className="w-4"/> {parseUrl(project.name)}
                                                        </a>
                                                        <a
                                                            href={project.URL}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                                                        >
                                                            <Github className="w-4"/> GitHub
                                                        </a>
                                                        <span className="text-gray-400">
                                                            Created {formatDate(project.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            project.status === 'Completed'
                                                                ? 'bg-green-900 text-green-300'
                                                                : project.status === 'Failed'
                                                                ? 'bg-red-900 text-red-300'
                                                                : project.status === 'Deploying'
                                                                ? 'bg-yellow-900 text-yellow-300'
                                                                : project.status === 'Building'
                                                                ? 'bg-orange-900 text-orange-300'
                                                                : project.status === 'Downloading'
                                                                ? 'bg-purple-900 text-purple-300'
                                                                : 'bg-gray-700 text-gray-300'
                                                        }`}
                                                    >
                                                        {project.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ProjectLayout>
        </div>
    );
}

export default ProjectsPage;
