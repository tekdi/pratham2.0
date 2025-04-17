import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem as MuiMenuItem,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CommonDrawer, DrawerItemProp } from '../Drawer/CommonDrawer';

interface NewDrawerItemProp extends DrawerItemProp {
  text: string;
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
}
export interface AppBarProps {
  title?: string;
  showBackIcon?: boolean;
  backIconClick?: () => void;
  actionButtonLabel?: string;
  actionButtonClick?: () => void;
  actionButtonColor?: 'inherit' | 'primary' | 'secondary' | 'default';
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  color?: 'primary' | 'secondary' | 'default' | 'transparent' | 'inherit';
  bgcolor?: string;
  navLinks?: NewDrawerItemProp[];
  rightComponent?: React.ReactNode;
  isShowLang?: boolean;
  onLanguageChange?: (lang: string) => void;
  _navLinkBox?: React.CSSProperties;
}

export const TopAppBar: React.FC<AppBarProps> = ({
  title = 'Title',
  showBackIcon = false,
  backIconClick,
  navLinks = [],
  rightComponent,
  isShowLang = true,
  onLanguageChange,
  ...props
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <MobileTopBar
            {...props}
            navLinks={navLinks}
            showBackIcon={showBackIcon}
            backIconClick={backIconClick}
            title={title}
            isShowLang={isShowLang}
            onLanguageChange={onLanguageChange}
          />
          {/* xs is for mobile and md is for desktop */}
          <DesktopBar
            {...props}
            navLinks={navLinks}
            rightComponent={rightComponent}
            isShowLang={isShowLang}
            onLanguageChange={onLanguageChange}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const LanguageSelect = ({
  onLanguageChange,
}: {
  onLanguageChange?: (value: string) => void;
}) => {
  const theme = useTheme();
  return (
    <Select
      defaultValue="EN"
      size="small"
      onChange={(e) => onLanguageChange?.(e.target.value)}
      sx={{
        minWidth: 80,
        height: 40,
        color: theme.palette.text.primary,
      }}
    >
      <MuiMenuItem value="EN">EN</MuiMenuItem>
      <MuiMenuItem value="HI">HI</MuiMenuItem>
    </Select>
  );
};

const DesktopBar = ({
  navLinks = [],
  rightComponent,
  isShowLang = true,
  onLanguageChange,
  _navLinkBox,
}: AppBarProps) => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Brand />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'center',
          ..._navLinkBox,
        }}
      >
        {navLinks.map((link, index) => {
          return (
            <Button
              key={index}
              variant={
                link.variant ||
                (link.isActive ? 'top-bar-link-button' : 'top-bar-link-text')
              }
              startIcon={link?.icon && <link.icon />}
              onClick={
                typeof link.to === 'string'
                  ? undefined
                  : (link.to as (
                      event: React.MouseEvent<HTMLAnchorElement>
                    ) => void)
              }
            >
              {link.title}
            </Button>
          );
        })}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {rightComponent}
          {isShowLang && <LanguageSelect onLanguageChange={onLanguageChange} />}
        </Box>
      </Box>
    </Box>
  );
};

const MobileTopBar = ({
  navLinks = [],
  showBackIcon,
  backIconClick,
  title,
  isShowLang,
  onLanguageChange,
}: AppBarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {!showBackIcon && (
        <>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={(e) => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontSize: '22px',
              fontWeight: 400,
            }}
          >
            {title}
          </Typography>
        </>
      )}
      {showBackIcon && (
        <>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={backIconClick}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'left' }}
          >
            {title}
          </Typography>
        </>
      )}
      {isShowLang && <LanguageSelect onLanguageChange={onLanguageChange} />}
      <CommonDrawer
        open={isDrawerOpen}
        onDrawerClose={() => setIsDrawerOpen(false)}
        items={navLinks}
        onItemClick={(to) => {
          setIsDrawerOpen(false);
        }}
        topElement={<Brand />}
      />
    </Box>
  );
};

const Brand = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <img src="/logo.png" alt="YouthNet" style={{ height: '32px' }} />
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
        }}
      >
        YouthNet
      </Typography>
    </Box>
  );
};
