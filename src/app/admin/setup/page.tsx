'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Admin',
    email: 'nitishxsharma08@gmail.com',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin user');
      }

      router.push('/auth/signin');
    } catch (error) {
      console.error('Setup error:', error);
      alert('Failed to create admin user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900/20">
      <div className="max-w-md w-full space-y-8 p-8 bg-primary-800/50 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-primary-100">
            Admin Setup
          </h2>
          <p className="mt-2 text-center text-primary-200">
            Create your admin account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-primary-100">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-primary-600 bg-primary-800/50 text-primary-100 p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-primary-100">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border-primary-600 bg-primary-800/50 text-primary-100 p-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-primary-100">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border-primary-600 bg-primary-800/50 text-primary-100 p-2"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-50 bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Admin Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 