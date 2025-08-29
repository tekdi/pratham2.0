import { useState } from 'react';
import { updateCategory } from '../services/categoryService';
import { Category } from '../interfaces/CategoryInterface';
import { Framework } from '../interfaces/FrameworkInterface';

interface EditCategory {
  identifier: string;
  code: string;
}

interface CategoryFormState {
  name: string;
  code: string;
  description: string;
}

export function useEditCategory({
  categories,
  setCategories,
  framework,
  form,
  setForm,
  setError,
  setSuccess,
}: {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  framework: Partial<Framework> | null;
  form: CategoryFormState;
  setForm: (form: CategoryFormState) => void;
  setError: (err: string | null) => void;
  setSuccess: (msg: string | null) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EditCategory | null>(
    null
  );

  // Load category details into form for editing
  const handleEditCategory = (category: Category) => {
    setForm({
      name: category.name || '',
      code: category.code || '',
      description: category.description || '',
    });
    setEditingCategory({
      identifier: category.identifier,
      code: category.code,
    });
    setIsEditMode(true);
    setError(null);
    setSuccess(null);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingCategory(null);
    setForm({
      name: '',
      code: '',
      description: '',
    });
    setError(null);
    setSuccess(null);
  };

  // Update existing category
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const frameworkCode = framework?.code;
      if (!frameworkCode) {
        throw new Error('Missing framework code');
      }

      await updateCategory(
        {
          identifier: editingCategory.identifier,
          code: editingCategory.code,
          name: form.name,
          description: form.description,
        },
        frameworkCode
      );

      // Update category in the store
      const updatedCategories = categories.map((cat) => {
        if (cat.code === editingCategory.code) {
          return {
            ...cat,
            name: form.name,
            description: form.description,
          };
        }
        return cat;
      });

      setCategories(updatedCategories);
      setSuccess('Category updated successfully');
      setIsEditMode(false);
      setEditingCategory(null);

      // Reset form fields
      setForm({
        name: '',
        code: '',
        description: '',
      });
    } catch (err: unknown) {
      let msg = 'Failed to update category';
      if (err instanceof Error) msg = err.message;
      setError(msg);
    }
  };

  return {
    isEditMode,
    editingCategory,
    handleEditCategory,
    handleCancelEdit,
    handleUpdateCategory,
  };
}
