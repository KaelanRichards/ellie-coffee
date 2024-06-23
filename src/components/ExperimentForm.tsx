import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';

interface ExperimentFormProps {
  onSubmit: () => void;
  experiment?: any;
}

const ExperimentForm: React.FC<ExperimentFormProps> = ({
  onSubmit,
  experiment,
}) => {
  const [formData, setFormData] = useState({
    name: experiment?.name || '',
    description: experiment?.description || '',
    startDate: experiment?.startDate
      ? new Date(experiment.startDate).toISOString().split('T')[0]
      : '',
    endDate: experiment?.endDate
      ? new Date(experiment.endDate).toISOString().split('T')[0]
      : '',
    status: experiment?.status || 'Planned',
    notes: experiment?.notes || '',
  });

  const createExperiment = trpc.experiment.create.useMutation();
  const updateExperiment = trpc.experiment.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(), // Provide a default date
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    };
    if (experiment) {
      await updateExperiment.mutateAsync({
        id: experiment.id,
        ...submissionData,
      });
    } else {
      await createExperiment.mutateAsync(submissionData);
    }
    onSubmit();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Experiment Name"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
        rows={4}
      />
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="Planned">Planned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button
        type="submit"
        className="w-full bg-brown-600 text-white p-2 rounded hover:bg-brown-700"
      >
        {experiment ? 'Update Experiment' : 'Create Experiment'}
      </button>
    </form>
  );
};

export default ExperimentForm;
