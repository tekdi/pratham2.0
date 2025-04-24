import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { filterContent, staticFilterContent } from '../../utils/AuthService';

interface FilterForm {
  setParentFormData: any;
  setParentStaticFormData: any;
  parentStaticFormData: any;
  setOrginalFormData: any;
  orginalFormData: any;
  instant?: any;
  setIsDrawerOpen: any;
  filterValues?: any;
  onApply?: any
  parentFormData?: any;
}

const FilterForm: React.FC<FilterForm> = ({
  setParentFormData,
  setParentStaticFormData,
  parentStaticFormData,
  setOrginalFormData,
  orginalFormData,
  setIsDrawerOpen,
  filterValues,
  onApply,
  instant,
  parentFormData
}) => {
  const { t } = useTranslation();
  const [filterData, setFilterData] = useState<any[]>([]);
  const [renderForm, setRenderForm] = useState<any[]>([]);
  const [renderStaticForm, setRenderStaticForm] = useState<any[]>([]);
  const [staticFilter, setStaticFilter] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [staticFormData, setStaticFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // setLoading(true);
    const instantId = localStorage.getItem('collectionFramework');
    console.log("instantId", instantId);

    if (instantId) {
      const data = await filterContent({ instantId: instantId.toString() });

      const categories: any = data?.framework?.categories;
      console.log("categories", data?.framework);

      if (categories) {
        const transformedCategories = transformCategories(categories);
        // console.log("transformedCategories", transformedCategories);

        const structuredArray = convertToStructuredArray(transformedCategories);

        // console.log(structuredArray, 'structuredArray');


        const transformedRenderForm = transformRenderForm(categories || []);
        console.log(transformedRenderForm, 'transformedRenderForm');
        const defaultFormData: Record<string, any> = {};
        transformedRenderForm.forEach((item) => {
          if (item.options.length === 1) {
            defaultFormData[item.code] = [item.options[0]];
          }
        });

        setRenderForm(transformedRenderForm);
        fetchStaticForm(transformedRenderForm);
        setFilterData(structuredArray);
        setFormData(defaultFormData);
      }

    }

  };


  const fetchStaticForm = async (transformedRenderForm: any[]) => {
    const instantId = localStorage.getItem('channelId');
    const data = await staticFilterContent({ instantId });
    const form = data?.objectCategoryDefinition?.forms?.create?.properties;
    const filteredNames = extractNames(transformedRenderForm);
    const filteredForm = filterObjectsWithSourceCategory(form, filteredNames);

    setRenderStaticForm(filteredForm?.[0]?.fields);
    setLoading(false);
  };

  const transformCategories = (categories: any[]) => {
    return categories
      .sort((a: any, b: any) => a.index - b.index)
      .reduce((acc: any, category: any) => {
        acc[category.code] = {
          name: category.name,
          code: category.code,
          index: category.index,
          options: category.terms
            .sort((a: any, b: any) => a.index - b.index)
            .map((term: any) => ({
              code: term.code,
              name: term.name,
              category: term.category,
              associations: groupAssociations(term.associations),
            })),
        };
        return acc;
      }, {});
  };

  const convertToStructuredArray = (obj: any) => {
    return Object.keys(obj).map((key) => ({
      [key]: {
        name: obj[key].name,
        code: obj[key].code,
        options: obj[key].options,
      },
    }));
  };

  const groupAssociations = (associations: any[]) => {
    const grouped = associations?.reduce((acc: any, assoc: any) => {
      if (!acc[assoc.category]) {
        acc[assoc.category] = [];
      }
      acc[assoc.category].push(assoc);
      return acc;
    }, {});

    Object.keys(grouped || {}).forEach((key) => {
      grouped[key].sort((a: any, b: any) => a.index - b.index);
    });

    return grouped;
  };




  const transformRenderForm = (categories: any[]) => {
    console.log(categories, 'categories');

    return categories.map((category: any) => ({
      name: category.name,
      code: category.code,
      options: category.terms.map((term: any) => ({
        code: term.code,
        name: term.name,
        identifier: term.identifier,
      })),
      index: category.index,
    }));
  };

  const extractNames = (renderForm: any[]) => {
    return renderForm.map((item) => item.name);
  };

  const filterObjectsWithSourceCategory = (data: any, filteredNames: string[]) => {
    const filter = data?.filter((section: any) =>
      section.fields.some((field: any) => field?.hasOwnProperty('sourceCategory'))
    );
    setStaticFilter(filter);
    return filter.map((category: any) => ({
      ...category,
      fields: category.fields.filter(
        (field: any) => !filteredNames.includes(field.name)
      ),
    }));
  };

  const handleFilter = () => {
    const transformedFormData = transformFormData(formData, staticFilter);
    setParentFormData(transformedFormData);
    setOrginalFormData(formData);
    setParentStaticFormData(staticFormData);
    setIsDrawerOpen(false);
    const formattedPayload = formatPayload(formData);
    onApply(formattedPayload);

    console.log(formattedPayload, 'parentFormData');
    // console.log(staticFilter, 'parentFormData');

  };

  const transformFormData = (formData: any, staticFilter: any[]) => {
    const categoryToCodeMap: Record<string, string> = {};
    staticFilter.forEach((filter) => {
      filter.fields.forEach((field: any) => {
        if (field.sourceCategory) {
          categoryToCodeMap[field.sourceCategory] = field.code;
        }
      });
    });

    const transformedData: Record<string, any> = {};
    Object.keys(formData).forEach((key) => {
      if (categoryToCodeMap[key]) {
        transformedData[categoryToCodeMap[key]] = formData[key].map(
          (item: any) => item.identifier
        );
      }
    });

    return transformedData;
  };

  useEffect(() => {
    fetchData();
    setFormData(orginalFormData);
    setStaticFormData(parentStaticFormData);
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* <Typography variant="h6" fontWeight="bold">
          {t('select_filters')}
        </Typography> */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {renderForm.map((item, key) => (
                <Grid item xs={12} key={key}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: 1 }}>
                    {item.name}
                  </Typography>
                  {item.options.map((option: any, index: number) => (
                    <FormControlLabel
                      key={index}
                      sx={{ display: 'block' }}
                      control={
                        <Checkbox
                          checked={formData[item.code]?.some((o: any) => o.code === option.code)}
                          onChange={(e) => {
                            const updatedOptions = e.target.checked
                              ? [...(formData[item.code] || []), option]
                              : (formData[item.code] || []).filter((o: any) => o.code !== option.code);
                            setFormData({ ...formData, [item.code]: updatedOptions });
                          }}
                        />
                      }
                      label={option.name}
                    />
                  ))}
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" fontWeight="bold" sx={{ marginTop: 2 }}>
              {t('other_filters')}
            </Typography>
            <Grid container spacing={2}>
              {renderStaticForm.map((item, key) => (
                <Grid item xs={12} key={key}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: 1 }}>
                    {item.name}
                  </Typography>
                  {item?.range?.map((option: any, index: number) => (
                    <FormControlLabel
                      key={index}
                      sx={{ display: 'block' }}
                      control={
                        <Checkbox
                          checked={staticFormData[item.code]?.some((o: any) => o === option)}
                          onChange={(e) => {
                            const updatedOptions = e.target.checked
                              ? [...(staticFormData[item.code] || []), option]
                              : (staticFormData[item.code] || []).filter((o: any) => o !== option);
                            setStaticFormData({ ...staticFormData, [item.code]: updatedOptions });
                          }}
                        />
                      }
                      label={option}
                    />
                  ))}
                </Grid>
              ))}
            </Grid>
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button variant="contained" onClick={handleFilter}>
            {t('filter')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

FilterForm.propTypes = {
  setParentFormData: PropTypes.func.isRequired,
  setParentStaticFormData: PropTypes.func.isRequired,
  parentStaticFormData: PropTypes.any.isRequired,
  setOrginalFormData: PropTypes.func.isRequired,
  orginalFormData: PropTypes.any.isRequired,
  instant: PropTypes.any.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
};

export default FilterForm;

const formatPayload = (payload: any) => {
  const formattedPayload: any = {};
  Object.keys(payload).forEach((key) => {
    if (Array.isArray(payload[key])) {
      formattedPayload[key] = payload[key].map((item: any) => item.code);
    } else {
      formattedPayload[key] = payload[key];
    }
  });
  return formattedPayload;
}