import React from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';

interface RoastLogFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const RoastLogForm: React.FC<RoastLogFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const { register, handleSubmit } = useForm({ defaultValues: initialData });
  const { data: profiles } = trpc.roastProfile.getAll.useQuery();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="date" {...register('date')} required />
      <input
        type="text"
        {...register('beanType')}
        placeholder="Bean Type"
        required
      />
      <select {...register('profileId')} required>
        {profiles?.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        {...register('equipment')}
        placeholder="Equipment"
        required
      />
      <textarea {...register('notes')} placeholder="Notes" />
      <button type="submit">Save</button>
    </form>
  );
};

export default RoastLogForm;
