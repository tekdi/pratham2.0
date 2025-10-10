import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
  FormControlLabel,
} from '@mui/material';
import { getFormFields } from '@workspace/services/ContentService';
import { Publish } from '@workspace/utils/app.constant';
import React, { useEffect, useState } from 'react';
interface ConfirmActionPopupProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (checkedItems: string[], comment?:any) => void;
    actionType: any
}

const ConfirmActionPopup: React.FC<ConfirmActionPopupProps> = ({
    open,
    onClose,
    onConfirm,
    actionType,
}) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [usabilityOptions, setUsabilityOptions] = useState<string[]>([]);
    const [contentDetailsOptions, setContentDetailsOptions] = useState<string[]>([]);
     const [comment, setComment] = useState<string>('');
    const handleCheckboxChange = (item: string) => {
        setCheckedItems((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    };

    const handleClose = () => {
        setCheckedItems([]); 
        setComment(''); 
        onClose(); 
    };

    const handleConfirm = () => {
        onConfirm(checkedItems, comment);
    };

    const allOptions = [...usabilityOptions, ...contentDetailsOptions];
    const allChecked = allOptions.every((option) => checkedItems.includes(option));
    useEffect(() => {
        const fetchFields = async () => {
          try {

            if(open){

            const data = await getFormFields();
           
            const contents = data?.result?.form?.data?.fields[0]?.contents;
            let usabilityCheckList: any = [];
            let contentDetailsCheckList: any = [];
            contents.forEach((item: any) => {
              if (item.name === "Usability") {
                usabilityCheckList = item.checkList;
              } else if (item.name === "Content details") {
                contentDetailsCheckList = item.checkList;
              }
            });
            setUsabilityOptions(usabilityCheckList);
            setContentDetailsOptions(contentDetailsCheckList);
           

                 }
          } catch (err) {
            console.error("data", err);
          } finally {
          }
        };
        fetchFields();
      }, [open]);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 720,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius:'16px'
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box
                    sx={{
                        color: 'white',
                        bgcolor: '#024f9d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding:"1px 16px 1px"
                    }}
                >
                    <Typography variant="h6" sx={{
                        margin: 0,
                        fontFamily: 'inherit',
                        lineHeight: '24px',
                        fontWeight: 800,
                        fontSize: '16px',
                    }}>
                        {actionType === Publish.PUBLISH ? 'Confirm Publish Action' : 'Confirm Reject Action'}
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                <Box p={2} sx={{
                    maxHeight: '49vh',
                    minHeight: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    <Typography gutterBottom sx={{ fontSize: '14px', fontWeight: 800, lineHeight: 1.2 }}>
                        {actionType === Publish.PUBLISH
                            ? `Please confirm that ALL the following items are verified (by ticking the check-boxes) before you can ${actionType}.`
                            : 'Please select the reason(s) for rejection by ticking the checkboxes below and provide a comment to proceed with rejecting the action:'}
                    </Typography>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 800,
                  mb: 1,
                  marginLeft: '10px',
                }}
              >
                Content Details
              </Typography>
              {contentDetailsOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  sx={{ alignItems: 'flex-start', m: 0.5, '& .MuiFormControlLabel-label': { fontSize: '12px', lineHeight: 1.2, marginTop: '5px' } }}
                  control={
                    <Checkbox
                      checked={checkedItems.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      sx={{
                        color: 'black',
                        '&.Mui-checked': { color: 'black' },
                        py: 0.5,
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 800,
                  mb: 1,
                  marginLeft: '10px',
                }}
              >
                Usability
              </Typography>
              {usabilityOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  sx={{ alignItems: 'flex-start', m: 0.5, '& .MuiFormControlLabel-label': { fontSize: '12px', lineHeight: 1.2, marginTop: '5px' }}}                  
                  control={
                    <Checkbox
                      checked={checkedItems.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      sx={{
                        color: 'black',
                        '&.Mui-checked': { color: 'black' },
                        py: 0.5,
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </Grid>
          </Grid>

                    {actionType === 'reject' && (
                        <TextField
                            label="Write your comment"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    )}
                </Box>

                <Divider />


                <Box display="flex" justifyContent="flex-end" p={2}>
                    <Button onClick={handleClose} color="primary" sx={{ minWidth: 120, textTransform: 'capitalize' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        sx={{ minWidth: 120, textTransform: 'capitalize', borderRadius: '50px', ml: 2,color: 'white', backgroundColor: '#024f9d','&:hover': {backgroundColor: '#013b75'} }}
                        disabled={(comment === '' && actionType === Publish.REJECT ) || (actionType === Publish.PUBLISH  && !allChecked)}
                    >
                        {actionType === Publish.PUBLISH ? 'Publish' : 'Reject'}
                    </Button>
                </Box>
            </Box>
        </Modal>


    );
};

export default ConfirmActionPopup;


