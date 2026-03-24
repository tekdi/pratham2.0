// @ts-nocheck
/**
 * RJSF-friendly widget: single-select center, then single-select batch (same API as LMPMultipleBatchListWidget).
 * Form value: one batch id (string | number | null).
 */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import axios from 'axios';
import type { WidgetProps } from '@rjsf/utils';
import { LanguageContext } from '../lib/context/LanguageContext';
// @ts-ignore — JSON default for strings when LanguageProvider is absent
import enLocale from '../lib/context/locales/en.json';

type LmpWidgetKey =
  | 'TITLE'
  | 'CENTER'
  | 'SELECT_CENTER'
  | 'NO_CENTERS_AVAILABLE'
  | 'BATCH'
  | 'SELECT_CENTER_FIRST'
  | 'LOADING_BATCHES'
  | 'SELECT_BATCH'
  | 'VALUE_NOT_IN_LIST';

function useLmpSingleBatchTranslate() {
  const langCtx = useContext(LanguageContext);
  const enMap = (enLocale as Record<string, Record<string, string>>)
    .LMP_SINGLE_BATCH_WIDGET;

  return useCallback(
    (key: LmpWidgetKey) => {
      const fullKey = `LMP_SINGLE_BATCH_WIDGET.${key}`;
      if (langCtx?.t) {
        return langCtx.t(fullKey);
      }
      return enMap?.[key] ?? fullKey;
    },
    [langCtx?.t, langCtx?.language]
  );
}

const getNestedValue = (obj: any, path: string) => {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

const BATCH_API_CONFIG = {
  url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
  method: 'POST',
  options: {
    label: 'name',
    value: 'cohortId',
    optionObj: 'result.results.cohortDetails',
  },
  payload: {
    limit: 200,
    offset: 0,
    filters: {
      type: 'BATCH',
      status: ['active'],
      parentId: '**',
    },
  },
};

export type LMPCenterOption = {
  value: string;
  label: string;
  state: string;
  district: string;
  block: string;
  village: string;
  stateId: string | number | null;
  districtId: string | number | null;
  blockId: string | number | null;
  villageId: string | number | null;
};

export type LMPBatchOption = {
  id: string | number;
  name: string;
  centerId: string;
  centerName: string;
  state?: string;
  district?: string;
  block?: string;
  village?: string;
  stateId?: string | number | null;
  districtId?: string | number | null;
  blockId?: string | number | null;
  villageId?: string | number | null;
};

export interface LMPSingleBatchListWidgetProps {
  /** Selected batch id (RJSF formData) */
  value?: string | number | null;
  onChange?: (batchId: string | number | null) => void;
  onCenterList?: (centers: LMPCenterOption[]) => void;
  /** Currently selected center (single-item array for parity with multi widget) */
  selectedCenterList?: LMPCenterOption[];
  onBatchList?: (batches: LMPBatchOption[]) => void;
  selectedBatchList?: LMPBatchOption[];
  centerList?: any[];
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  /**
   * When form value is prefilled, set this to the batch’s center id so batches load and select can show.
   */
  prefillCenterId?: string | number | null;
}

const LMPSingleBatchListWidget: React.FC<LMPSingleBatchListWidgetProps> = ({
  value = null,
  onChange,
  onCenterList,
  selectedCenterList,
  onBatchList,
  selectedBatchList,
  centerList,
  label = 'Select batch',
  required = false,
  error = false,
  helperText,
  disabled = false,
  prefillCenterId,
}) => {
  const tw = useLmpSingleBatchTranslate();
  const themeColor = '#FDBE16';
  const themeColorLight = 'rgba(253, 190, 22, 0.1)';

  const centerOptions = useMemo(() => {
    if (centerList && Array.isArray(centerList) && centerList.length > 0) {
      return centerList.map((center) => ({
        value: String(center.cohortId || center.value || center.id),
        label:
          center.name ||
          center.label ||
          `Center ${center.cohortId || center.value || center.id}`,
        state: center.state || '',
        district: center.district || '',
        block: center.block || '',
        village: center.village || '',
        stateId: center.stateId ?? null,
        districtId: center.districtId ?? null,
        blockId: center.blockId ?? null,
        villageId: center.villageId ?? null,
      }));
    }
    return [];
  }, [centerList]);

  const initialCenterFromProp = useMemo(() => {
    if (selectedCenterList?.length === 1) {
      return selectedCenterList[0].value;
    }
    if (prefillCenterId != null && prefillCenterId !== '') {
      return String(prefillCenterId);
    }
    return '';
  }, [selectedCenterList, prefillCenterId]);

  const [selectedCenterId, setSelectedCenterId] = useState<string>(
    initialCenterFromProp
  );
  const [batchOptions, setBatchOptions] = useState<LMPBatchOption[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | number | null>(
    value ?? null
  );

  // Sync center from selectedCenterList / prefill when options arrive
  useEffect(() => {
    if (initialCenterFromProp && centerOptions.some((c) => c.value === initialCenterFromProp)) {
      setSelectedCenterId((prev) =>
        prev !== initialCenterFromProp ? initialCenterFromProp : prev
      );
    }
  }, [initialCenterFromProp, centerOptions]);

  useEffect(() => {
    setSelectedBatchId(value ?? null);
  }, [value]);

  const fetchBatchesForCenter = useCallback(
    async (centerId: string) => {
      if (!centerId) {
        setBatchOptions([]);
        return;
      }
      const center = centerOptions.find((c) => c.value === centerId);
      const centerName = center?.label || '';

      setLoadingBatches(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
          tenantId: localStorage.getItem('tenantId') || '',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          academicyearid: localStorage.getItem('academicYearId') || '',
        };
        const payload = {
          ...BATCH_API_CONFIG.payload,
          filters: {
            ...BATCH_API_CONFIG.payload.filters,
            parentId: [centerId],
          },
        };
        const response = await axios.post(BATCH_API_CONFIG.url, payload, {
          headers,
        });
        const batchesData = getNestedValue(
          response.data,
          BATCH_API_CONFIG.options?.optionObj || 'result.results.cohortDetails'
        );
        const list: LMPBatchOption[] = [];
        if (batchesData && Array.isArray(batchesData)) {
          batchesData.forEach((batch: any) => {
            const batchIdRaw =
              batch[BATCH_API_CONFIG.options?.value || 'cohortId'];
            const batchId =
              typeof batchIdRaw === 'string' && isNaN(Number(batchIdRaw))
                ? batchIdRaw
                : Number(batchIdRaw);
            if (
              batchId != null &&
              batchId !== '' &&
              !(typeof batchId === 'number' && (isNaN(batchId) || batchId === 0))
            ) {
              list.push({
                id: batchId,
                name:
                  batch[BATCH_API_CONFIG.options?.label || 'name'] ||
                  `Batch ${batchId}`,
                centerId: centerId,
                centerName,
                state: center?.state || '',
                district: center?.district || '',
                block: center?.block || '',
                village: center?.village || '',
                stateId: center?.stateId ?? null,
                districtId: center?.districtId ?? null,
                blockId: center?.blockId ?? null,
                villageId: center?.villageId ?? null,
              });
            }
          });
        }
        setBatchOptions(list);
      } catch (e) {
        console.error('LMPSingleBatchListWidget: fetch batches', e);
        setBatchOptions([]);
      } finally {
        setLoadingBatches(false);
      }
    },
    [centerOptions]
  );

  useEffect(() => {
    if (selectedCenterId) {
      fetchBatchesForCenter(selectedCenterId);
    } else {
      setBatchOptions([]);
    }
  }, [selectedCenterId, fetchBatchesForCenter]);

  const notifyCenter = (centerId: string) => {
    if (!onCenterList) return;
    const c = centerOptions.find((x) => x.value === centerId);
    onCenterList(c ? [c] : []);
  };

  const handleCenterChange = (centerId: string) => {
    setSelectedCenterId(centerId);
    setSelectedBatchId(null);
    onChange?.(null);
    onBatchList?.([]);
    notifyCenter(centerId);
  };

  const handleBatchChange = (batchId: string) => {
    if (!batchId) {
      setSelectedBatchId(null);
      onChange?.(null);
      onBatchList?.([]);
      return;
    }
    const batch = batchOptions.find(
      (b) => String(b.id) === String(batchId) || b.id === batchId
    );
    const id = batch?.id ?? batchId;
    setSelectedBatchId(id);
    onChange?.(id);
    onBatchList?.(batch ? [batch] : []);
  };

  // If value exists but not in current batch list after load, still expose id to parent
  const batchSelectValue =
    selectedBatchId != null && selectedBatchId !== ''
      ? String(selectedBatchId)
      : '';

  const batchInList = batchOptions.some(
    (b) => String(b.id) === String(selectedBatchId)
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: themeColorLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BusinessIcon sx={{ fontSize: 18, color: themeColor }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {label || tw('TITLE')}
            </Typography>
          </Stack>

          <FormControl fullWidth required={required} error={error} disabled={disabled}>
            <InputLabel id="lmp-single-center-label" shrink>
              {tw('CENTER')}
            </InputLabel>
            <Select
              labelId="lmp-single-center-label"
              label={tw('CENTER')}
              notched
              value={selectedCenterId || ''}
              onChange={(e) => handleCenterChange(String(e.target.value))}
              displayEmpty
              renderValue={(selected) =>
                selected ? (
                  centerOptions.find((c) => c.value === selected)?.label ?? ''
                ) : (
                  <Box component="span" sx={{ color: 'text.secondary' }}>
                    {tw('SELECT_CENTER')}
                  </Box>
                )
              }
            >
              <MenuItem value="">
                <em>{tw('SELECT_CENTER')}</em>
              </MenuItem>
              {centerOptions.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
            {centerOptions.length === 0 && (
              <FormHelperText>{tw('NO_CENTERS_AVAILABLE')}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            required={required}
            error={error}
            disabled={disabled || !selectedCenterId || loadingBatches}
          >
            <InputLabel id="lmp-single-batch-label" shrink>
              {tw('BATCH')}
            </InputLabel>
            <Select
              labelId="lmp-single-batch-label"
              label={tw('BATCH')}
              notched
              value={batchInList ? batchSelectValue : ''}
              onChange={(e) => handleBatchChange(String(e.target.value))}
              displayEmpty
              renderValue={(selected) => {
                if (selected && batchInList) {
                  const b = batchOptions.find(
                    (x) => String(x.id) === String(selected)
                  );
                  return b?.name ?? String(selected);
                }
                const placeholder = !selectedCenterId
                  ? tw('SELECT_CENTER_FIRST')
                  : loadingBatches
                    ? tw('LOADING_BATCHES')
                    : tw('SELECT_BATCH');
                return (
                  <Box component="span" sx={{ color: 'text.secondary' }}>
                    {placeholder}
                  </Box>
                );
              }}
            >
              <MenuItem value="">
                <em>
                  {!selectedCenterId
                    ? tw('SELECT_CENTER_FIRST')
                    : loadingBatches
                      ? tw('LOADING_BATCHES')
                      : tw('SELECT_BATCH')}
                </em>
              </MenuItem>
              {batchOptions.map((b) => (
                <MenuItem key={`${b.centerId}-${b.id}`} value={String(b.id)}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
            {loadingBatches && (
              <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={14} />
                {tw('LOADING_BATCHES')}
              </FormHelperText>
            )}
            {helperText && !loadingBatches && (
              <FormHelperText>{helperText}</FormHelperText>
            )}
          </FormControl>

          {selectedBatchId != null &&
            !batchInList &&
            !loadingBatches &&
            selectedCenterId && (
              <Typography variant="caption" color="text.secondary">
                {tw('VALUE_NOT_IN_LIST')}
              </Typography>
            )}
        </Stack>
      </Paper>
    </Box>
  );
};

/** RJSF widget: pass centerList via ui:options.centerList or formContext.centerList */
export const LMPSingleBatchListRJSFWidget = (props: WidgetProps) => {
  const {
    value,
    onChange,
    required,
    disabled,
    rawErrors = [],
    label,
    uiSchema,
    formContext,
  } = props;
  const langCtx = useContext(LanguageContext);
  const enMap = (enLocale as Record<string, Record<string, string>>)
    .LMP_SINGLE_BATCH_WIDGET;
  const tw = (key: LmpWidgetKey) => {
    const fullKey = `LMP_SINGLE_BATCH_WIDGET.${key}`;
    if (langCtx?.t) return langCtx.t(fullKey);
    return enMap?.[key] ?? fullKey;
  };
  const opts = uiSchema?.['ui:options'] || {};
  const centerList =
    opts.centerList ?? formContext?.centerList ?? formContext?.myCenterList ?? [];
  const prefillCenterId =
    opts.prefillCenterId ?? formContext?.prefillCenterId ?? null;

  return (
    <LMPSingleBatchListWidget
      value={value ?? null}
      onChange={onChange}
      centerList={Array.isArray(centerList) ? centerList : []}
      prefillCenterId={prefillCenterId}
      label={typeof label === 'string' ? label : tw('TITLE')}
      required={required}
      disabled={disabled}
      error={rawErrors.length > 0}
      helperText={rawErrors.length ? rawErrors.join(', ') : undefined}
    />
  );
};

export default LMPSingleBatchListWidget;
