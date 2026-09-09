import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Local BFF proxy for the DynamicForm engine's "initial"/"dependent" framework
// term lookups (see L2QueueAssignSchema / L2QueueSearchSchema's `domain`
// fields). Mirrors apps/admin-app-repo's src/pages/api/dynamic-form/get-framework.js
// exactly, since that is the only known-working implementation of this
// contract: given a framework's `fetchUrl`, find the category matching
// `code`; with no `selectedvalue` return all of that category's terms
// (the "initial" dropdown), otherwise flat-map the matching terms'
// associations for category `findcode` (the "dependent" dropdown).
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { code, fetchUrl, selectedvalue, findcode } = req.body;

    const response = await axios.request({
      method: 'get',
      maxBodyLength: Infinity,
      url: fetchUrl,
      headers: { Accept: '*/*' },
    });

    let options: { label: string; value: string }[] = [];

    let updatedSelectedvalue: string[] | null = null;
    if (selectedvalue) {
      updatedSelectedvalue = Array.isArray(selectedvalue)
        ? selectedvalue
        : [selectedvalue];
    }

    const categories = response?.data?.result?.framework?.categories;
    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach((category: any) => {
        if (category?.code !== code) return;

        if (updatedSelectedvalue && updatedSelectedvalue.length > 0) {
          const filteredData = category?.terms?.filter((item: any) =>
            selectedvalue.includes(item.name)
          );
          if (filteredData) {
            options = filteredData.flatMap((data: any) =>
              (data?.associations ?? [])
                .filter((assoc: any) => assoc?.category === findcode)
                .map((assoc: any) => ({ label: assoc.name, value: assoc.name }))
            );
          }
        } else if (selectedvalue != '') {
          options = (category?.terms ?? [])
            .filter((term: any) => term.status !== 'Retired')
            .map((term: any) => ({ label: term.name, value: term.name }));
        }
      });
    }

    const sortedOptions = options.sort((a, b) => a.label.localeCompare(b.label));
    const uniqueData = Array.from(
      new Map(sortedOptions.map((item) => [item.value, item])).values()
    );

    res.status(200).json({ options: uniqueData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
