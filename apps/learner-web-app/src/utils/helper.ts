export const firstLetterInUpperCase = (label: string): string => {
  if (!label) {
    return '';
  }

  return label
    ?.split(' ')
    ?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
    ?.join(' ');
};
export const mapUserData = (userData: any) => {
  console.log(userData, 'userData');
  try {
    const getSelectedValue = (label: any) =>
      userData.customFields
        .find((f: any) => f.label === label)
        ?.selectedValues.map((v: any) => v?.id?.toString()) || '';

    const getSingleSelectedValue = (label: any) =>
      userData.customFields
        .find((f: any) => f.label === label)
        ?.selectedValues[0]?.id?.toString() || '';

    const getSingleTextValue = (label: any) =>
      userData.customFields.find((f: any) => f.label === label)
        ?.selectedValues[0] || '';

    const result: any = {
      firstName: userData.firstName || '',
      middleName: userData.middleName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      mobile: userData.mobile ? userData.mobile?.toString() : '',
      dob: userData.dob || '',
      gender: userData.gender || '',
      mother_name: getSingleTextValue('MOTHER_NAME'),
      marital_status: getSelectedValue('MARITAL_STATUS'),
      phone_type_available: getSingleSelectedValue('TYPE_OF_PHONE_AVAILABLE'),
      own_phone_check: getSingleSelectedValue('DOES_THIS_PHONE_BELONG_TO_YOU'),
      state: getSelectedValue('STATE'),
      district: getSelectedValue('DISTRICT'),
      block: getSelectedValue('BLOCK'),
      village: getSelectedValue('VILLAGE'),
      drop_out_reason: getSelectedValue('REASON_FOR_DROP_OUT_FROM_SCHOOL'), // array
      work_domain: getSelectedValue(
        'ARE_YOU_CURRENTLY_WORKING_IF_YES_CHOOSE_THE_DOMAIN'
      ),
      what_do_you_want_to_become: getSingleTextValue(
        'WHAT_DO_YOU_WANT_TO_BECOME'
      ),
      class: getSelectedValue(
        'HIGHEST_EDCATIONAL_QUALIFICATION_OR_LAST_PASSED_GRADE'
      ), // string

      preferred_mode_of_learning: getSelectedValue(
        'WHAT_IS_YOUR_PREFERRED_MODE_OF_LEARNING'
      ),
    };

    if (userData.guardian_name) {
      result.guardian_name = userData.guardian_name || '';
    }
    if (userData.guardian_relation) {
      result.guardian_relation = userData.guardian_relation || '';
    }
    if (userData.parent_phone) {
      result.parent_phone = userData.parent_phone || '';
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

// Usage
export const getMissingFields = (schema: any, userData: any) => {
  try {
    // use mapped data instead of raw userData
    const mappedUserData = mapUserData(userData);
    console.log(mappedUserData, 'mappedUserData');
    console.log(schema, 'schema');

    const isEmpty = (value: any) => {
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
      );
    };

    const clonedSchema = JSON.parse(JSON.stringify(schema));

    const fieldsToRemove = [
      'password',
      'confirm_password',
      'username',
      'program',
      'batch',
      'center',
      'state',
      'district',
      'block',
      'village',
    ];

    fieldsToRemove.forEach((field) => {
      delete clonedSchema.properties[field];
    });

    if (Array.isArray(clonedSchema.required)) {
      clonedSchema.required = clonedSchema.required.filter(
        (field: any) => !fieldsToRemove.includes(field)
      );
    }

    const guardianFields = [
      'guardian_name',
      'guardian_relation',
      'parent_phone',
    ];

    const result: any = {
      type: clonedSchema.type,
      properties: {},
      required: [],
    };

    // Check keys using mappedUserData
    Object.keys(clonedSchema.properties).forEach((key) => {
      if (!(key in mappedUserData) || isEmpty(mappedUserData[key])) {
        result.properties[key] = clonedSchema.properties[key];
      }
    });

    if (Array.isArray(clonedSchema.required)) {
      result.required = clonedSchema.required.filter(
        (field: any) =>
          !(field in mappedUserData) || isEmpty(mappedUserData[field])
      );
    }

    // const hasDOB = !!mappedUserData.dob;
    // if (hasDOB) {
    //   guardianFields.forEach((field) => {
    //     if (!mappedUserData[field] || isEmpty(mappedUserData[field])) {
    //       // Use the field from schema if available, otherwise fallback
    //       result.properties[field] = clonedSchema.properties[field] || {
    //         type: 'string',
    //         title: field.replace(/_/g, ' ').toUpperCase(),
    //       };
    //     }
    //   });
    // } else {
    //   guardianFields.forEach((field) => {
    //     if (field in result.properties) {
    //       delete result.properties[field];
    //     }
    //   });
    // }

    if (result.properties.dob) {
      guardianFields.forEach((field) => {
        if (!result.properties[field]) {
          result.properties[field] = {
            type: 'string',
            title: field.toUpperCase(),
          };
        }
      });
    } else {
      guardianFields.forEach((field) => {
        if (result.properties[field]) {
          delete result.properties[field];
        }
      });
    }

    return result;
  } catch (error) {
    console.error('Error in getMissingFields:', error);
    return null;
  }
};
export const maskMobileNumber = (mobile: string) => {
  if (mobile && mobile.length < 2) return mobile;
  else if (mobile) {
    const first = mobile[0];
    const last = mobile[mobile.length - 1];
    const masked = '*'.repeat(mobile.length - 2);
    return first + masked + last;
  }
};
export const preserveLocalStorage = () => {
  const keysToKeep = [
    'preferredLanguage',
    'mui-mode',
    'mui-color-scheme-dark',
    'mui-color-scheme-light',
    'hasSeenTutorial',
    'lang',
  ];

  const valuesToKeep: { [key: string]: any } = {};

  keysToKeep.forEach((key: string) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      valuesToKeep[key] = value;
    }
  });

  localStorage.clear();

  keysToKeep.forEach((key: string) => {
    if (valuesToKeep[key] !== undefined) {
      localStorage.setItem(key, valuesToKeep[key]);
    }
  });
};
