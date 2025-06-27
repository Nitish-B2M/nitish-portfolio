'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ExperienceForm from './ExperienceForm';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Loading from '../loading';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  } | null;
}

export default function ExperiencePage() {
  const { data: session, status } = useSession();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    if (status === 'authenticated' && session?.user) {
      fetchExperiences();
    }
  }, [status, session]);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience');
      if (!response.ok) throw new Error('Failed to fetch experiences');
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }

      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience. Please try again.');
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingExperience(null);
    setShowForm(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (isLoading) {
    return <Loading className="min-h-screen" childClassName="h-12 w-12" />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-50">Manage Experience</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-primary-50 rounded-md hover:bg-primary-500 transition-colors"
            >
              <FaPlus className="text-sm" />
              Add Experience
            </button>
          </div>
          
          {/* Experience Form */}
          {showForm && (
            <div className="bg-primary-800/50 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-primary-100">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <ExperienceForm 
                userId={session?.user?.id || ''} 
                onExperienceAdded={() => {
                  fetchExperiences();
                  handleFormClose();
                }}
                experience={editingExperience}
                onCancel={handleFormClose}
              />
            </div>
          )}

          {/* Experiences Table */}
          <div className="bg-primary-800/50 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-primary-700">
              <thead className="bg-primary-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-primary-100 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {experiences.map((experience) => (
                  <tr key={experience.id} className="hover:bg-primary-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-100">{experience.title}</div>
                      <div className="text-sm text-primary-200">{experience.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-100">
                      {experience.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-100">
                      {experience.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-200">
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-200">
                      {new Date(experience.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(experience)}
                        className="text-primary-300 hover:text-primary-100 mr-4"
                      >
                        <FaEdit className="inline-block" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(experience.id)}
                        className="text-red-400 hover:text-red-300"
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