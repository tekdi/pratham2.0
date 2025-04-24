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
} from '@mui/material';
import { useTranslation } from '../context/LanguageContext';
import { filterContent, staticFilterContent } from '../../utils/AuthService';

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

export default function FilterList({
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
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ maxHeight: '80vh', overflow: 'auto', p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t('select_filters')}
      </Typography>

      <Stack spacing={3}>
        {renderForm.map((cat) => (
          <Box key={cat.code}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              {cat.name}
            </Typography>
            <FormGroup>
              {cat.options.map((opt) => (
                <FormControlLabel
                  key={opt.code}
                  control={
                    <Checkbox
                      checked={
                        !!formData[cat.code]?.some((o) => o.code === opt.code)
                      }
                      onChange={(e) => {
                        const prev = formData[cat.code] || [];
                        const next = e.target.checked
                          ? [...prev, opt]
                          : prev.filter((o) => o.code !== opt.code);

                        // update associations
                        replaceOptionsWithAssoc({
                          category: cat.code,
                          index: cat.index,
                          newCategoryData: next,
                        });

                        // merge back into full formData
                        setFormData((all) => ({ ...all, [cat.code]: next }));
                      }}
                    />
                  }
                  label={opt.name}
                />
              ))}
            </FormGroup>
          </Box>
        ))}

        <Typography variant="h6" fontWeight="bold">
          {t('other_filters')}
        </Typography>

        {renderStaticForm.map((field) => (
          <Box key={field.code}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              {field.name}
            </Typography>
            <FormGroup row>
              {field.range.map((r: any) => (
                <FormControlLabel
                  key={r.value}
                  control={
                    <Checkbox
                      checked={staticFormData[field.code]?.includes(r.value)}
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
          </Box>
        ))}
      </Stack>

      <Box mt={4} textAlign="right">
        <MuiButton variant="contained" onClick={handleFilter}>
          {t('filter')}
        </MuiButton>
      </Box>
    </Paper>
  );
}

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
};
