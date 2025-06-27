'use client';

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "../loading";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <Loading className="min-h-screen" childClassName="h-12 w-12" />;
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary-50">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Section */}
          <Link href="/admin/projects" 
            className="bg-primary-800/50 p-6 rounded-lg shadow-md hover:bg-primary-700/50 transition-all">
            <h2 className="text-xl font-semibold mb-2 text-primary-100">Projects</h2>
            <p className="text-primary-200">Manage your portfolio projects</p>
          </Link>

          {/* Experience Section */}
          <Link href="/admin/experience" 
            className="bg-primary-800/50 p-6 rounded-lg shadow-md hover:bg-primary-700/50 transition-all">
            <h2 className="text-xl font-semibold mb-2 text-primary-100">Experience</h2>
            <p className="text-primary-200">Manage your work experience</p>
          </Link>

          {/* Skills Section */}
          <Link href="/admin/skills" 
            className="bg-primary-800/50 p-6 rounded-lg shadow-md hover:bg-primary-700/50 transition-all">
            <h2 className="text-xl font-semibold mb-2 text-primary-100">Skills</h2>
            <p className="text-primary-200">Manage your skills and technologies</p>
          </Link>

          {/* Technologies Section */}
          <Link href="/admin/technologies" 
            className="bg-primary-800/50 p-6 rounded-lg shadow-md hover:bg-primary-700/50 transition-all">
            <h2 className="text-xl font-semibold mb-2 text-primary-100">Technologies</h2>
            <p className="text-primary-200">Manage your technology stack</p>
          </Link>

          {/* Profile Section */}
          <Link href="/admin/profile" 
            className="bg-primary-800/50 p-6 rounded-lg shadow-md hover:bg-primary-700/50 transition-all">
            <h2 className="text-xl font-semibold mb-2 text-primary-100">Profile</h2>
            <p className="text-primary-200">Update your profile information</p>
          </Link>

          {/* Messages Section */}
          <Link href="/admin/messages" 
            className="bg-primary-800/50 p-6 rounded-lg shadow-md hover:bg-primary-700/50 transition-all">
            <h2 className="text-xl font-semibold mb-2 text-primary-100">Messages</h2>
            <p className="text-primary-200">View contact form messages</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 