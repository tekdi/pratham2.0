export type DropdownOption = { id: string; name: string };

type CatchmentBlock = { id?: string | number; name?: string };
type CatchmentDistrict = {
  districtId?: string | number;
  districtName?: string;
  blocks?: CatchmentBlock[];
};
type CatchmentState = {
  stateId?: string | number;
  stateName?: string;
  districts?: CatchmentDistrict[];
};

export type CatchmentExtractResult = {
  states: DropdownOption[];
  districtsByState: Record<string, DropdownOption[]>;
  blocksByDistrict: Record<string, DropdownOption[]>;
};

export function getCenterOptionsFromLocalStorage(): DropdownOption[] {
  if (typeof window === 'undefined') return [];
  try {
    const cohortDataString = localStorage.getItem('cohortData');
    const cohortData = cohortDataString ? JSON.parse(cohortDataString) : [];
    if (!Array.isArray(cohortData)) return [];
    return cohortData
      .map((cohort: any) => ({
        id: String(cohort?.cohortId ?? ''),
        name: String(cohort?.cohortName || cohort?.name || cohort?.cohortId || ''),
      }))
      .filter((o: DropdownOption) => o.id && o.name);
  } catch {
    return [];
  }
}

export function extractFromCenterCatchment(
  cohortData: any[],
  centerId: string
): CatchmentExtractResult {
  try {
    if (!centerId || !Array.isArray(cohortData)) {
      return { states: [], districtsByState: {}, blocksByDistrict: {} };
    }

    const cohort = cohortData.find((c: any) => String(c?.cohortId) === String(centerId));
    if (!cohort?.customField) {
      return { states: [], districtsByState: {}, blocksByDistrict: {} };
    }

    const catchmentAreaField = cohort.customField.find(
      (field: any) => field.label === 'CATCHMENT_AREA'
    );
    const selectedValues: CatchmentState[] = catchmentAreaField?.selectedValues;
    if (!selectedValues || !Array.isArray(selectedValues)) {
      return { states: [], districtsByState: {}, blocksByDistrict: {} };
    }

    const states: DropdownOption[] = [];
    const stateMap = new Map<string, true>();
    const districtsByState: Record<string, DropdownOption[]> = {};
    const blocksByDistrict: Record<string, DropdownOption[]> = {};
    const districtMap = new Map<string, true>();
    const blockMap = new Map<string, true>();

    selectedValues.forEach((state) => {
      const stateId = state?.stateId;
      const stateName = state?.stateName;
      if (stateId != null) {
        const key = String(stateId);
        if (!stateMap.has(key)) {
          states.push({ id: key, name: String(stateName ?? key) });
          stateMap.set(key, true);
          districtsByState[key] = [];
        }
      }

      if (state?.districts && Array.isArray(state.districts) && stateId != null) {
        const stateKey = String(stateId);
        state.districts.forEach((district) => {
          const districtId = district?.districtId;
          const districtName = district?.districtName;
          if (districtId != null) {
            const districtKey = `${stateKey}-${String(districtId)}`;
            if (
              !districtMap.has(districtKey) &&
              !districtsByState[stateKey]?.find((d) => String(d.id) === String(districtId))
            ) {
              districtsByState[stateKey].push({
                id: String(districtId),
                name: String(districtName ?? districtId),
              });
              districtMap.set(districtKey, true);
              blocksByDistrict[String(districtId)] = [];
            }
          }

          if (district?.blocks && Array.isArray(district.blocks) && districtId != null) {
            const distKey = String(districtId);
            district.blocks.forEach((block) => {
              const blockId = block?.id;
              const blockName = block?.name;
              if (blockId == null) return;
              const blockKey = `${distKey}-${String(blockId)}`;
              if (blockMap.has(blockKey)) return;
              if (!blocksByDistrict[distKey]) blocksByDistrict[distKey] = [];
              if (!blocksByDistrict[distKey].find((b) => String(b.id) === String(blockId))) {
                blocksByDistrict[distKey].push({
                  id: String(blockId),
                  name: String(blockName ?? blockId),
                });
              }
              blockMap.set(blockKey, true);
            });
          }
        });
      }
    });

    return { states, districtsByState, blocksByDistrict };
  } catch {
    return { states: [], districtsByState: {}, blocksByDistrict: {} };
  }
}

