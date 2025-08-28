import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
} from '@mui/material';
import type { AssociationModalData } from '../../interfaces/AssociationInterface';

interface AssociationModalProps {
  open: boolean;
  onClose: () => void;
  modalData: AssociationModalData;
}

const AssociationModal: React.FC<AssociationModalProps> = ({
  open,
  onClose,
  modalData,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h2" component="div">
          Associations for{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {modalData.term?.name}
          </Box>{' '}
          in{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {modalData.assocCategory?.name}
          </Box>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mt: 1 }}>
          {modalData.assocTerms.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No associated terms in this category.
            </Typography>
          ) : (
            <Box component="ul" sx={{ pl: 2, m: 0, listStyleType: 'disc' }}>
              {modalData.assocTerms.map((assoc) => (
                <Typography
                  component="li"
                  key={assoc.code}
                  sx={{
                    mb: 1,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: 'text.primary',
                  }}
                >
                  {assoc.name}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssociationModal;
