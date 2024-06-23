import React from 'react';
import { useForm } from 'react-hook-form';

interface RoastProfileFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const RoastProfileForm: React.FC<RoastProfileFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const { register, handleSubmit } = useForm({ defaultValues: initialData });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register('name')}
        placeholder="Profile Name"
        required
      />
      <textarea
        {...register('data')}
        placeholder="Profile Data (JSON)"
        required
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default RoastProfileForm;
