import React from 'react';
import UniversalForm from '../framework/UniversalForm';
import type { FormChangeEvent } from '../../interfaces/CategoryInterface';

interface TermFormProps {
  form: {
    name: string;
    code: string;
    description: string;
    label: string;
    selectedCategory: string;
  };
  categories: { code: string; name: string }[];
  onChange: (e: FormChangeEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  success?: string | null;
  isEditMode?: boolean;
}

const TermForm: React.FC<TermFormProps> = ({
  form,
  categories,
  onChange,
  onSubmit,
  error,
  success,
  isEditMode = false,
}) => {
  const fields = [
    {
      name: 'selectedCategory',
      label: 'Category',
      value: form.selectedCategory,
      type: 'select' as const,
      required: true,
      disabled: isEditMode,
      options: categories.map((category) => ({
        value: category.code,
        label: category.name,
      })),
    },
    {
      name: 'name',
      label: 'Name',
      value: form.name,
      required: true,
      disabled: false,
    },
    {
      name: 'code',
      label: 'Code',
      value: form.code,
      required: true,
      disabled: isEditMode,
    },
    {
      name: 'label',
      label: 'Label',
      value: form.label,
      required: true,
      disabled: false,
    },
  ];

  return (
    <UniversalForm
      title={isEditMode ? 'Edit Term' : 'Add New Term'}
      fields={fields}
      description={{
        value: form.description,
        name: 'description',
      }}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
      success={success}
    />
  );
};

export default TermForm;
