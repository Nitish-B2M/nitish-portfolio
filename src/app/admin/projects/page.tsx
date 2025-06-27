'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ProjectForm from './ProjectForm';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Project } from '@/types/project';
import Loading from '../loading';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    if (status === 'authenticated' && session?.user) {
      fetchProjects();
    }
  }, [status, session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <Loading className="min-h-screen" childClassName="h-12 w-12" />;
  }

  return (
    <div className="min-h-screen p-2 md:p-6 py-0">
      <div className="max-w-full md:max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-100">Manage Projects</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-primary-50 rounded-md hover:bg-primary-500 transition-colors"
            >
              <FaPlus className="text-sm" />
              Add Project
            </button>
          </div>
          
          {/* Project Form */}
          {showForm && (
            <div className="bg-primary-800/50 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-primary-100">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <ProjectForm 
                userId={session?.user?.id || ''} 
                onProjectAdded={() => {
                  fetchProjects();
                  handleFormClose();
                }}
                project={editingProject || undefined}
                onCancel={handleFormClose}
              />
            </div>
          )}

          {/* Projects Table */}
          <div className="bg-primary-800/50 rounded-lg shadow overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-700">
              <thead className="bg-primary-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {projects.map((project) => (
                  <tr key={project.id} className="bg-primary-700/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-100">{project.title}</div>
                      <div className="text-sm text-primary-200">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 p-1 font-semibold rounded-full bg-primary-100/20 text-primary-100">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 p-1 font-semibold rounded-full ${
                        project.status === 'PUBLISHED' 
                          ? 'bg-green-600/20 text-green-100' 
                          : project.status === 'ARCHIVED'
                          ? 'bg-red-600/20 text-red-100'
                          : 'bg-primary-600/20 text-primary-100'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-200">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-200">
                      {formatDate(project.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-primary-200 hover:text-primary-100 mr-4"
                      >
                        <FaEdit className="inline-block" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-primary-100 hover:text-primary-100"
                      >
                        <FaTrash className="inline-block" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 