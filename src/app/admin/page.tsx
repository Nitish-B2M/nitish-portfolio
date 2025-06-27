'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaBriefcase, FaFolder, FaEnvelope } from 'react-icons/fa';
import Loading from './loading';

interface Profile {
  name: string | null;
  email: string;
  _count: {
    projects: number;
    experiences: number;
    skills: number;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function AdminDashboard() {
  // get the total number of projects, experience, messages, profile views
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfile(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {

    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // loading
  const [loading, setLoading] = useState(true);

  const STATS = [
    {
      label: 'Total Projects',
      value: profile?._count.projects,
      icon: FaFolder,
      color: 'bg-blue-500/30 text-blue-700',
    },
    {
      label: 'Experience Years',
      value: profile?._count.experiences,
      icon: FaBriefcase,
      color: 'bg-green-500/30 text-green-700',
    },
    {
      label: 'Messages',
      value: profile?._count.skills,
      icon: FaEnvelope,
      color: 'bg-purple-500/30 text-purple-700',
    },
    // {
    //   label: 'Profile Views',
    //   value: profile?._count.profileViews,
    //   icon: FaEye,
    //   color: 'bg-sky-500/30 text-sky-700',
    // },
  ];

  if (loading) return <Loading className="min-h-screen" childClassName="h-12 w-12" />;

  return (
    <div className="space-y-8 pl-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-100">Dashboard</h1>
        <p className="text-primary-800">Welcome back, <br className='md:hidden' /> <b className='text-primary-900'>{profile?.name || 'Admin'}</b></p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl bg-primary-900/20 border border-primary-200"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className={`text-xl`} />
              </div>
              <div>
                <p className="text-sm text-primary-100">{stat.label}</p>
                <p className="text-2xl font-semibold text-primary-100">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="p-6 rounded-xl bg-primary-800/40 border border-primary-800/50">
          <h2 className="text-xl font-semibold mb-4 text-primary-100">Recent Projects</h2>
          <div className="space-y-4">
            {projects.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-4 hover:rounded-lg bg-primary-950/50 hover:bg-primary-600/30 transition-colors border-b border-primary-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-900/10 rounded-lg">
                    <FaFolder className="text-primary-100" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-200">{i.title}</p>
                    <p className="text-sm text-primary-900">{new Date(i.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Link href={`/admin/projects/${i.id}`} className="text-sm text-primary-100 hover:text-primary-900 transition-all duration-300 hover:bg-primary-100/50 rounded-lg p-2 cursor-pointer">View</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="p-6 rounded-xl bg-primary-800/40 border border-primary-800/50">
          <h2 className="text-xl font-semibold mb-4 text-primary-100">Recent Messages</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 hover:rounded-lg bg-primary-950/50 hover:bg-primary-600/30 transition-colors border-b border-primary-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-900/10 rounded-lg">
                    <FaEnvelope className="text-primary-100" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-200">Contact Request {i}</p>
                    <p className="text-sm text-primary-900">1 day ago</p>
                  </div>
                </div>
                <span className="text-sm text-primary-100 hover:text-primary-900 transition-all duration-300 hover:bg-primary-100/50 rounded-lg p-2 cursor-pointer">Read</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 