import { SxProps } from '@mui/material/styles';
import { SelectProps } from '@mui/material/Select';

export interface BaseFormProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  submitIcon?: React.ReactNode;
  sx?: object;
  extra?: React.ReactNode;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  sx?: SxProps;
}

export interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  selectedStatus: string[];
  onStatusChange: (status: string) => void;
  statusOptions?: string[];
  filterTitle?: string;
}

export interface SimulateApiResponse {
  url: string;
  method: string;
  data?: unknown;
  status: number;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps extends Omit<SelectProps, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export interface BatchCreationModalProps {
  open: boolean;
  title: string;
  items: Array<{ name: string; code: string; [key: string]: unknown }>;
  statuses: Array<{
    status: 'pending' | 'success' | 'failed';
    message?: string;
  }>;
  currentIndex: number;
  getItemLabel?: (item: Record<string, unknown>) => React.ReactNode;
}

export interface BatchStatusListProps {
  title: string;
  items: Array<{ name: string; code: string; [key: string]: unknown }>;
  statuses: Array<{
    status: 'pending' | 'success' | 'failed';
    message?: string;
  }>;
  onRetry: (idx: number) => void;
  typeLabel: string;
  getItemLabel?: (item: Record<string, unknown>) => React.ReactNode;
}
