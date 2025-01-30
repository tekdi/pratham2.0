import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ConfirmActionPopupProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    actionType: 'publish' | 'delete' | '';
}

const ConfirmActionPopup: React.FC<ConfirmActionPopupProps> = ({
    open,
    onClose,
    onConfirm,
    actionType,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{`Confirm ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`}</DialogTitle>
            <DialogContent>
                <p>{`Are you sure you want to ${actionType} this content?`}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">No</Button>
                <Button onClick={onConfirm} color="primary">Yes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmActionPopup;
