// Generic breadth-first walk of a framework's term-association graph,
// starting from `startTerms` (terms of the source category), following
// `associations[]` links through any number of intermediate categories,
// until terms belonging to `targetCategory` are reached. Used to resolve
// indirect relationships (e.g. board -> medium -> stream) without any
// category name being hardcoded into the traversal itself, and without
// requiring the source category's terms to carry a direct association to
// the target category.
function findAssociatedTermNames(framework, startTerms, targetCategory, allowedNames) {
  const allowedSet = Array.isArray(allowedNames) ? new Set(allowedNames) : null;
  const termsByIdentifier = {};
  (framework?.categories ?? []).forEach((category) => {
    (category?.terms ?? []).forEach((term) => {
      if (term?.identifier) {
        termsByIdentifier[term.identifier] = term;
      }
    });
  });

  const visited = new Set(startTerms.map((term) => term?.identifier).filter(Boolean));
  const queue = [...startTerms];
  const found = new Map();

  while (queue.length > 0) {
    const current = queue.shift();
    (current?.associations ?? []).forEach((assoc) => {
      if (!assoc?.identifier || visited.has(assoc.identifier)) {
        return;
      }
      visited.add(assoc.identifier);

      if (assoc.category === targetCategory) {
        if (!allowedSet || allowedSet.has(assoc.name)) {
          found.set(assoc.name, true);
        }
        return;
      }

      const nextTerm = termsByIdentifier[assoc.identifier];
      if (nextTerm) {
        queue.push(nextTerm);
      }
    });
  }

  return Array.from(found.keys());
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { code, fetchUrl, selectedvalue, findcode, allowedValues } = req.body;

      const axios = require('axios');

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: fetchUrl,
        headers: {
          Accept: '*/*',
        },
      };

      let updatedSelectedvalue = null;
      if (selectedvalue) {
        updatedSelectedvalue = Array.isArray(selectedvalue)
          ? selectedvalue
          : [selectedvalue];
      }

      axios
        .request(config)
        .then((response) => {
          let options = [];

          if (
            response?.data?.result?.framework?.categories &&
            response?.data?.result?.framework?.categories.length > 0
          ) {
            let frameworkFilter = response?.data?.result?.framework;

            frameworkFilter.categories.map((categories) => {
              if (categories?.code === code) {
                if (updatedSelectedvalue && updatedSelectedvalue.length > 0) {
                  // console.log('in found state', updatedSelectedvalue);
                  const categories_terms = categories?.terms;
                  // console.log('in categories_terms', categories_terms);
                  const filteredData = categories_terms?.filter((item) =>
                    selectedvalue.includes(item.name)
                  );
                  // console.log('in filteredData', filteredData);
                  if (filteredData) {
                    if (Array.isArray(allowedValues) && allowedValues.length > 0) {
                      // Target category isn't necessarily a direct association of
                      // the selected term(s) (e.g. stream is only associated with
                      // medium, not board directly) - walk the association graph
                      // instead of reading `associations[]` in isolation, and
                      // restrict results to the caller-supplied allowed set.
                      options = findAssociatedTermNames(
                        frameworkFilter,
                        filteredData,
                        findcode,
                        allowedValues
                      ).map((name) => ({ label: name, value: name }));
                    } else {
                      options = filteredData?.flatMap((data) =>
                        (data?.associations ?? []) // Ensure associations exist, default to empty array
                          .filter((assoc) => assoc?.category === findcode)
                          .map((assoc) => ({
                            label: assoc.name,
                            value: assoc.name,
                          }))
                      );
                    }
                  }
                  // console.log('options', JSON.stringify(options));
                } else if (selectedvalue != '') {
                  // Transform terms into options
                  // console.log('in initial state');
                  options = categories?.terms
                    .filter((term) => term.status !== "Retired") // Filter out retired boards
                    .map((term) => ({
                      label: term.name,
                      value: term.name,
                    }));
                }
                // console.log('option', options);
              }
            });
          }
          const sortedOptions = options.sort((a, b) =>
            a.label.localeCompare(b.label)
          );
          const uniqueData = Array.from(
            new Map(sortedOptions.map((item) => [item.value, item])).values()
          );
          res.status(200).json({ options: uniqueData });
        })
        .catch((error) => {
          // console.log(error);
          res.status(500).json({ error: error.message });
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
