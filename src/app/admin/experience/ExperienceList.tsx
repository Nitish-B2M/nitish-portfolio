'use client';

interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  } | null;
  skills: Array<{
    skillId: string;
    skill: {
      name: string;
    };
  }>;
  technologies: Array<{
    techId: string;
    technology: {
      name: string;
    };
  }>;
}

interface ExperienceListProps {
  experiences: Experience[];
  onExperienceDeleted?: () => void;
}

export default function ExperienceList({ experiences, onExperienceDeleted }: ExperienceListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }

      // Call the callback if provided
      onExperienceDeleted?.();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {experiences.map((experience) => (
        <div key={experience.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{experience.title}</h3>
              <p className="text-gray-600">{experience.company}</p>
              <p className="text-sm text-gray-500">
                {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : experience.endDate ? formatDate(experience.endDate) : ''}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDelete(experience.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>

          {experience.description && (
            <p className="mt-4 text-gray-700">{experience.description}</p>
          )}

          {experience.address && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Location</h4>
              <p className="text-gray-600">
                {[
                  experience.address.street,
                  experience.address.city,
                  experience.address.state,
                  experience.address.country
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          )}

            <div>
              <h4 className="font-medium text-gray-700">Technologies</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                  <span
                    key={tech.techId}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tech.technology.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Skills</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                  <span
                    key={skill.skillId}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill.skill.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 