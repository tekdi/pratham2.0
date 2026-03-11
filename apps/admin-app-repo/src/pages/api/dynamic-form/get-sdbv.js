export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        centerId,
        searchType,
        cohortSearchUrl,
        SDBVSearchUrl,
        authToken,
        findKeyword,
        tenantId,
      } = req.body;
      const axios = require('axios');

      // First condition: if searchType is 'village'
      if (searchType === 'village') {
        try {
          const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: SDBVSearchUrl,
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
              tenantId: tenantId,
            },
            data: {
              fieldName: 'village',
              controllingfieldfk: [parseInt(findKeyword)],
              sort: ['village_name', 'asc'],
            },
          };

          const response = await axios.request(config);

          if (
            response.data &&
            response.data.result &&
            response.data.result.values
          ) {
            const result = response.data.result.values.map((value) => ({
              id: value.village_id,
              name: value.village_name,
            }));

            return res.status(200).json({ result });
          } else {
            return res.status(200).json({ result: [] });
          }
        } catch (error) {
          console.error('Error fetching village data:', error);
          return res.status(500).json({ error: error.message });
        }
      }
      // Else condition: for state, district, block
      else {
        try {
          // First call: Get cohort hierarchy data
          // Construct URL - handle both cases where cohortSearchUrl ends with / or not
          const cohortUrl = cohortSearchUrl.endsWith('/')
            ? `${cohortSearchUrl}${centerId}`
            : `${cohortSearchUrl}/${centerId}`;

          const cohortConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: cohortUrl,
            headers: {
              accept: 'application/json, text/plain, */*',
              authorization: `Bearer ${authToken}`,
              tenantid: tenantId,
            },
          };

          const cohortResponse = await axios.request(cohortConfig);

          if (
            !cohortResponse.data ||
            !cohortResponse.data.result ||
            !cohortResponse.data.result.cohortData ||
            cohortResponse.data.result.cohortData.length === 0
          ) {
            return res.status(200).json({ result: [] });
          }

          // Get CATCHMENT_AREA from customField
          const cohortData = cohortResponse.data.result.cohortData[0];
          const catchmentAreaField = cohortData.customField?.find(
            (field) => field.label === 'CATCHMENT_AREA'
          );

          if (
            !catchmentAreaField ||
            !catchmentAreaField.selectedValues ||
            catchmentAreaField.selectedValues.length === 0
          ) {
            return res.status(200).json({ result: [] });
          }

          // selectedValues is an array of state objects
          const states = catchmentAreaField.selectedValues;

          let result = [];

          if (searchType === 'state') {
            // Return list of states
            result = states.map((state) => ({
              id: state.stateId,
              name: state.stateName,
            }));
          } else if (searchType === 'district') {
            // Find state with matching stateId and return its districts
            const state = states.find(
              (s) => s.stateId === parseInt(findKeyword)
            );
            if (state && state.districts) {
              result = state.districts.map((district) => ({
                id: district.districtId,
                name: district.districtName,
              }));
            }
          } else if (searchType === 'block') {
            // Find district with matching districtId and return its blocks
            for (const state of states) {
              const district = state.districts?.find(
                (d) => d.districtId === parseInt(findKeyword)
              );
              if (district && district.blocks) {
                result = district.blocks.map((block) => ({
                  id: block.id,
                  name: block.name,
                }));
                break;
              }
            }
          }
//default empty then give district block list
          if (result.length === 0) {
            try {
              const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: SDBVSearchUrl,
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`,
                  tenantId: tenantId,
                },
                data: {
                  fieldName: searchType === 'district' ? 'district' : 'block',
                  controllingfieldfk: [parseInt(findKeyword)],
                  sort: searchType === 'district' ? ['district_name', 'asc'] : ['block_name', 'asc'],
                },
              };
    
              const response = await axios.request(config);
    
              if (
                response.data &&
                response.data.result &&
                response.data.result.values
              ) {
                const result = response.data.result.values.map((value) => ({
                  id: searchType === 'district' ? value.district_id : value.block_id,
                  name: searchType === 'district' ? value.district_name : value.block_name,
                }));
    
                return res.status(200).json({ result });
              } else {
                return res.status(200).json({ result: [] });
              }
            } catch (error) {
              console.error('Error fetching village data:', error);
              return res.status(500).json({ error: error.message });
            }
          }
          else{

            return res.status(200).json({ result });
          }
        } catch (error) {
          console.error('Error fetching cohort data:', error);
          return res.status(500).json({ error: error.message });
        }
      }
    } catch (error) {
      console.error('Error in get-sdbv handler:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
