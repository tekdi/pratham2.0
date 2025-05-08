'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button as MuiButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { useTranslation } from '../context/LanguageContext';
import { filterContent, staticFilterContent } from '../../utils/AuthService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Loader } from '../Loader/Loader';

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
  fields?: { sourceCategory?: string; name?: string }[];
}

interface FilterListProps {
  setParentFormData?: (d: any) => void;
  setParentStaticFormData?: (d: any) => void;
  parentStaticFormData?: any;
  setOrginalFormData?: (d: any) => void;
  orginalFormData: any;
  setIsDrawerOpen?: (b: boolean) => void;
  staticFilter?: any;
  onApply?: any;
}

export function FilterForm({
  setParentFormData,
  setParentStaticFormData,
  parentStaticFormData,
  setOrginalFormData,
  orginalFormData,
  setIsDrawerOpen,
  staticFilter,
  onApply,
}: FilterListProps) {
  const { t } = useTranslation();

  const [filterData, setFilterData] = useState<Record<string, any>[]>([]);
  const [renderForm, setRenderForm] = useState<Category[]>([]);
  const [renderStaticForm, setRenderStaticForm] = useState<StaticField[]>([]);
  const [formData, setFormData] = useState<Record<string, TermOption[]>>({});
  const [staticFormData, setStaticFormData] = useState<
    Record<string, string[]>
  >(parentStaticFormData || {});
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showMoreStatic, setShowMoreStatic] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const instantId = localStorage.getItem('collectionFramework') ?? '';
    const data = await filterContent({ instantId });
    const categories = data?.framework?.categories || [];

    const transformedCategories = transformCategories(categories);
    const transformedRenderForm = transformRenderForm(categories);
    const defaults: Record<string, TermOption[]> = {};

    transformedRenderForm.forEach((c) => {
      if (c.options.length === 1) {
        defaults[c.code] = [c.options[0]];
      }
    });

    setFilterData(convertToStructuredArray(transformedCategories));
    setRenderForm(transformedRenderForm);

    // merge orginalFormData
    const mergedData = { ...orginalFormData };
    setFormData(mergedData);

    const instantFramework = localStorage.getItem('channelId') ?? '';
    const staticResp = await staticFilterContent({ instantFramework });
    const props =
      staticResp?.objectCategoryDefinition?.forms?.create?.properties || [];

    const filtered = filterObjectsWithSourceCategory(
      props,
      transformedRenderForm.map((r) => r.name)
    );
    setRenderStaticForm(filtered[0]?.fields || []);
    setStaticFormData(parentStaticFormData || {});
    setLoading(false);
  }, [orginalFormData, parentStaticFormData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = () => {
    const transformed = transformFormData(formData, staticFilter);
    setParentFormData?.(transformed);
    setOrginalFormData?.(formData);
    setParentStaticFormData?.(staticFormData);
    setIsDrawerOpen?.(false);
    const formattedPayload = formatPayload(formData);
    onApply({ ...formattedPayload, ...staticFormData });
  };

  const replaceOptionsWithAssoc = ({
    category,
    index,
    newCategoryData,
  }: {
    category: string;
    index: number;
    newCategoryData: TermOption[];
  }) => {
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
  };

  return (
    <Loader isLoading={loading}>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterSection
          fields={renderForm}
          selectedValues={formData}
          onChange={(code, next) => {
            const cat = renderForm.find((f) => f.code === code);
            if (cat) {
              replaceOptionsWithAssoc({
                category: code,
                index: cat.index,
                newCategoryData: next,
              });
            }
            setFormData((prev) => ({ ...prev, [code]: next }));
          }}
          showMore={showMore}
          setShowMore={setShowMore}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              my: 2,
            }}
          >
            {t('LEARNER_APP.other_filters')}
          </Typography>

          <FilterSection
            fields={renderStaticForm}
            selectedValues={staticFormData}
            onChange={(code, next) => {
              setStaticFormData((prev) => ({ ...prev, [code]: next }));
            }}
            showMore={showMoreStatic}
            setShowMore={setShowMoreStatic}
          />
          <Box display={'flex'} justifyContent="center" gap={2} mt={2}>
            <MuiButton
              variant="contained"
              sx={{ width: '50%' }}
              onClick={handleFilter}
            >
              {t('filter')}
            </MuiButton>
          </Box>
        </Box>
      </Box>
    </Loader>
  );
}

// Utility Functions
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

function convertToStructuredArray(obj: Record<string, any>) {
  return Object.keys(obj).map((key) => ({
    [key]: {
      name: obj[key].name,
      code: obj[key].code,
      options: obj[key].options,
    },
  }));
}

function filterObjectsWithSourceCategory(data: any[], filteredNames: string[]) {
  const filtered = data.filter((section) =>
    section.fields?.some((f: any) => f.hasOwnProperty('sourceCategory'))
  );
  return filtered.map((cat) => ({
    ...cat,
    fields: cat.fields?.filter((f: any) => !filteredNames.includes(f.name)),
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
        if (!toPush[k].some((o) => o.code === item.code)) toPush[k].push(item);
      });
    })
  );

  return currentForm.map((item) => ({
    ...item,
    options: toPush[item.code]?.length ? toPush[item.code] : item.options,
  }));
}

function transformFormData(
  fd: Record<string, TermOption[]>,
  sf: StaticField[]
) {
  const map: Record<string, string> = {};
  sf?.forEach((f) =>
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

interface FilterSectionProps {
  fields: any[];
  selectedValues: Record<string, any[]>;
  onChange: (code: string, next: any[]) => void;
  showMore: boolean;
  setShowMore: (b: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  fields,
  selectedValues,
  onChange,
  showMore,
  setShowMore,
}) => {
  return (
    <Box>
      {fields.map((field) => {
        const values = field.options ?? field.range ?? [];
        const code = field.code;
        const selected = selectedValues[code] || [];
        const optionsToShow = showMore ? values : values.slice(0, 3);

        return (
          <Accordion
            key={code}
            sx={{ background: 'unset', boxShadow: 'unset' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#1C1B1F' }} />}
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
                sx={{ fontSize: '18px', fontWeight: '500', color: '#181D27' }}
              >
                {field.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: '0px 16px',
                overflow: 'auto',
                maxHeight: '150px',
              }}
            >
              <FormGroup>
                {optionsToShow.map((item: any, idx: number) => {
                  const isChecked =
                    Array.isArray(selected) &&
                    selected.some((s) =>
                      typeof s === 'string'
                        ? s === item.name || s === item
                        : s.code === item.code || s.name === item.name
                    );

                  return (
                    <FormControlLabel
                      key={`${code}-${idx}`}
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...selected, item]
                              : selected.filter(
                                  (s: any) =>
                                    s !== item &&
                                    s.code !== item.code &&
                                    s.name !== item.name
                                );
                            onChange(code, next);
                          }}
                        />
                      }
                      label={item.name || item}
                      sx={{
                        color: '#414651',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    />
                  );
                })}
              </FormGroup>
              {values.length > 3 && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowMore(!showMore)}
                  sx={{ mt: 0 }}
                >
                  {showMore ? 'Show less ▲' : 'Show more ▼'}
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
