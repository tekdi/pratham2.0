import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button as MuiButton,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  RadioGroup,
  Radio,
  Divider,
} from '@mui/material';
import { useTranslation } from '../context/LanguageContext';
import { filterContent, staticFilterContent } from '../../utils/AuthService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface TermOption {
  code: string;
  name: string;
  identifier?: string;
  associations?: Record<string, any[]>;
}
export interface Category {
  name: string;
  code: string;
  index: number;
  options: TermOption[];
}
export interface StaticField {
  name: string;
  code: string;
  range: { value: string; label: string }[];
  sourceCategory?: string;
  fields?: { sourceCategory?: string }[]; // Added fields property
}

interface FilterListProps {
  // instant: { frameworkId?: string; channelId?: string };
  setParentFormData: (d: any) => void;
  setParentStaticFormData: (d: any) => void;
  parentStaticFormData: any;
  setOrginalFormData: (d: any) => void;
  orginalFormData: any;
  setIsDrawerOpen: (b: boolean) => void;
  onApply?: any;
}

export function FilterForm({
  setParentFormData,
  setParentStaticFormData,
  parentStaticFormData,
  setOrginalFormData,
  orginalFormData,
  setIsDrawerOpen,
  onApply,
}: FilterListProps) {
  const { t } = useTranslation();

  const [filterData, setFilterData] = useState<Record<string, any>[]>([]);
  const [renderForm, setRenderForm] = useState<Category[]>([]);
  const [renderStaticForm, setRenderStaticForm] = useState<StaticField[]>([]);
  const [staticFilter, setStaticFilter] = useState<StaticField[]>([]);
  const [formData, setFormData] = useState<Record<string, TermOption[]>>(
    orginalFormData || {}
  );
  const [staticFormData, setStaticFormData] = useState<
    Record<string, string[]>
  >(parentStaticFormData || {});
  const [loading, setLoading] = useState(true);

  // Helper functions
  function convertToStructuredArray(obj: Record<string, any>) {
    return Object.keys(obj).map((key) => ({
      [key]: {
        name: obj[key].name,
        code: obj[key].code,
        options: obj[key].options,
      },
    }));
  }

  function transformCategories(categories: any[]) {
    return categories
      .sort((a, b) => a.index - b.index)
      .reduce((acc: any, category: any) => {
        acc[category.code] = {
          name: category.name,
          code: category.code,
          index: category.index,
          options: category.terms
            .sort((a: any, b: any) => a.index - b.index)
            .map((term: any) => {
              const grouped =
                term.associations?.reduce((g: any, assoc: any) => {
                  g[assoc.category] = g[assoc.category] || [];
                  g[assoc.category].push(assoc);
                  return g;
                }, {}) || {};
              Object.keys(grouped).forEach((k) =>
                grouped[k].sort((a: any, b: any) => a.index - b.index)
              );
              return {
                code: term.code,
                name: term.name,
                identifier: term.identifier,
                associations: grouped,
              };
            }),
        };
        return acc;
      }, {});
  }

  function transformRenderForm(categories: any[]) {
    return categories
      .sort((a, b) => a.index - b.index)
      .map((category) => ({
        name: category.name,
        code: category.code,
        options: category.terms
          .sort((a: any, b: any) => a.index - b.index)
          .map((term: any) => ({
            code: term.code,
            name: term.name,
            identifier: term.identifier,
            associations:
              term.associations?.reduce((g: any, assoc: any) => {
                g[assoc.category] = g[assoc.category] || [];
                g[assoc.category].push(assoc);
                return g;
              }, {}) || {},
          })),
        index: category.index,
      }));
  }

  function filterObjectsWithSourceCategory(
    data: any[],
    filteredNames: string[]
  ) {
    const filtered = data.filter((section) =>
      section.fields?.some((f: any) => f.hasOwnProperty('sourceCategory'))
    );
    setStaticFilter(filtered);
    return filtered.map((cat) => ({
      ...cat,
      fields: cat.fields?.filter((f: any) => !filteredNames.includes(f.name)),
    }));
  }

  function findAndRemoveIndexes(index: number, form: Category[]) {
    return form.map((item) => ({
      ...item,
      options: item.index > index ? [] : item.options,
    }));
  }

  function updateRenderFormWithAssociations(
    category: string,
    newData: TermOption[],
    baseFilter: any[],
    currentForm: Category[]
  ) {
    const obj = baseFilter.find((f: any) => f[category]);
    if (!obj) return currentForm;

    const toPush: Record<string, any[]> = {};
    newData.forEach((opt) =>
      Object.entries(opt.associations || {}).forEach(([k, arr]) => {
        toPush[k] = toPush[k] || [];
        arr.forEach((item) => {
          if (!toPush[k].some((o) => o.code === item.code))
            toPush[k].push(item);
        });
      })
    );

    return currentForm.map((item) => ({
      ...item,
      options: toPush[item.code]?.length ? toPush[item.code] : item.options,
    }));
  }

  function replaceOptionsWithAssoc({
    category,
    index,
    newCategoryData,
  }: {
    category: string;
    index: number;
    newCategoryData: TermOption[];
  }) {
    if (newCategoryData.length === 0 && index === 1) {
      fetchData();
      return;
    }
    const pruned = findAndRemoveIndexes(index, renderForm);
    const updated = updateRenderFormWithAssociations(
      category,
      newCategoryData,
      filterData,
      pruned
    );
    setRenderForm(updated);
  }

  function transformFormData(
    fd: Record<string, TermOption[]>,
    sf: StaticField[]
  ) {
    const map: Record<string, string> = {};
    sf.forEach((f) =>
      f.fields?.forEach((fld: any) => {
        if (fld.sourceCategory) map[fld.sourceCategory] = fld.code;
      })
    );
    const out: Record<string, string[]> = {};
    Object.keys(fd).forEach((k) => {
      if (map[k]) out[map[k]] = fd[k].map((o) => o.identifier || o.code);
    });
    return out;
  }

  // Data fetch
  const fetchData = async () => {
    setLoading(true);
    const instantId = localStorage.getItem('collectionFramework') ?? '';
    const data = await filterContent({ instantId });
    const cats = data?.framework?.categories || [];
    setFilterData(convertToStructuredArray(transformCategories(cats)));

    const rf = transformRenderForm(cats);
    const defaults: Record<string, TermOption[]> = {};
    rf.forEach((c) => {
      if (c.options.length === 1) defaults[c.code] = [c.options[0]];
    });
    setRenderForm(rf);
    setFormData({ ...defaults, ...orginalFormData });

    const instantFramework = localStorage.getItem('channelId') ?? '';
    const staticResp = await staticFilterContent({ instantFramework });
    const props =
      staticResp?.objectCategoryDefinition?.forms?.create?.properties || [];
    const filtered = filterObjectsWithSourceCategory(
      props,
      rf.map((r) => r.name)
    );
    setRenderStaticForm(filtered[0]?.fields || []);
    setStaticFormData(parentStaticFormData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    const transformed = transformFormData(formData, staticFilter);
    setParentFormData(transformed);
    setOrginalFormData(formData);
    setParentStaticFormData(staticFormData);
    setIsDrawerOpen(false);
    const formattedPayload = formatPayload(formData);
    onApply(formattedPayload);
    console.log(formData, 'formattedPayload');
  };
  const [showMore, setShowMore] = useState(false);
  const [showMoreStatic, setShowMoreStatic] = useState(false);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxHeight: '62vh', overflow: 'auto' }}>
        {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
          {t('select_filters')}
        </Typography> */}

        <Box sx={{ mb: 2 }}>
          {renderForm.map((cat) => {
            const optionsToShow = showMore
              ? cat.options
              : cat.options.slice(0, 3);

            return (
              <>
                <Accordion
                  key={cat.code}
                  sx={{ background: 'unset', boxShadow: 'unset' }}
                >
                  <AccordionSummary
                    sx={{
                      minHeight: 20,
                      '&.Mui-expanded': {
                        minHeight: 20,
                        '& .MuiAccordionSummary-content': {
                          margin: '5px 0',
                        },
                      },
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: '#1C1B1F' }} />}
                  >
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#181D27',
                      }}
                    >
                      {cat.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: '0px 22px' }}>
                    <FormGroup>
                      {optionsToShow.map((opt) => (
                        <FormControlLabel
                          sx={{
                            color: '#414651',
                            fontSize: '14px',
                            fontWeight: '500',
                          }}
                          key={opt.code}
                          control={
                            <Checkbox
                              checked={
                                !!formData[cat.code]?.some(
                                  (o) => o.code === opt.code
                                )
                              }
                              onChange={(e) => {
                                const prev = formData[cat.code] || [];
                                const next = e.target.checked
                                  ? [...prev, opt]
                                  : prev.filter((o) => o.code !== opt.code);

                                replaceOptionsWithAssoc({
                                  category: cat.code,
                                  index: cat.index,
                                  newCategoryData: next,
                                });

                                setFormData((all) => ({
                                  ...all,
                                  [cat.code]: next,
                                }));
                              }}
                            />
                          }
                          label={opt.name}
                        />
                      ))}
                    </FormGroup>
                    {cat.options.length > 3 && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowMore(!showMore)}
                        sx={{ mt: 1 }}
                      >
                        {showMore ? 'Show less ▲' : 'Show more ▼'}
                      </Button>
                    )}
                  </AccordionDetails>
                </Accordion>
                {/* <Divider sx={{ my: 2 }} /> */}
              </>
            );
          })}

          <Typography variant="h6" sx={{ my: 2 }} fontWeight="bold">
            {t('LEARNER_APP.other_filters')}
          </Typography>

          {renderStaticForm.map((field) => {
            const rangeToShow = showMoreStatic
              ? field.range
              : field.range.slice(0, 3);

            return (
              <Accordion
                sx={{ background: 'unset', boxShadow: 'unset' }}
                key={field.code}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    minHeight: 20,
                    '&.Mui-expanded': {
                      minHeight: 20,
                      '& .MuiAccordionSummary-content': {
                        margin: '5px 0',
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#181D27',
                    }}
                  >
                    {field.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0px 22px' }}>
                  <FormGroup>
                    {rangeToShow.map((r: any) => (
                      <FormControlLabel
                        sx={{
                          color: '#414651',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                        key={r.value}
                        control={
                          <Checkbox
                            checked={staticFormData[field.code]?.includes(
                              r.value
                            )}
                            onChange={(e) => {
                              const prev = staticFormData[field.code] || [];
                              const next = e.target.checked
                                ? [...prev, r.value]
                                : prev.filter((v) => v !== r.value);
                              setStaticFormData((all) => ({
                                ...all,
                                [field.code]: next,
                              }));
                            }}
                          />
                        }
                        label={r}
                      />
                    ))}
                  </FormGroup>
                  {field.range.length > 3 && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setShowMoreStatic(!showMoreStatic)}
                      sx={{ mt: 1 }}
                    >
                      {showMoreStatic ? 'Show less ▲' : 'Show more ▼'}
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
      <Box display={'flex'} justifyContent="center" gap={2} mt={2}>
        <MuiButton
          variant="contained"
          sx={{ width: '50%' }}
          onClick={handleFilter}
        >
          {t('filter')}
        </MuiButton>
      </Box>
    </>
  );
}

const formatPayload = (payload: any) => {
  const formattedPayload: any = {};
  Object.keys(payload).forEach((key) => {
    if (Array.isArray(payload[key])) {
      formattedPayload[key] = payload[key].map((item: any) => item.name);
    } else {
      formattedPayload[key] = payload[key];
    }
  });
  return formattedPayload;
};
