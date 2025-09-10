import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { BaseFormProps } from '../interfaces/BaseInterface';
import AlertMessage from './AlertMessage';

/**
 * BaseForm component is a reusable form layout that includes a header, fields, and a submit button.
 * It can display loading, error, and success states.
 *
 * @param {BaseFormProps} props - The properties for the BaseForm component.
 * @returns {JSX.Element} The rendered BaseForm component.
 */

// Serves as the baseform for both Channel and Framework Creation forms.
const BaseForm: React.FC<
  BaseFormProps & {
    extra?: React.ReactNode;
    fields: React.ReactNode;
    sectionTitle?: string;
  }
> = ({
  title,
  description,
  loading = false,
  error,
  success,
  onSubmit,
  submitText = 'Submit',
  submitIcon,
  sx = {},
  extra,
  fields,
  sectionTitle,
}) => (
  <Box
    minHeight="80vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgcolor="#f8fafc"
    py={4}
    sx={sx}
  >
    <form
      onSubmit={onSubmit}
      style={{
        width: '100%',
        maxWidth: 720,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9',
        padding: 0,
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        px={4}
        pt={4}
        pb={1.5}
        borderBottom="1px solid #f1f5f9"
      >
        <Typography variant="h2" fontWeight={700} color="text.primary">
          {title}
        </Typography>
      </Box>
      {/* Info Section */}
      <Box px={4} pt={2.5} pb={1.5}>
        {description && (
          <Typography color="text.secondary" mb={2}>
            {description}
          </Typography>
        )}
        {extra}
        {sectionTitle && (
          <Typography
            variant="subtitle2"
            color="text.secondary"
            textTransform="uppercase"
            fontWeight={600}
            letterSpacing={1}
            mb={0.5}
          >
            {sectionTitle}
          </Typography>
        )}
        {fields}
        <AlertMessage severity="error" message={error ?? ''} sx={{ mt: 2 }} />
        <AlertMessage
          severity="success"
          message={success ?? ''}
          sx={{ mt: 2 }}
        />
      </Box>
      {/* Footer Section */}
      <Divider sx={{ mt: 2, mb: 0 }} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={2}
        px={4}
        py={3}
        bgcolor="#f8fafc"
        sx={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={submitIcon}
          sx={{ px: 4, fontWeight: 600, fontSize: 16 }}
        >
          {loading ? 'Submitting...' : submitText}
        </Button>
      </Box>
    </form>
  </Box>
);

export default BaseForm;
