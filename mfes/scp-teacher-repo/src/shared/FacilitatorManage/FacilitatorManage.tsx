import React, { useState, useEffect, useRef, useCallback } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import { RoleId, Status } from '@/utils/app.constant';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { debounce, forEach } from 'lodash';
import { Numbers } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import AddEditUser from '@/components/EntityForms/AddEditUser/AddEditUser';
import SimpleModal from '@/components/SimpleModalV2';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { updateCohortMemberStatus } from '@/services/CohortService/cohortService';
import editIcon from '../../public/images/editIcon.svg';
import deleteIcon from '../../public/images/deleteIcon.svg';
import Image from 'next/image';
import {
  extractMatchingKeys,
  fetchForm,
  searchListData,
} from '@/components/DynamicForm/DynamicFormCallback';
import { FormContext } from '@/components/DynamicForm/DynamicFormConstant';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import apartment from '../../public/images/apartment.svg';
import CenteredLoader from '@/components/CenteredLoader/CenteredLoader';
import FacilitatorForm from '@/components/DynamicForm/FacilitatorForm/FacilitatorForm';

const FacilitatorManage = ({ open, onClose, onFacilitatorAdded }: any) => {
  const theme = useTheme<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = React.useState<boolean>(open);
  const [isEdit, setIsEdit] = useState(false);
  const [isReassign, setIsReassign] = useState(false);
  const [editableUserId, setEditableUserId] = useState('');
  const [roleId, setRoleID] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [memberShipID, setMemberShipID] = useState('');
  const [blockFieldId, setBlockFieldId] = useState('');
  const [districtFieldId, setDistrictFieldId] = useState('');
  const [villageFieldId, setVillageFieldId] = useState('');
  // const [centerFieldId, setCenterFieldId] = useState('');

  const [userID, setUserId] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    village: '',
  });

  const { t, i18n } = useTranslation();

  const searchStoreKey = 'facilitator';

  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      const responseForm = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.facilitator.context}&contextType=${FormContext.facilitator.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.facilitator.context}&contextType=${FormContext.facilitator.contextType}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);
      console.log('responseForm', responseForm);

      //unit name is missing from required so handled from frotnend
      let alterSchema = responseForm?.schema;
      let alterUISchema = responseForm?.uiSchema;
      let requiredArray = alterSchema?.required;
      const mustRequired = ['email'];
      // Merge only missing items from required2 into required1
      mustRequired.forEach((item) => {
        if (!requiredArray.includes(item)) {
          requiredArray.push(item);
        }
      });
      alterSchema.required = requiredArray;
      //add max selection custom
      if (alterSchema?.properties?.village) {
        alterSchema.properties.village.maxSelection = 1000;
      }
      if (alterUISchema?.designation) {
        alterUISchema = {
          ...alterUISchema,
          designation: {
            ...alterUISchema.designation,
            'ui:disabled': true,
          },
        };
      }

      console.log('########### alterUISchema', alterUISchema);

      const requiredKeys = ['state', 'district', 'block'];
      //set ui schema hide
      const updatedUiSchema = { ...alterUISchema };
      // Clone each key's config and set widget to 'hidden'
      requiredKeys.forEach((key) => {
        if (updatedUiSchema.hasOwnProperty(key)) {
          updatedUiSchema[key] = {
            ...updatedUiSchema[key],
            'ui:widget': 'hidden',
          };
        }
      });
      alterUISchema = updatedUiSchema;

      const districtFieldId = responseForm?.schema.properties.district.fieldId;
      const blockFieldId = responseForm?.schema?.properties?.block.fieldId;
      const villageFieldId = responseForm?.schema?.properties?.village?.fieldId;
      // const centerFieldId = responseForm?.schema?.properties?.center?.fieldId;

      setBlockFieldId(blockFieldId);
      setDistrictFieldId(districtFieldId);
      setVillageFieldId(villageFieldId);
      // setCenterFieldId(centerFieldId)
      setAddSchema(alterSchema);
      setAddUiSchema(alterUISchema);
    };
    fetchData();
    setRoleID(RoleId.TEACHER);
    setTenantId(localStorage.getItem('tenantId'));
  }, []);

  useEffect(() => {
    if (open === true) {
      let initialFormData = {};
      if (localStorage.getItem('userData')) {
        try {
          const customFields = JSON.parse(
            localStorage.getItem('userData')
          ).customFields;

          const getSelectedValueIds = (label) => {
            const field = customFields.find(
              (f) => f.label.toLowerCase() === label.toLowerCase()
            );
            return field?.selectedValues?.map((val) => val.id.toString()) || [];
          };

          const stateIds = getSelectedValueIds('STATE');
          const districtIds = getSelectedValueIds('DISTRICT');
          const blockIds = getSelectedValueIds('BLOCK');
          const villageIds = getSelectedValueIds('VILLAGE');

          initialFormData = {
            state: stateIds,
            district: districtIds,
            block: blockIds,
            village: villageIds,
            designation: 'facilitator',
          };
        } catch (e) {}
      }
      console.log('######### setPrefilledAddFormData', initialFormData);
      setPrefilledAddFormData(initialFormData);
      setIsEdit(false);
      setIsReassign(false);
      setEditableUserId('');
      setButtonShow(true);
    }
  }, [open]);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsReassign(false);
    setIsEdit(false);
  };

  //Add Edit Props
  const extraFieldsUpdate = {};
  const extraFields = {
    tenantCohortRoleMapping: [
      {
        tenantId: tenantId,
        roleId: roleId,
      },
    ],
    username: 'scpFacilitator',
    password: Math.floor(10000 + Math.random() * 90000),
  };
  const successUpdateMessage = 'FACILITATORS.FACILITATOR_UPDATED_SUCCESSFULLY';
  const telemetryUpdateKey = 'scp-facilitator-updated-successfully';
  const failureUpdateMessage = 'COMMON.NOT_ABLE_UPDATE_FACILITATOR';
  const successCreateMessage = 'FACILITATORS.FACILITATOR_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'SCP-Facilitator-created-successfully';
  const failureCreateMessage = 'COMMON.NOT_ABLE_CREATE_FACILITATOR';
  const notificationKey = 'onFacilitatorCreated';
  const notificationMessage = 'FACILITATORS.USER_CREDENTIALS_WILL_BE_SEND_SOON';
  const notificationContext = 'USER';

  const [checked, setChecked] = useState(false);
  const [reason, setReason] = useState('');

  // console.log(response?.result?.getUserDetails , "shreyas");
  // response;
  const [buttonShow, setButtonShowState] = useState(true);

  const setButtonShow = (status) => {
    console.log('########## changed', status);
    setButtonShowState(status);
  };
  return (
    <>
      {addSchema && prefilledAddFormData && (
        <SimpleModal
          open={openModal}
          onClose={handleCloseModal}
          showFooter={buttonShow}
          primaryText={isEdit ? t('Update') : t('Next')}
          id="dynamic-form-id"
          modalTitle={
            isEdit
              ? t('FACILITATORS.EDIT_FACILITATOR')
              : isReassign
              ? t('FACILITATORS.RE_ASSIGN_facilitator')
              : t('FACILITATORS.NEW_FACILITATOR')
          }
        >
          <FacilitatorForm
            t={t}
            SuccessCallback={() => {
              onClose();
              onFacilitatorAdded();
              setOpenModal(false);
            }}
            schema={addSchema}
            uiSchema={addUiSchema}
            editPrefilledFormData={prefilledAddFormData}
            isEdit={isEdit}
            isReassign={isReassign}
            // isExtraFields={true}
            editableUserId={editableUserId}
            UpdateSuccessCallback={() => {
              setOpenModal(false);
            }}
            extraFields={extraFields}
            extraFieldsUpdate={extraFieldsUpdate}
            successUpdateMessage={successUpdateMessage}
            telemetryUpdateKey={telemetryUpdateKey}
            failureUpdateMessage={failureUpdateMessage}
            successCreateMessage={successCreateMessage}
            telemetryCreateKey={telemetryCreateKey}
            failureCreateMessage={failureCreateMessage}
            notificationKey={notificationKey}
            notificationMessage={notificationMessage}
            notificationContext={notificationContext}
            // blockFieldId={blockFieldId}
            // districtFieldId={districtFieldId}
            // villageFieldId={villageFieldId}
            // // centerFieldId={centerFieldId}
            type="facilitator"
            hideSubmit={true}
            setButtonShow={setButtonShow}
            // isSteeper={true}
          />
        </SimpleModal>
      )}
    </>
  );
};

export default FacilitatorManage;
