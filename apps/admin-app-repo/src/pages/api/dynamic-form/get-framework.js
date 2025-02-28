export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { code, fetchUrl, selectedvalue, findcode } = req.body;

      const axios = require('axios');

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: fetchUrl,
        headers: {
          Accept: '*/*',
        },
      };

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
                if (selectedvalue) {
                  const categories_terms = categories?.terms;

                  const getAssociationsByCode = (data, code) => {
                    const result = data.find((item) => item.code === code);
                    return result ? result.associations : [];
                  };

                  const associations = getAssociationsByCode(
                    categories_terms,
                    selectedvalue
                  );

                  // console.log('!!!!!!!!!', associations);
                  // Extract medium category into options array
                  options = associations
                    .filter((item) => item.category === findcode)
                    .map((item) => ({
                      label: item.name,
                      value: item.code,
                    }));
                } else {
                  // Transform terms into options
                  options = categories?.terms.map((term) => ({
                    label: term.name,
                    value: term.code,
                  }));
                }
                // console.log('option', options);
              }
            });
          }

          res.status(200).json({ options });
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
