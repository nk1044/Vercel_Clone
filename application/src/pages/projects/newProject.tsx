import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { showToast } from '@/components/tools/toast';
import ProjectLayout from '@/components/Layout';

function NewProjectPage() {
  const router = useRouter();
  const {status } = useSession();

  const [gitUrl, setGitUrl] = useState('');
  const [projectId, setProjectId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('/api/projects', {
        gitUrl,
        projectId: projectId || undefined,
      });

      showToast('Project created successfully!');
      console.log('Project created:', response.data);
      const projectName = response.data.name;
      router.push(`/projects/${projectName}`);

    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = error.response?.data?.error || error.message || 'Something went wrong';
      showToast(`Error: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          <span className="text-white text-lg">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProjectLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-12">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white mb-2">Create Project</h1>
              <p className="text-neutral-400 text-sm">Start building something amazing</p>
            </div>

            {/* Form Card */}
            <div className="bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 bg-opacity-80 border border-neutral-800 rounded-2xl p-10 shadow-2xl backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Git URL Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300" htmlFor="gitUrl">
                    Repository URL
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="url"
                    id="gitUrl"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder-neutral-500"
                    placeholder="https://github.com/username/repository"
                  />
                </div>

                {/* Project ID Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300" htmlFor="projectId">
                    Project ID <span className="text-neutral-500 text-xs ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="projectId"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder-neutral-500"
                    placeholder="custom-project-name"
                  />
                  <p className="text-xs text-neutral-500">Leave empty to auto-generate</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full relative overflow-hidden cursor-pointer px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className={`transition-opacity duration-200 ${submitting ? 'opacity-0' : 'opacity-100'}`}>
                      Create Project
                    </span>
                    {submitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                          <span>Creating...</span>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-neutral-500 text-xs">
                Make sure your repository is accessible
              </p>
            </div>
          </div>
        </div>
      </ProjectLayout>
    </div>
  );
}

export default NewProjectPage;
