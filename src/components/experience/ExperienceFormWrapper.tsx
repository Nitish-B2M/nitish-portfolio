'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExperienceForm } from '@/components/forms/ExperienceForm';
import { ExperienceWithRelations } from '@/types/experience';

interface ExperienceFormWrapperProps {
  initialExperiences: ExperienceWithRelations[];
  userId: string;
}

export function ExperienceFormWrapper({ initialExperiences, userId }: ExperienceFormWrapperProps) {
  const [experiences, setExperiences] = useState<ExperienceWithRelations[]>(initialExperiences);
  const router = useRouter();

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <ExperienceForm
      experiences={experiences}
      userId={userId}
      onUpdate={handleUpdate}
    />
  );
} 