import { ExperienceWithRelations } from '@/types/experience';
import { Button } from '@/components/ui/button';

interface ExperienceListProps {
  experiences: ExperienceWithRelations[];
  onEdit: (experience: ExperienceWithRelations) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function ExperienceList({ experiences, onEdit, onDelete, isLoading }: ExperienceListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Experiences</h2>
      {experiences.length === 0 ? (
        <p className="text-gray-500">No experiences added yet.</p>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="rounded-md border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{experience.title}</h3>
                  <p className="text-gray-500">{experience.company}</p>
                  <p className="text-sm text-gray-500">
                    {experience.startDate ? new Date(experience.startDate).toLocaleDateString() : ''} - {' '}
                    {experience.isCurrent ? 'Present' : experience.endDate ? new Date(experience.endDate).toLocaleDateString() : ''}
                  </p>
                  <p className="mt-2">{experience.description}</p>
                  {experience.address && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{experience.address.street}</p>
                      <p>{experience.address.city}, {experience.address.state} {experience.address.postalCode}</p>
                      <p>{experience.address.country}</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(experience)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(experience.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}