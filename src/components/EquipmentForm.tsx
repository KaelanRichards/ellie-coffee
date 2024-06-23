import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';

interface EquipmentFormProps {
  onSubmit: () => void;
  equipment?: any;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  onSubmit,
  equipment,
}) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    type: equipment?.type || '',
    manufacturer: equipment?.manufacturer || '',
    model: equipment?.model || '',
    serialNumber: equipment?.serialNumber || '',
    purchaseDate: equipment?.purchaseDate
      ? new Date(equipment.purchaseDate).toISOString().split('T')[0]
      : '',
    lastMaintenance: equipment?.lastMaintenance
      ? new Date(equipment.lastMaintenance).toISOString().split('T')[0]
      : '',
    nextMaintenance: equipment?.nextMaintenance
      ? new Date(equipment.nextMaintenance).toISOString().split('T')[0]
      : '',
    notes: equipment?.notes || '',
  });

  const createEquipment = trpc.equipment.create.useMutation();
  const updateEquipment = trpc.equipment.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      purchaseDate: formData.purchaseDate
        ? new Date(formData.purchaseDate)
        : new Date(), // Provide a default date
      lastMaintenance: formData.lastMaintenance
        ? new Date(formData.lastMaintenance)
        : undefined,
      nextMaintenance: formData.nextMaintenance
        ? new Date(formData.nextMaintenance)
        : undefined,
    };
    if (equipment) {
      await updateEquipment.mutateAsync({ id: equipment.id, ...formattedData });
    } else {
      await createEquipment.mutateAsync(formattedData);
    }
    onSubmit();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        placeholder="Equipment Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Equipment Type"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="manufacturer"
        value={formData.manufacturer}
        onChange={handleChange}
        placeholder="Manufacturer"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="model"
        value={formData.model}
        onChange={handleChange}
        placeholder="Model"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="serialNumber"
        value={formData.serialNumber}
        onChange={handleChange}
        placeholder="Serial Number"
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="purchaseDate"
        value={formData.purchaseDate}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="lastMaintenance"
        value={formData.lastMaintenance}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="nextMaintenance"
        value={formData.nextMaintenance}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
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
        {equipment ? 'Update Equipment' : 'Add Equipment'}
      </button>
    </form>
  );
};

export default EquipmentForm;
