'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import ExperienceList from '@/components/experience/ExperienceList';
import {
  ExperienceFormValues,
  ExperienceWithRelations,
  experienceFormSchema,
} from '@/types/experience';

interface ExperienceFormProps {
  experiences: ExperienceWithRelations[];
  userId: string;
  onUpdate: () => void;
}

export function ExperienceForm({ experiences, userId, onUpdate }: ExperienceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceWithRelations | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      description: '',
      startDate: new Date(),
      isCurrent: false,
      endDate: undefined,
      address: undefined,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/experience', {
        method: selectedExperience ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          id: selectedExperience?.id,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save experience');
      }

      form.reset();
      setSelectedExperience(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to submit experience:', error);
    } finally {
      setIsLoading(false);
    }
  });

  const handleEdit = (experience: ExperienceWithRelations) => {
    setSelectedExperience(experience);
    form.reset({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      description: experience.description,
      startDate: new Date(experience.startDate || new Date()),
      endDate: experience.endDate ? new Date(experience.endDate) : undefined,
      isCurrent: experience.isCurrent,
      address: experience.address ? {
        street: experience.address.street,
        city: experience.address.city,
        state: experience.address.state,
        country: experience.address.country,
        postalCode: experience.address.postalCode,
      } : undefined,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/experience?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }

      onUpdate();
    } catch (error) {
      console.error('Failed to delete experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-md border p-4">
        <h2 className="text-lg font-medium mb-4">
          {selectedExperience ? 'Edit Experience' : 'Add New Experience'}
        </h2>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        disabled={isLoading || form.watch('isCurrent')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isCurrent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Current Position</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-md font-medium">Detailed Address (Optional)</h3>

              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {selectedExperience && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedExperience(null);
                    form.reset();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {selectedExperience ? 'Update' : 'Add'} Experience
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <ExperienceList
        experiences={experiences}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
} 