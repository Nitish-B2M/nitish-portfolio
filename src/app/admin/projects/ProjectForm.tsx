'use client';

import { useState, useEffect } from 'react';
import { Project, Category, Status } from '@/types/project';
import { ProjectImage } from '@/types/entity';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/button';

interface ProjectFormProps {
  userId: string;
  onProjectAdded?: () => void;
  project?: Project | null;
  onCancel?: () => void;
}

export default function ProjectForm({ userId, onProjectAdded, project, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    images: [] as ProjectImage[],
    category: 'FULLSTACK' as keyof typeof Category,
    status: 'DRAFT' as keyof typeof Status,
    skills: '',
    technologies: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        images: project.images || [],
        category: project.category as keyof typeof Category,
        status: project.status as keyof typeof Status,
        skills: project.skills.map((s) => s.skill.name).join(', ') || '',
        technologies: project.technologies.map((t) => t.technology.name).join(', ') || ''
      });
    }
  }, [project]);

  const handleImageUpload = (url: string) => {
    // Create a dummy File object since we're using Cloudinary URLs now
    const dummyFile = new File([""], "cloudinary-image", { type: "image/jpeg" });

    // For debugging
    console.log('ProjectForm received upload URL:', url);

    const newImage: ProjectImage = {
      id: '',
      url: url,
      image: dummyFile,
      name: `project-image-${formData.images.length + 1}`,
      projectId: project?.id || '',
      project: project || null,
      caption: '',
      order: formData.images.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit');
    e.preventDefault();
    setIsSubmitting(true);
    const skillNames = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const technologyNames = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title,
      description: formData.description,
      githubUrl: formData.githubUrl || null,
      demoUrl: formData.demoUrl || null,
      category: formData.category,
      status: formData.status,
      userId,
      images: formData.images.map((img, i) => ({
        url: img.url,
        caption: img.caption || '',
        order: i
      })),
      skills: skillNames,
      technologies: technologyNames
    };

    try {
      let response;
      if (project) {
        response = await fetch(`/api/projects/${project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!response.ok) throw new Error();

      setFormData({
        title: '',
        description: '',
        githubUrl: '',
        demoUrl: '',
        images: [],
        category: 'FULLSTACK',
        status: 'DRAFT',
        skills: '',
        technologies: ''
      });

      onProjectAdded?.();
      if (onCancel) onCancel();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${project ? 'update' : 'create'} project. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 w-full">
      {/* Title */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="title" className="text-sm font-medium text-primary-100">Title <span className="text-red-500">*</span></label>
        <input
          id="title"
          type="text"
          required
          placeholder="Enter project title"
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="description" className="text-sm font-medium text-primary-100">Description</label>
        <textarea
          id="description"
          rows={3}
          placeholder="Enter project description"
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Images Section */}
      <div className="flex flex-col gap-4 w-full">
        <label className="text-sm font-medium text-primary-100">Project Images</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group border p-2 rounded-lg overflow-hidden">
              <CloudinaryImage
                src={image.url}
                alt={`Project image ${index + 1}`}
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-[200px]"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          {formData.images.length < 5 && (
            <div className="flex flex-col gap-2 border p-2 rounded-lg overflow-hidden">
            <ImageUpload
              onUpload={handleImageUpload}
              folder={`projects/${formData.title.toLowerCase().replace(/\s+/g, '-')}`}
              caption={formData.title}
            />
            </div>
          )}
        </div>
      </div>

      {/* GitHub */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="githubUrl" className="text-sm font-medium text-primary-100">GitHub URL</label>
        <input
          id="githubUrl"
          type="url"
          placeholder="Enter GitHub URL"
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
        />
      </div>

      {/* Demo */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="demoUrl" className="text-sm font-medium text-primary-100">Demo URL</label>
        <input
          id="demoUrl"
          type="url"
          placeholder="Enter demo URL"
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.demoUrl}
          onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="category" className="text-sm font-medium text-primary-100">Category <span className="text-red-500">*</span></label>
        <select
          id="category"
          required
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value as keyof typeof Category })
          }
        >
          {Object.keys(Category).map((key) => (
            <option key={key} value={key}>
              {key[0] + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="status" className="text-sm font-medium text-primary-100">Status <span className="text-red-500">*</span></label>
        <select
          id="status"
          required
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as keyof typeof Status })
          }
        >
          {Object.keys(Status).map((key) => (
            <option key={key} value={key} className="text-primary-100">
              {key[0] + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="skills" className="text-sm font-medium text-primary-100">Skills (comma separated)</label>
        <input
          id="skills"
          type="text"
          placeholder="Enter skills (comma separated)"
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
        />
      </div>

      {/* Technologies */}
      <div className="flex flex-col gap-2 w-full md:w-[48%]">
        <label htmlFor="technologies" className="text-sm font-medium text-primary-100">Technologies (comma separated)</label>
        <input
          id="technologies"
          type="text"
          placeholder="Enter technologies (comma separated)"
          className="mt-1 block w-full rounded-md border-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-800/50 p-2 text-primary-100 input outline-none placeholder:text-primary-200/40"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 w-full mt-4">
        {project && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${project ? 'btn-primary' : 'btn-secondary'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
