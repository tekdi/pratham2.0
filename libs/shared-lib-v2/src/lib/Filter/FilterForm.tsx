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
  Chip,
} from '@mui/material';
import { useTranslation } from '../context/LanguageContext';
import { filterContent, staticFilterContent } from '../../utils/AuthService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Loader } from '../Loader/Loader';
import { sortJsonByArray } from '../../utils/helper';
import SpeakableText from '../textToSpeech/SpeakableText';

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

interface FilterSectionProps {
  fields: any[];
  selectedValues: Record<string, any[]>;
  onChange: (code: string, next: any[]) => void;
  showMore: string[];
  setShowMore: any;
  repleaseCode?: string;
  staticFormData?: Record<string, object>;
  isShowStaticFilterValue?: boolean;
  isOpenColapsed?: boolean | any[];
  t: (key: string) => string;
}

interface FilterListProps {
  orginalFormData: any;
  staticFilter?: Record<string, object>;
  onApply?: any;
  filterFramework?: any;
  isShowStaticFilterValue?: boolean;
  isOpenColapsed?: boolean | any[];
  onlyFields?: string[];
}

export function FilterForm({
  orginalFormData,
  staticFilter,
  onApply,
  filterFramework,
  isShowStaticFilterValue,
  isOpenColapsed,
  onlyFields,
}: Readonly<FilterListProps>) {
  const { t } = useTranslation();
  const [filterData, setFilterData] = useState<any[]>([]);
  const [renderForm, setRenderForm] = useState<(Category | StaticField)[]>([]);
  const [formData, setFormData] = useState<Record<string, TermOption[]>>({});
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState([]);

  const fetchData = useCallback(
    async (noFilter = true) => {
      const instantId = localStorage.getItem('collectionFramework') ?? '';
      let data: any = {};

      if (filterFramework) {
        data = filterFramework;
      } else if (orginalFormData) {
        data = await filterContent({ instantId });
      }

      const categories = data?.framework?.categories ?? [];
      const transformedRenderForm = transformRenderForm(categories);
      // Fetch static filter content
      const instantFramework = localStorage.getItem('channelId') ?? '';
      const staticResp = await staticFilterContent({ instantFramework });
      const props =
        staticResp?.objectCategoryDefinition?.forms?.create?.properties ?? [];

      const filtered = filterObjectsWithSourceCategory(
        props,
        transformedRenderForm.map((r) => r.name)
      );
      const allFields = [
        ...transformedRenderForm,
        ...(filtered[0]?.fields ?? []),
      ];

      setFilterData(allFields);

      if (noFilter) {
        const mergedData = { ...orginalFormData, ...staticFilter };
        const { updatedFilters: dormNewData, updatedFilterValue } =
          replaceOptionsWithAssoc({
            filterValue: mergedData,
            filtersFields: allFields,
            onlyFields,
          });
        setFormData(updatedFilterValue);
        setRenderForm(dormNewData);
      }

      setLoading(false);
    },
    [orginalFormData, staticFilter, onlyFields, filterFramework]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = () => {
    const formattedPayload = formatPayload(formData);
    onApply?.({ ...formattedPayload, ...staticFilter });
  };

  return (
    <Loader isLoading={loading}>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterSection
          t={t}
          isShowStaticFilterValue={isShowStaticFilterValue}
          isOpenColapsed={isOpenColapsed}
          staticFormData={staticFilter}
          fields={renderForm}
          selectedValues={formData}
          onChange={(code, next) => {
            const cat: any = renderForm.find(
              (f: { code: string; old_code?: string }) =>
                f.code === code &&
                Object.prototype.hasOwnProperty.call(f, 'old_code')
            );
            let filterValue = { ...formData, [code]: next };
            if (cat) {
              const { updatedFilters: dormNewData, updatedFilterValue } =
                replaceOptionsWithAssoc({
                  filterValue,
                  filtersFields: filterData,
                  onlyFields,
                });
              filterValue = updatedFilterValue;
              setRenderForm(dormNewData);
            }
            setFormData(filterValue);
          }}
          showMore={showMore}
          setShowMore={setShowMore}
        />
        <Box display={'flex'} justifyContent="center" gap={2} mt={2}>
          <MuiButton
            variant="contained"
            sx={{ width: '50%' }}
            onClick={handleFilter}
          >
            <SpeakableText>{t('COMMON.FILTER')}</SpeakableText>
          </MuiButton>
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
      formattedPayload[key] = payload[key].map(
        (item: any) => item.name ?? item
      );
    } else {
      formattedPayload[key] = payload[key];
    }
  });
  return formattedPayload;
};

function filterObjectsWithSourceCategory(data: any[], filteredNames: string[]) {
  const filtered = data.filter((section) =>
    section.fields?.some((f: any) =>
      Object.prototype.hasOwnProperty.call(f, 'sourceCategory')
    )
  );
  return filtered.map((cat) => ({
    ...cat,
    fields: cat.fields?.filter((f: any) => !filteredNames.includes(f.name)),
  }));
}

export function transformRenderForm(categories: any[]) {
  return categories
    .sort((a, b) => a.index - b.index)
    .map((category) => ({
      name: category.name,
      code: `se_${category.code}s`,
      old_code: category.code,
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

function replaceOptionsWithAssoc({
  filtersFields,
  filterValue,
  onlyFields,
}: {
  filtersFields: any[];
  filterValue: Record<string, TermOption[]>;
  onlyFields: any;
}) {
  const updatedFilters = JSON.parse(JSON.stringify(filtersFields));

  for (let i = 0; i < updatedFilters.length; i++) {
    const currentFilter = filtersFields[i];
    const selectedValues = filterValue[currentFilter.code];
    if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      const newfilterValue = selectedValues.map(
        (item: any) => item.code ?? item
      );
      const selectedOptions = currentFilter?.options?.filter(
        (opt: any) =>
          newfilterValue.includes(opt.code) || newfilterValue.includes(opt.name)
      );
      const mergedAssociations: Record<string, any[]> = {};
      selectedOptions?.forEach((opt: any) => {
        if (opt.associations) {
          Object.entries(opt.associations).forEach(
            ([assocKey, assocOptions]: any) => {
              if (!mergedAssociations[assocKey]) {
                mergedAssociations[assocKey] = [];
              }
              assocOptions.forEach((assocOpt: any) => {
                if (
                  !mergedAssociations[assocKey].some(
                    (o) => o.code === assocOpt.code
                  )
                ) {
                  mergedAssociations[assocKey].push(assocOpt);
                }
              });
            }
          );
        }
      });

      Object.entries(mergedAssociations).forEach(([assocKey, assocOptions]) => {
        const nextFilterIndex = updatedFilters.findIndex(
          (f: any, idx: number) => f.old_code === assocKey && idx > i
        );
        // remove unwanted filterValue using options
        if (filterValue?.[`se_${assocKey}s`]) {
          filterValue[`se_${assocKey}s`] = filterValue[
            `se_${assocKey}s`
          ].filter((item: any) =>
            assocOptions.find(
              (sub) =>
                sub.code === (item.code ?? item.name ?? item) ||
                sub.name === (item.code ?? item.name ?? item) ||
                sub === (item.code ?? item.name ?? item)
            )
          );
        }
        if (nextFilterIndex !== -1) {
          updatedFilters[nextFilterIndex].options = assocOptions;
        }
      });
    }
  }

  const sortFields = sortJsonByArray({
    jsonArray: updatedFilters,
    nameArray: onlyFields,
  });

  return { updatedFilters: sortFields, updatedFilterValue: filterValue };
}

const FilterSection: React.FC<FilterSectionProps> = ({
  t,
  staticFormData,
  fields,
  selectedValues,
  onChange,
  showMore,
  setShowMore,
  isShowStaticFilterValue,
  isOpenColapsed,
}) => {
  return (
    <Box>
      {fields?.map((field, idx) => {
        const values = field.options ?? field.range ?? [];
        const code = field.code;
        const selected = selectedValues[code] ?? [];
        const optionsToShow = showMore.includes(code)
          ? values
          : values.slice(0, 3);
        const staticValues = Array.isArray(staticFormData?.[code])
          ? staticFormData[code]
          : [];
        if (Array.isArray(staticValues) && staticValues.length > 0) {
          if (!isShowStaticFilterValue) {
            return null;
          }
          return (
            <Box
              key={`${code}-${idx}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                px: 1,
                pb: 1,
              }}
            >
              <Typography
                /* @ts-ignore */
                variant="body5"
                component="div"
                sx={{ fontWeight: '500', color: '#181D27' }}
              >
                <SpeakableText>{field.name}</SpeakableText>
              </Typography>
              {staticValues.map((item: any, idx: number) => (
                <Chip
                  key={`${code}-chip-${idx}`}
                  label={item.name ?? item}
                  sx={{ fontSize: '12px' }}
                />
              ))}
            </Box>
          );
        } else {
          return (
            <Accordion
              defaultExpanded={
                Array.isArray(isOpenColapsed)
                  ? isOpenColapsed.includes(code)
                  : isOpenColapsed
              }
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
                  /* @ts-ignore */
                  variant="body5"
                  component="div"
                  sx={{ fontWeight: '500', color: '#181D27' }}
                >
                  <SpeakableText>
                    {field.name === 'Sub Domain' ? 'Category' : field.name}
                    {/* {field?.options && field?.options?.length} */}
                  </SpeakableText>
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
                                      !(
                                        (s && item && s === item) ||
                                        (s && item.code && s === item?.code) ||
                                        (s && item?.name && s === item?.name) ||
                                        (s?.code &&
                                          item.code &&
                                          s?.code === item?.code) ||
                                        (s?.name &&
                                          item?.name &&
                                          s?.name === item?.name)
                                      )
                                  );
                              onChange(code, next);
                            }}
                          />
                        }
                        label={
                          <SpeakableText>{item.name ?? item}</SpeakableText>
                        }
                        sx={{
                          color: '#414651',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      />
                    );
                  })}
                </FormGroup>
                {values.length > 3 && !staticValues.length && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() =>
                      setShowMore((prev: string[]) =>
                        prev.includes(code)
                          ? prev.filter((c) => c !== code)
                          : [...prev, code]
                      )
                    }
                    sx={{ mt: 0 }}
                  >
                    {showMore.includes(code)
                      ? t('COMMON.SHOW_LESS')
                      : t('COMMON.SHOW_MORE')}
                  </Button>
                )}
              </AccordionDetails>
            </Accordion>
          );
        }
      })}
    </Box>
  );
};
