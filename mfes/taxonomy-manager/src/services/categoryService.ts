import { Framework } from '../interfaces/FrameworkInterface';
import { Category } from '../interfaces/CategoryInterface';
import { Term } from '../interfaces/TermInterface';
import { Association } from '../interfaces/AssociationInterface';
import { publishFrameworkAfterBatchOperation } from '../utils/HelperService';
import { post, patch } from './RestClient';
import { URL_CONFIG } from '../utils/url.config';

// Get live categories from a framework
export function getLiveCategories(framework: Framework | null): Category[] {
  if (!framework || !Array.isArray(framework.categories)) return [];
  return framework.categories.filter((cat) => cat && cat.status === 'Live');
}

// Get live terms from a category
export function getLiveTerms(category: Category | null): Term[] {
  if (!category || !Array.isArray(category.terms)) return [];
  return category.terms.filter((term) => term && term.status === 'Live');
}

// Group associations by category and return as array of Category objects
export function groupAssociationsByCategory(
  associations: Association[]
): Category[] {
  const grouped: { [cat: string]: Association[] } = {};
  associations.forEach((assoc) => {
    if (!assoc?.category) return;
    if (!grouped[assoc.category]) grouped[assoc.category] = [];
    grouped[assoc.category].push(assoc);
  });
  return Object.entries(grouped).map(([cat, assocs]) => ({
    identifier: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    code: cat,
    status: 'Live',
    terms: assocs as unknown as Term[], // treat as Term[] for modal
  }));
}

// --- API logic ---
export interface CategoryInput {
  name: string;
  code: string;
  description: string;
}

export async function createCategory(
  category: CategoryInput,
  frameworkCode: string
): Promise<unknown> {
  const requestBody = {
    request: {
      category: {
        name: category.name,
        code: category.code,
        description: category.description,
      },
    },
  };

  const url = `${URL_CONFIG.API.CATEGORY_CREATE}?framework=${frameworkCode}`;

  try {
    const response = await post(url, requestBody);
    const data = response.data;

    if (data.responseCode !== 'OK') {
      throw new Error(data?.params?.errmsg ?? 'Failed to create category');
    }

    return data;
  } catch (error: unknown) {
    // The interceptor already extracts meaningful error messages
    throw error instanceof Error
      ? error
      : new Error('Failed to create category');
  }
}

export async function batchCreateCategories(
  categories: CategoryInput[],
  frameworkCode: string
): Promise<
  { status: 'success' | 'failed'; message: string; category: CategoryInput }[]
> {
  const results: {
    status: 'success' | 'failed';
    message: string;
    category: CategoryInput;
  }[] = [];

  for (const category of categories) {
    try {
      await createCategory(category, frameworkCode);
      results.push({
        status: 'success',
        message: 'Successfully created',
        category,
      });
    } catch (err: unknown) {
      let msg = 'Failed to create category';
      if (err instanceof Error) msg = err.message;
      results.push({ status: 'failed', message: msg, category });
    }
  }

  // Get channelId from stores and publish the framework after all categories are created
  const successfulCategories = results.filter(
    (result) => result.status === 'success'
  );
  if (successfulCategories.length > 0) {
    await publishFrameworkAfterBatchOperation(
      frameworkCode,
      'category creation'
    );
  }

  return results;
}

export async function retryCreateCategory(
  category: CategoryInput,
  frameworkCode: string
): Promise<unknown> {
  return createCategory(category, frameworkCode);
}

// Get all terms from all categories
export function getAllTermsFromCategories(categories: Category[]): (Record<
  string,
  unknown
> & {
  categoryName: string;
  categoryCode: string;
})[] {
  return categories.flatMap((category) =>
    (category.terms || []).map((term) => ({
      ...term,
      categoryName: category.name,
      categoryCode: category.code,
    }))
  );
}

// Update an existing category
export const updateCategory = async (
  categoryData: {
    identifier: string;
    code: string;
    name: string;
    description: string;
  },
  frameworkCode: string
): Promise<void> => {
  try {
    const url = `${URL_CONFIG.API.CATEGORY_UPDATE}/${categoryData.code}?framework=${frameworkCode}`;

    const requestBody = {
      request: {
        category: {
          name: categoryData.name,
          description: categoryData.description,
        },
      },
    };

    const response = await patch(url, requestBody);

    if (!response.data) {
      throw new Error('Failed to update category');
    }

    return response.data;
  } catch (error: unknown) {
    console.error('Error updating category:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update category');
  }
};
