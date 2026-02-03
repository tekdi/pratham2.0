import CreateCenterModal from '@/components/center/CreateCenterModal';
import NoDataFound from '@/components/common/NoDataFound';
import Header from '@/components/Header';
import ManageUser from '@/components/ManageUser';
import { showToastMessage } from '@/components/Toastify';
import { getBlocksByCenterId, getCohortList } from '@/services/CohortServices';
import useStore from '@/store/store';
import {
  CenterType,
  Role,
  Telemetry,
  TelemetryEventType,
  FormContext,
  FormContextType,
} from '@/utils/app.constant';
import { accessGranted, toPascalCase } from '@/utils/Helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { ArrowDropDown, Clear, Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useDirection } from '@/hooks/useDirection';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { setTimeout } from 'timers';
import { accessControl } from '../../../app.config';
import FilterModalCenter from '../blocks/components/FilterModalCenter';
import taxonomyStore from '@/store/taxonomyStore';
import { telemetryFactory } from '@/utils/telemetry';
import CenterDropdown from '@/components/CenterSelection';
import BatchList from '@/components/BatchList';
import manageUserStore from '@/store/manageUserStore';
import SimpleModal from '@/components/SimpleModalV2';
import AddEditUser from '@/components/EntityForms/AddEditUser/AddEditUser';
import { fetchForm } from '@/components/DynamicForm/DynamicFormCallback';

const toUpperString = (value: unknown) =>
  typeof value === 'string' ? value.toUpperCase() : '';

const asString = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'value' in (value as any)) {
    const v = (value as any).value;
    return typeof v === 'string' ? v : null;
  }
  return null;
};

const uniqStrings = (values: Array<string | null | undefined>) =>
  Array.from(new Set(values.filter((v): v is string => !!v)));

const getCustomFieldEntry = (customField: any[] | undefined, label: string) => {
  const target = label.toUpperCase();
  return (customField || []).find(
    (item) => toUpperString(item?.label) === target
  );
};

const getCustomFieldValues = (customField: any[] | undefined, label: string) => {
  const entry = getCustomFieldEntry(customField, label);
  const selectedValues = Array.isArray(entry?.selectedValues)
    ? entry.selectedValues
    : [];

  // Some APIs use `value` (string) instead of `selectedValues`.
  if (selectedValues.length === 0 && entry?.value) {
    return uniqStrings([asString(entry.value)]);
  }

  return uniqStrings(selectedValues.map((v: any) => asString(v) ?? v));
};

const getCustomFieldSingleValue = (
  customField: any[] | undefined,
  label: string
) => {
  const values = getCustomFieldValues(customField, label);
  return values?.[0] || null;
};

const findCohortById = (items: any, cohortId: string): any | null => {
  if (!cohortId) return null;
  const stack: any[] = Array.isArray(items) ? [...items] : [];

  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;

    if (node?.cohortId === cohortId) return node;

    const children = Array.isArray(node?.childData) ? node.childData : [];
    for (const child of children) stack.push(child);
  }

  return null;
};

const CentersPage = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [reloadState, setReloadState] = React.useState<boolean>(false);
  const [value, setValue] = useState<number>();
  const [blockData, setBlockData] = useState<
    { bockName: string; district?: string; blockId: string; state?: string }[]
  >([]);
  const [centerData, setCenterData] = useState<
    { cohortName: string; centerType?: string; cohortId: string }[]
  >([]);
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filteredCenters, setFilteredCenters] = useState(centerData);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [centerType, setCenterType] = useState<'regular' | 'remote' | ''>('');
  const [appliedFilters, setAppliedFilters] = useState({
    centerType: '',
    sortOrder: '',
  });
  const [openCreateCenterModal, setOpenCreateCenterModal] =
    React.useState(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);
  const handleFilterModalClose = () => setFilterModalOpen(false);
  const [isBatchAdded, setIsBatchAdded] = useState(false);
  const setType = taxonomyStore((state) => state.setType);
  const store = useStore();
  const userRole = store.userRole;
  const isActiveYear = store.isActiveYearSelected;
  const [selectedCenter, setSelectedCenter] = useState('');
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
  const [batchSearchInput, setBatchSearchInput] = useState(''); // Search for batches
  const [batchLoading, setBatchLoading] = useState(false);
  const [centerList, setCenterList] = useState<any[]>([]);
  const userStore = manageUserStore();
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [baseBatchSchema, setBaseBatchSchema] = useState<any>(null);
  const [baseBatchUiSchema, setBaseBatchUiSchema] = useState<any>(null);
  const [addBatchSchema, setAddBatchSchema] = useState<any>(null);
  const [addBatchUiSchema, setAddBatchUiSchema] = useState<any>(null);
  const [emptyFormData, setEmptyFormData] = useState<any>({});
  const [batchPrefillFormData, setBatchPrefillFormData] = useState<any>({});
  const [tempVariable, setTempVariable] = useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id:
          newValue === 2 ? 'change-tab-to-facilitator' : 'change-tab-to-center',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  useEffect(() => {
    if (router.isReady) {
      const queryParamValue = router.query.tab ? Number(router.query.tab) : 1;

      if ([1, 2, 3].includes(queryParamValue)) setValue(queryParamValue);
      else setValue(1);
    }
  }, [router.isReady, router.query.tab]);

  useEffect(() => {
    // Merge existing query params with new ones
    if (router.isReady) {
      const updatedQuery = { ...router.query, tab: value };

      // Update the URL without reloading the page
      router.push(
        {
          pathname: router.pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [value]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const role = localStorage.getItem('role');
      localStorage.removeItem('overallCommonSubjects');
      setType('');
      if (role === Role.TEAM_LEADER) {
        setIsTeamLeader(true);
      } else {
        setIsTeamLeader(false);
      }
    }
  }, []);

  useEffect(() => {
    setFilteredCenters(centerData);
  }, [centerData]);

  useEffect(() => {
    const storedCenterId = localStorage.getItem('centerId');
    if (storedCenterId) {
      setSelectedCenter(storedCenterId);
    }
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      setFilteredBatches([]);
      setBatchLoading(true);
      getBlocksByCenterId(selectedCenter, centerList)
        .then((res) => {
          setFilteredBatches(res);
          setBatchLoading(false);
        })
        .catch(() => {
          setBatchLoading(false);
        });
    } else {
      setFilteredBatches([]);
    }
  }, [selectedCenter, centerList]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'search-centers',
        type: Telemetry.SEARCH,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleBatchSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBatchSearchInput(event.target.value);
  };

  const { isRTL } = useDirection();

  useEffect(() => {
    //setEmptyFormData

    function getLocationFromCustomFields(data: any): any {
      const location: any = {};

      data?.customFields?.forEach((field: any) => {
        const value = field.selectedValues?.[0]?.id?.toString();
        if (!value) return;

        switch (field.label?.toUpperCase()) {
          case 'STATE':
            location.state = [value];
            break;
          case 'DISTRICT':
            location.district = [value];
            break;
          case 'BLOCK':
            location.block = [value];
            break;
        }
      });

      return location;
    }

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const location = getLocationFromCustomFields(userData);
    // console.log('location', location);
    const base = { ...location, name: '' };
    setEmptyFormData(base);
    setBatchPrefillFormData(base);
  }, [tempVariable]);

  useEffect(() => {
    const getCohortListForTL = async () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const response = await getCohortList(userId, {
              customField: 'true',
            });
            setCenterList(response);

            if (
              accessGranted('showBlockLevelCohort', accessControl, userRole) &&
              response
            ) {
              const blockData = response.map((item: any) => {
                const blockName = toPascalCase(item.cohortName);
                const blockId = item.cohortId;
                localStorage.setItem('blockParentId', blockId);

                const stateField = item?.customField.find(
                  (field: any) => field.label === 'STATE'
                );
                const state = stateField
                  ? stateField?.selectedValues?.[0]?.value
                  : '';

                const districtField = item?.customField.find(
                  (field: any) => field.label === 'DISTRICT'
                );
                const district = districtField
                  ? districtField?.selectedValues?.[0]?.value
                  : '';
                const blockField = item?.customField.find(
                  (field: any) => field.label === 'BLOCK'
                );
                const block = blockField
                  ? blockField?.selectedValues?.[0]?.value
                  : '';
                const villageField = item?.customField.find(
                  (field: any) => field.label === 'VILLAGE'
                );
                const village = villageField
                  ? villageField?.selectedValues?.[0]?.value
                  : '';
                return { blockName, blockId, state, district, block, village };
              });
              setBlockData(blockData);
            }

            if (
              accessGranted('showBlockLevelCohort', accessControl, userRole) &&
              response
            ) {
              response.map((res: any) => {
                const centerData = res?.childData.map((child: any) => {
                  const cohortName = toPascalCase(child.name);
                  const cohortId = child.cohortId;
                  const centerTypeField = child?.customField.find(
                    (field: any) => field.label === 'TYPE_OF_COHORT'
                  );
                  const cohortStatus = child.status;
                  const centerType = centerTypeField
                    ? centerTypeField.value
                    : '';
                  return { cohortName, cohortId, centerType, cohortStatus };
                });
                setCenterData(centerData);
                localStorage.setItem('CenterList', JSON.stringify(centerData));
              });
            }

            if (
              accessGranted('showTeacherCohorts', accessControl, userRole) &&
              response
            ) {
              const cohortData = response.map((center: any) => {
                const cohortName = toPascalCase(center.cohortName);
                const cohortId = center.cohortId;
                const centerTypeField = center?.customField.find(
                  (field: any) => field.label === 'TYPE_OF_COHORT'
                );
                const centerType = centerTypeField ? centerTypeField.value : '';
                return {
                  cohortName,
                  cohortId,
                  centerType,
                  cohortStatus: center?.cohortStatus,
                };
              });

              setTimeout(() => {
                setCenterData(cohortData);
              });
            }
          }
        }
      } catch (error) {
        console.log('error', error);
        // showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      }
    };
    setCenterList([]);
    getCohortListForTL();
  }, [isTeamLeader, isBatchAdded, reloadState]);

  const handleBatchAdded = () => {
    setIsBatchAdded((prev) => !prev);
  };

  const getFilteredCenters = useMemo(() => {
    let filteredCenters = centerData;

    // Apply search filter
    if (searchInput) {
      filteredCenters = filteredCenters.filter((center) =>
        center.cohortName.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Apply center type filter
    if (centerType) {
      filteredCenters = filteredCenters.filter(
        (center) =>
          center.centerType &&
          center.centerType.toLowerCase() === centerType.toLowerCase()
      );
    }

    // Apply sorting
    if (sortOrder === 'asc') {
      filteredCenters.sort((a, b) => a.cohortName.localeCompare(b.cohortName));
    } else if (sortOrder === 'desc') {
      filteredCenters.sort((a, b) => b.cohortName.localeCompare(a.cohortName));
    }

    return filteredCenters;
  }, [centerData, searchInput, appliedFilters]);

  useEffect(() => {
    setFilteredCenters(getFilteredCenters);
  }, [getFilteredCenters]);

  const handleFilterApply = () => {
    setAppliedFilters({ centerType, sortOrder });
    setFilteredCenters(getFilteredCenters);
    handleFilterModalClose();

    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'apply-filter',
        type: TelemetryEventType.RADIO,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleCreateCenterClose = () => {
    setOpenCreateCenterModal(false);
  };

  const handleCenterChange = (cohortId: any) => {
    setSelectedCenter(cohortId);
    localStorage.setItem('centerId', cohortId);

    if (cohortId) {
      setFilteredBatches([]);
      getBlocksByCenterId(cohortId, centerList).then((res) => {
        console.log('Fetched batches:', res); // Log the fetched data
        setFilteredBatches(res);
        console.log('Filtered batches state:', res); // Log the state after update
      });
    } else {
      setFilteredBatches([]);
      console.log('Filtered batches state: []');
    }
  };

  const cloneDeep = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

  const buildBatchCreateConfigForCenter = (params: {
    baseSchema: any;
    baseUiSchema: any;
    parentId: string;
    parentName?: string | null;
    centerType: string | null;
    boards: string[];
    mediums: string[];
    grades: string[];
  }) => {
    const schema = cloneDeep(params.baseSchema);
    const uiSchema = cloneDeep(params.baseUiSchema);

    const parentSchema = schema?.properties?.parentId;
    const parentIsArray =
      parentSchema?.type === 'array' || typeof parentSchema?.items === 'object';
    const prefill: any = {
      parentId: parentIsArray ? [params.parentId] : params.parentId,
    };

    // Ensure parentId validates against schema (enum/api often comes from remote lists).
    if (schema?.properties?.parentId) {
      const parentLabel = params.parentName || 'Center';
      if (schema.properties.parentId?.api) delete schema.properties.parentId.api;
      if (schema.properties.parentId?.items?.api)
        delete schema.properties.parentId.items.api;

      if (parentIsArray) {
        schema.properties.parentId.items = {
          ...(schema.properties.parentId.items || {}),
          type: 'string',
          enum: [params.parentId],
          enumNames: [parentLabel],
        };
      } else {
        schema.properties.parentId.enum = [params.parentId];
        schema.properties.parentId.enumNames = [parentLabel];
        schema.properties.parentId.default = params.parentId;
      }
    }

    // Hide parentId since it's derived from selected center dropdown.
    uiSchema.parentId = {
      ...(uiSchema?.parentId || {}),
      'ui:widget': 'hidden',
    };

    const ensureEnabled = (key: string) => {
      if (uiSchema?.[key]?.['ui:disabled']) {
        const next = { ...(uiSchema[key] || {}) };
        delete next['ui:disabled'];
        uiSchema[key] = next;
      }
    };

    const overrideEnum = (key: 'board' | 'medium' | 'grade', allowed: any[]) => {
      const allowedValues = Array.isArray(allowed) ? allowed.filter(Boolean) : [];
      if (!allowedValues.length) {
        ensureEnabled(key);
        return;
      }

      if (!schema?.properties?.[key]) return;

      // Remove dynamic api source and restrict to center-allowed values.
      if (schema.properties[key]?.api) delete schema.properties[key].api;
      if (schema.properties[key]?.items?.api) delete schema.properties[key].items.api;

      if (schema.properties[key]?.type === 'array' || schema.properties[key]?.items) {
        schema.properties[key].items = {
          ...(schema.properties[key].items || {}),
          type: 'string',
          enum: allowedValues,
          enumNames: allowedValues,
        };
      } else {
        schema.properties[key].enum = allowedValues;
        schema.properties[key].enumNames = allowedValues;
      }

      if (allowedValues.length === 1) {
        prefill[key] =
          schema.properties[key]?.type === 'array' || schema.properties[key]?.items
            ? [allowedValues[0]]
            : allowedValues[0];
        uiSchema[key] = {
          ...(uiSchema?.[key] || {}),
          'ui:disabled': true,
        };
      } else {
        ensureEnabled(key);
      }
    };

    overrideEnum('board', params.boards);
    overrideEnum('medium', params.mediums);
    overrideEnum('grade', params.grades);

    // Batch type behavior (if supported by schema), similar to admin app.
    const ct = (params.centerType || '').toLowerCase();
    if (schema?.properties?.batch_type) {
      if (ct === 'remote') {
        schema.properties.batch_type.enum = ['remote'];
        schema.properties.batch_type.enumNames = ['REMOTE'];
        schema.properties.batch_type.default = 'remote';
        prefill.batch_type = 'remote';
        uiSchema.batch_type = {
          ...(uiSchema?.batch_type || {}),
          'ui:disabled': true,
        };
      } else if (ct === 'regular') {
        // Only restrict if enum exists; otherwise leave as-is.
        const existingEnum = Array.isArray(schema.properties.batch_type.enum)
          ? schema.properties.batch_type.enum
          : null;
        if (existingEnum) {
          const allowed = ['regular', 'contact'].filter((v) =>
            existingEnum.includes(v)
          );
          if (allowed.length) {
            schema.properties.batch_type.enum = allowed;
            schema.properties.batch_type.enumNames = allowed.map((v) =>
              v.toUpperCase()
            );
          }
        }
        ensureEnabled('batch_type');
      }
    }

    return { schema, uiSchema, prefill };
  };

  console.log('filtered batches before render:', filteredBatches);

  useEffect(() => {
    const fetchBatchFormSchema = async () => {
      const responseForm: any = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.COHORTS}&contextType=${FormContextType.BATCH}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.COHORTS}&contextType=${FormContextType.BATCH}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);

      if (responseForm?.schema && responseForm?.uiSchema) {
        // Remove unnecessary fields for batch creation
        let alterSchema = cloneDeep(responseForm?.schema);
        let requiredArray = alterSchema?.required ?? [];
        const mustRequired = [
          'name',
          'state',
          'district',
          'block',
          'village',
          'parentId',
          'board',
          'medium',
          'grade',
        ];
        // Merge only missing items from required2 into required1
        mustRequired.forEach((item) => {
          if (!requiredArray.includes(item)) {
            requiredArray.push(item);
          }
        });

        alterSchema.required = requiredArray;
        //add max selection custom
        if (alterSchema?.properties?.state) {
          alterSchema.properties.state.maxSelection = 1;
        }
        if (alterSchema?.properties?.district) {
          alterSchema.properties.district.maxSelection = 1;
        }
        if (alterSchema?.properties?.block) {
          alterSchema.properties.block.maxSelection = 1;
        }
        if (alterSchema?.properties?.village) {
          alterSchema.properties.village.maxSelection = 1;
        }
        if (alterSchema?.properties?.board) {
          alterSchema.properties.board.maxSelection = 1;
        }
        if (alterSchema?.properties?.medium) {
          alterSchema.properties.medium.maxSelection = 1;
        }
        if (alterSchema?.properties?.grade) {
          alterSchema.properties.grade.maxSelection = 1;
        }

        const hideFields = (data: any, fieldsToHide: string[]): any => {
          const updatedData = { ...data };

          fieldsToHide.forEach((field) => {
            if (updatedData[field]) {
              updatedData[field] = {
                'ui:widget': 'hidden',
              };
            }
          });

          return updatedData;
        };
        const fieldsToHide = ['state', 'district', 'block', 'village'];
        const updatedData = hideFields(responseForm?.uiSchema, fieldsToHide);
        const normalizedUi = cloneDeep(updatedData);
        const normalizedSchema = cloneDeep(alterSchema);
        setBaseBatchSchema(normalizedSchema);
        setBaseBatchUiSchema(normalizedUi);
        setAddBatchSchema(normalizedSchema);
        setAddBatchUiSchema(normalizedUi);
      }
    };

    fetchBatchFormSchema();
  }, []);

  const handleOpenAddBatchModal = () => {
    if (!selectedCenter) {
      showToastMessage(t('COMMON.PLEASE_SELECT_THE_CENTER'), 'error');
      return;
    }

    const effectiveBaseSchema = baseBatchSchema || addBatchSchema;
    const effectiveBaseUiSchema = baseBatchUiSchema || addBatchUiSchema;
    if (!effectiveBaseSchema || !effectiveBaseUiSchema) {
      showToastMessage(t('COMMON.LOADING'), 'info');
      return;
    }

    const selectedNode = findCohortById(centerList, selectedCenter);
    const cf = (selectedNode?.customField ||
      selectedNode?.customFields ||
      []) as any[];

    const boards = getCustomFieldValues(cf, 'BOARD');
    const mediums = getCustomFieldValues(cf, 'MEDIUM');
    const grades = getCustomFieldValues(cf, 'GRADE');
    const selectedCenterType =
      getCustomFieldSingleValue(cf, 'TYPE_OF_COHORT') ||
      getCustomFieldSingleValue(cf, 'TYPE_OF_CENTER');

    const { schema, uiSchema, prefill } = buildBatchCreateConfigForCenter({
      baseSchema: effectiveBaseSchema,
      baseUiSchema: effectiveBaseUiSchema,
      parentId: selectedCenter,
      parentName:
        selectedNode?.cohortName ||
        selectedNode?.name ||
        selectedNode?.cohortName,
      centerType: selectedCenterType,
      boards,
      mediums,
      grades,
    });

    setAddBatchSchema(schema);
    setAddBatchUiSchema(uiSchema);
    setBatchPrefillFormData({
      ...(emptyFormData || {}),
      ...(prefill || {}),
    });

    setOpenBatchModal(true);
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'open-add-batch-modal',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleCloseBatchModal = () => {
    setOpenBatchModal(false);
    // setIsEdit(false);
  };

  const filteredBatchList = useMemo(() => {
    if (!filteredBatches) return [];

    if (!batchSearchInput) {
      return filteredBatches; // Return all batches if search input is empty
    }

    return filteredBatches.filter((batch) => {
      if (batch.name) {
        return batch.name
          .toLowerCase()
          .includes(batchSearchInput.toLowerCase());
      }
      return false; // Or handle undefined values differently
    });
  }, [filteredBatches, batchSearchInput]);

  // Add empty form data for required props
  const emptyUserId = '';
  const emptyCallback = () => {};

  return (
    <>
      <Header />
      <Box sx={{ padding: '0' }}>
        {accessGranted('showBlockLevelData', accessControl, userRole) && (
          <Box sx={{ width: '100%' }}>
            {value && (
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                aria-label="secondary tabs example"
                sx={{
                  fontSize: '14px',
                  borderBottom: (theme) => `1px solid #EBE1D4`,
                  '& .MuiTab-root': {
                    color: theme.palette.warning['A200'],
                    padding: '0 20px',
                    flexGrow: 1,
                  },
                  '& .Mui-selected': {
                    color: theme.palette.warning['A200'],
                  },
                  '& .MuiTabs-indicator': {
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '100px',
                    height: '3px',
                  },
                  '& .MuiTabs-scroller': {
                    overflowX: 'unset !important',
                  },
                }}
              >
                <Tab value={1} label={t('COMMON.BATCHES')} />
                <Tab value={2} label={t('COMMON.FACILITATORS')} />
              </Tabs>
            )}
          </Box>
        )}

        <Box>
          {value === 1 && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 2,
                  px: 2,
                  mb: 2,
                  mt: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    value={batchSearchInput}
                    onChange={handleBatchSearchChange}
                    placeholder={t('COMMON.SEARCH')}
                    variant="outlined"
                    size="medium"
                    sx={{
                      width: {
                        xs: '100%',
                        sm: '400px',
                        md: '450px',
                      },
                      height: '48px',
                      backgroundColor: theme?.palette?.warning?.A700,
                      color: theme?.palette?.warning?.A200,
                      borderRadius: '40px',
                      pl: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiOutlinedInput-root': {
                        paddingRight: '8px',
                        borderRadius: '40px',
                        boxShadow: 'none',
                      },
                      '& .MuiInputBase-input': {
                        color: theme?.palette?.warning?.A200,
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {batchSearchInput ? (
                            <IconButton
                              onClick={() => setBatchSearchInput('')}
                              edge="end"
                              sx={{ color: theme.palette.warning['A200'] }}
                            >
                              <Clear
                                sx={{ color: theme?.palette?.warning?.['300'] }}
                              />
                            </IconButton>
                          ) : (
                            <Search
                              sx={{ color: theme?.palette?.warning?.['300'] }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  {isTeamLeader && (
                    <Button
                      sx={{
                        mt: 1.2,
                        border: '1px solid #1E1B16',
                        borderRadius: '100px',
                        height: '40px',
                        px: '16px',
                        color: theme.palette.error.contrastText,
                        alignSelf: 'flex-start',
                        '& .MuiButton-endIcon': {
                          marginLeft: isRTL
                            ? '0px !important'
                            : '8px !important',
                          marginRight: isRTL
                            ? '8px !important'
                            : '-2px !important',
                        },
                      }}
                      className="text-1E"
                      endIcon={<AddIcon />}
                      onClick={handleOpenAddBatchModal}
                    >
                      {t('COMMON.ADD_NEW')}
                    </Button>
                  )}
                </Box>
                <Box sx={{ minWidth: '300px' }}>
                  <CenterDropdown
                    cohortId={selectedCenter}
                    onChange={handleCenterChange}
                    centerList={centerList}
                    selectedCenterId={selectedCenter}
                    setSelectedCenterId={setSelectedCenter}
                  />
                </Box>
              </Box>
              {batchLoading ? (
                <Typography>Loading Batches...</Typography>
              ) : filteredBatchList && filteredBatchList.length > 0 ? (
                <BatchList
                  title={''}
                  cohortId={selectedCenter}
                  batches={filteredBatchList}
                  router={router}
                  theme={theme}
                  t={t}
                />
              ) : (
                <NoDataFound />
              )}
            </>
          )}
        </Box>
        {value === 2 ? (
          <Box>
            {/* {blockData?.length > 0 ? ( */}
            <ManageUser
              reloadState={reloadState}
              setReloadState={setReloadState}
              cohortData={blockData}
              hideSearch={true}
            />
            {/* ) : (
              <NoDataFound />
            )} */}
          </Box>
        ) : null}
      </Box>
      <FilterModalCenter
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        centers={centerData.map((center) => center.cohortName)}
        selectedCenters={selectedCenters}
        setSelectedCenters={setSelectedCenters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        centerType={centerType}
        setCenterType={setCenterType}
        onApply={handleFilterApply}
      />
      <SimpleModal
        open={openBatchModal}
        onClose={handleCloseBatchModal}
        showFooter={true}
        primaryText={t('COMMON.CREATE')}
        modalTitle={t('COMMON.NEW_BATCH')}
        id="dynamic-form-id"
      >
        <AddEditUser
          key={`${selectedCenter || 'no-center'}-batch-create`}
          SuccessCallback={() => {
            if (selectedCenter) {
              getBlocksByCenterId(selectedCenter, centerList).then((res) => {
                setFilteredBatches(res);
              });
            }
            setOpenBatchModal(false);
            handleBatchAdded();
          }}
          schema={addBatchSchema}
          uiSchema={addBatchUiSchema}
          editPrefilledFormData={batchPrefillFormData}
          isEdit={false}
          isReassign={false}
          editableUserId={emptyUserId}
          UpdateSuccessCallback={emptyCallback}
          extraFields={{
            type: CenterType.BATCH,
            parentId: selectedCenter,
          }}
          extraFieldsUpdate={{}}
          successCreateMessage="BATCH.BATCH_CREATED_SUCCESSFULLY"
          telemetryCreateKey="batch-created-successfully"
          failureCreateMessage="BATCH.BATCH_CREATE_FAILED"
          successUpdateMessage="BATCH.BATCH_UPDATED_SUCCESSFULLY"
          telemetryUpdateKey="batch-updated-successfully"
          failureUpdateMessage="BATCH.BATCH_UPDATE_FAILED"
          isNotificationRequired={false}
          notificationKey=""
          notificationMessage=""
          notificationContext={{}}
          blockFieldId=""
          districtFieldId=""
          villageFieldId=""
          centerFieldId=""
          hideSubmit={true}
          setButtonShow={() => {}}
          isSteeper={false}
          type="batch"
        />
      </SimpleModal>
    </>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default withAccessControl('accessCenters', accessControl)(CentersPage);
