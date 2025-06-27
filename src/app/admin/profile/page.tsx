'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Loading from '../loading';
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from 'react-icons/fa';

interface Profile {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    projects: number;
    experiences: number;
    skills: number;
  };
  profile: {
    bio: string;
    website: string;
    twitter: string;
    github: string;
    linkedin: string;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    phone: '',
    profile: {
      bio: '',
      website: '',
      twitter: '',
      github: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  if (status === "loading") {
    return <Loading className="min-h-screen" childClassName="h-12 w-12" />;
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        imageUrl: data.imageUrl || '',
        phone: data.phone || '',
        profile: {
          bio: data.profile?.bio || '',
          website: data.profile?.website || '',
          twitter: data.profile?.twitter || '',
          github: data.profile?.github || '',
          linkedin: data.profile?.linkedin || ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  }

  if (!profile) return <Loading className="min-h-screen" childClassName="h-12 w-12" />;

  return (
    <div className="min-h-screen p-2 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary-800/50 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary-50">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-primary-50 bg-primary-600 rounded-md hover:bg-primary-500"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-100">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100">Profile Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100">Bio</label>
                <textarea
                  value={formData.profile.bio}
                  onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, bio: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100">Website</label>
                <input
                  type="text"
                  value={formData.profile.website}
                  onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, website: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100">Twitter</label>
                <input
                  type="text"
                  value={formData.profile.twitter}
                  onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, twitter: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100">Github</label>
                <input
                  type="text"
                  value={formData.profile.github}
                  onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, github: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100">Linkedin</label>
                <input
                  type="text"
                  value={formData.profile.linkedin}
                  onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, linkedin: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-50 bg-primary-600 rounded-md hover:bg-primary-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                {profile.imageUrl && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden z-10">
                    <Image
                      src={profile.imageUrl}
                      alt={profile.name || 'Profile'}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-semibold text-primary-100">{profile.name}</h2>
                  <p className="text-primary-200">{profile.email}</p>
                  <p className="text-sm text-primary-200">Role: {profile.role}</p>
                </div>
              </div>

              { profile.profile?.bio && (
                <div className="mt-6">
                  <p className="text-sm text-primary-200">
                    {profile.profile?.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-primary-700/50 p-4 rounded-lg flex items-center justify-between md:flex-col md:items-start md:justify-center gap-2">
                  <h3 className="font-medium text-primary-100">Projects</h3>
                  <p className="text-2xl font-bold text-primary-300">{profile._count.projects}</p>
                </div>
                <div className="bg-primary-700/50 p-4 rounded-lg flex items-center justify-between md:flex-col md:items-start md:justify-center gap-2">
                  <h3 className="font-medium text-primary-100">Experience</h3>
                  <p className="text-2xl font-bold text-primary-300">{profile._count.experiences}</p>
                </div>
                <div className="bg-primary-700/50 p-4 rounded-lg flex items-center justify-between md:flex-col md:items-start md:justify-center gap-2">
                  <h3 className="font-medium text-primary-100">Skills</h3>
                  <p className="text-2xl font-bold text-primary-300">{profile._count.skills}</p>
                </div>
              </div>

              {/* social links */}
              <div className="mt-6">
                <h3 className="font-medium text-primary-100 text-md">Social Links</h3>
                <p className="text-sm text-primary-200 flex items-center gap-2 mt-1">
                  {profile.profile?.twitter ? <a href={profile.profile?.twitter} target="_blank" rel="noopener noreferrer" className="text-primary-200 flex items-center gap-2"><FaTwitter className='text-md' /> <span className='!text-md'>Twitter</span></a> : null}
                  {profile.profile?.github ? <a href={profile.profile?.github} target="_blank" rel="noopener noreferrer" className="text-primary-200 flex items-center gap-2"><FaGithub className='text-md' /> <span className='!text-md'>Github</span></a> : null}
                  {profile.profile?.linkedin ? <a href={profile.profile?.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-200 flex items-center gap-2"><FaLinkedin className='text-md' /> <span className='!text-md'>Linkedin</span></a> : null}
                  {profile.profile?.website ? <a href={profile.profile?.website} target="_blank" rel="noopener noreferrer" className="text-primary-200 flex items-center gap-2"><FaGlobe className='text-md' /> <span className='!text-md'>Website</span></a> : null}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-primary-100">Account Details</h3>
                <p className="text-sm text-primary-200">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                  <br />
                  Last updated {new Date(profile.updatedAt).toLocaleDateString()} {new Date(profile.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 