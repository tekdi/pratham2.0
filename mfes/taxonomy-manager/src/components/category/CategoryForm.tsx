import React from 'react';
import UniversalForm from '../framework/UniversalForm';
import type { CategoryFormProps } from '../../interfaces/CategoryInterface';

const CategoryForm: React.FC<CategoryFormProps> = ({
  form,
  onChange,
  onSubmit,
  error,
  success,
  isEditMode = false,
}) => {
  const fields = [
    {
      name: 'name',
      label: 'Name',
      value: form.name,
      required: true,
      disabled: false, // Name can always be edited
    },
    {
      name: 'code',
      label: 'Code',
      value: form.code,
      required: true,
      disabled: isEditMode, // Code is disabled in edit mode
    },
  ];

  return (
    <UniversalForm
      title={isEditMode ? 'Edit Category' : 'Add New Category'}
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

export default CategoryForm;
