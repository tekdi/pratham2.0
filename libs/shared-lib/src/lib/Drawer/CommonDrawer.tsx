import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTranslation } from '../context/LanguageContext';

export interface DrawerItemProp {
  title: string | JSX.Element | ReturnType<typeof useTranslation>['t'];
  icon?: JSX.Element | React.ReactNode;
  to: string | ((event: React.MouseEvent<HTMLAnchorElement>) => void);
}

interface CommonDrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  items: DrawerItemProp[];
  onItemClick: (to: string) => void;
  topElement?: React.ReactNode;
  bottomElement?: React.ReactNode;
}

export const CommonDrawer: React.FC<CommonDrawerProps> = ({
  open,
  onDrawerClose,
  items,
  onItemClick,
  topElement,
  bottomElement,
}) => {
  return (
    <Drawer anchor="left" open={open} onClose={onDrawerClose}>
      <Box sx={{ padding: '16px' }}>{topElement}</Box>
      <List>
        {items.map((item, index) => (
          <ListItemButton
            key={item.title + index}
            onClick={() => onItemClick(item.to)}
          >
            {item.icon && (
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
            )}
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
      {bottomElement}
    </Drawer>
  );
};
