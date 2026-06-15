'use client';
import React, { useEffect, useRef, useState } from 'react';
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
  MenuItem,
  Paper,
  Popper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CommonDrawer } from '../Drawer/CommonDrawer';
import type { DrawerItemProp } from '../Drawer/CommonDrawer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SpeakableText from '../textToSpeech/SpeakableText';
import { TenantName } from '../../utils/app.constant';

interface NewDrawerItemProp extends DrawerItemProp {
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
  child?: NewDrawerItemProp[];
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
  _brand?: object;
  isColorInverted?: boolean;
  _config?: any;
  isVerticalSubmenu?: boolean;
}

export const withoutQueryString = () => {
  if (typeof window !== 'undefined') {
    const parsedUrl = new URL(window.location.href);
    return parsedUrl?.pathname + parsedUrl?.search;
  }
  return '';
};

const MULTI_COLUMN_SUBMENU_THRESHOLD = 10;
const MAX_SUBMENU_ITEMS_PER_COLUMN = 7;

/** Split submenu into columns (max 7 items each) when count exceeds threshold. */
export const getVerticalSubmenuColumns = (
  items: any[],
  useVerticalLayout: boolean
): any[][] => {
  if (!useVerticalLayout || items.length <= MULTI_COLUMN_SUBMENU_THRESHOLD) {
    return [items];
  }
  const columns: any[][] = [];
  for (let i = 0; i < items.length; i += MAX_SUBMENU_ITEMS_PER_COLUMN) {
    columns.push(items.slice(i, i + MAX_SUBMENU_ITEMS_PER_COLUMN));
  }
  return columns;
};

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
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('lang');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  const handleChange = (event: any) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    } else {
      localStorage.setItem('lang', newLanguage);
      localStorage.setItem('preferredLanguage', newLanguage);
    }
  };

  return (
    <Select
      value={selectedLanguage}
      size="small"
      onChange={handleChange}
      sx={{
        width: 'auto',
        '& .MuiSelect-select': {
          padding: '2px 0px 3px 8px',
          paddingRight: '20px !important',
        },
        '& .MuiSelect-icon': {
          width: '20px',
        },
        color: theme.palette.text.primary,
        borderRadius: '8px',
        borderWidth: 1,
        '& .Mui-selected': {
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
        },
      }}
    >
      <MuiMenuItem value="en">English</MuiMenuItem>
      {/* <MuiMenuItem value="hi">हिंदी</MuiMenuItem>
      <MuiMenuItem value="mr">मराठी</MuiMenuItem>
      <MuiMenuItem value="odi">ଓଡ଼ିଆ</MuiMenuItem>
      <MuiMenuItem value="tel">తెలుగు</MuiMenuItem>
      <MuiMenuItem value="kan">ಕನ್ನಡ</MuiMenuItem>
      <MuiMenuItem value="tam">தமிழ்</MuiMenuItem>
      <MuiMenuItem value="guj">ગુજરાતી</MuiMenuItem> */}
    </Select>
  );
};

export const DesktopBar = ({
  navLinks = [],
  rightComponent,
  isShowLang = true,
  onLanguageChange,
  _navLinkBox,
  _brand,
  isColorInverted = false,
  _config,
  isVerticalSubmenu = false,
}: AppBarProps) => {
  const [menus, setMenus] = useState<
    { anchorEl: HTMLElement | null; items: any[] }[]
  >([]);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();

  const openMenuAtLevel = (
    level: number,
    anchor: HTMLElement,
    items: any[]
  ) => {
    setMenus((prev) => {
      const next = [...prev];
      next[level] = { anchorEl: anchor, items };
      return next.slice(0, level + 1);
    });
  };

  const handleEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const handleLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setMenus([]);
    }, 300);
  };

  const handleClickLeaf = (item: any, e?: React.MouseEvent) => {
    setMenus([]);
    if (
      item.href &&
      e &&
      (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)
    ) {
      return;
    }
    if (item.href && e) {
      e.preventDefault();
    }
    if (typeof item.to === 'function') item.to(e);
    else if (typeof item.to === 'string') window.location.href = item.to;
  };

  const getNavHref = (link: NewDrawerItemProp) =>
    link.href ?? (typeof link.to === 'string' ? link.to : undefined);

  const isModifiedNavClick = (e: React.MouseEvent) =>
    e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Brand {..._brand} />
      {_config?.middleComponent && _config.middleComponent}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ..._navLinkBox,
        }}
      >
        {navLinks.map((link, index) => (
          <Box key={`${link.title}-${index}`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            sx={{ display: 'inline-block', position: 'relative' }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
            // Removed onMouseEnter from here
            >
              <Button
                component={getNavHref(link) ? 'a' : 'button'}
                href={getNavHref(link)}
                // @ts-ignore
                variant={
                  link.isActive
                    ? 'top-bar-link-button'
                    : link.variant ?? 'top-bar-link-text'
                }
                sx={{
                  minWidth: 'unset',
                  mr: -0.5, // Slightly reduce margin to bring icon closer
                  ...(getNavHref(link)
                    ? { textDecoration: 'none', color: 'inherit' }
                    : {}),
                }}
                startIcon={link?.icon && link.icon}
                onClick={(e: any) => {
                  if (getNavHref(link) && isModifiedNavClick(e)) {
                    return;
                  }
                  if (getNavHref(link)) {
                    e.preventDefault();
                  }
                  if (typeof link.to !== 'string' && link.to !== undefined) {
                    link.to(e);
                  } else if (link.to === undefined) {
                    openMenuAtLevel(0, e.currentTarget, link.child ?? []);
                  }
                }}
                onMouseEnter={(e: any) => {
                  if (link.child && link.child.length > 0) {
                    openMenuAtLevel(0, e.currentTarget, link.child);
                  } else {
                    setMenus([]); // Close all menus if no children
                  }
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: '#1F1B13',
                    cursor: 'pointer',
                    maxWidth: 'fit-content',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  data-speech-control="true"
                >
                  <SpeakableText cursor={true}>{link.title}</SpeakableText>
                </Typography>
              </Button>
              {link.child && (
                <IconButton
                  size="small"
                  sx={{ ml: -0.5 }} // Slightly reduce left margin
                  onClick={(e) => {
                    e.stopPropagation();
                    openMenuAtLevel(0, e.currentTarget, link?.child ?? []);
                  }}
                  onMouseEnter={(e) => {
                    if (link.child && link.child.length > 0) {
                      openMenuAtLevel(0, e.currentTarget, link.child);
                    } else {
                      setMenus([]); // Close all menus if no children
                    }
                  }}
                >
                  <ArrowDropDownIcon
                    fontSize="small"
                    sx={{ color: isColorInverted ? '#fff' : 'inherit' }}
                  />
                </IconButton>
              )}
            </Box>
            {/* Popper for this nav item */}
            {menus[0] && menus[0].anchorEl === document.activeElement && (
              <></>
            )}
            {menus[0] && menus[0].anchorEl === document.activeElement && (
              <></>
            )}
            {menus[0] && menus[0].anchorEl === document.activeElement && (
              <></>
            )}
            {menus[0] && menus[0].anchorEl === document.activeElement && (
              <></>
            )}
            {/* Render Popper for this nav item if open */}
            {menus[0] && menus[0].anchorEl === document.activeElement && (
              <></>
            )}
          </Box>
        ))}

        {(rightComponent || isShowLang) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {rightComponent}
            {isShowLang && (
              <LanguageSelect onLanguageChange={onLanguageChange} />
            )}
          </Box>
        )}
      </Box>

      {menus.map((menu, level) => (
        <Popper
          key={`menu-${level}`}
          open={Boolean(menu.anchorEl)}
          anchorEl={menu.anchorEl}
          placement="bottom"
          disablePortal
          // Removed onMouseEnter/onMouseLeave from here
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ]}
          sx={{
            zIndex: 1300 + level,
            mt: level === 0 ? 0.5 : 0,
          }}
        >
          <Paper elevation={3} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {(() => {
              const columns = getVerticalSubmenuColumns(
                menu.items,
                isVerticalSubmenu
              );
              const useMultiColumn =
                isVerticalSubmenu && columns.length > 1;

              const renderSubmenuItem = (item: any, idx: number, colIdx: number) => {
                const hasChild =
                  Array.isArray(item.child) && item.child.length > 0;
                return (
                  <Box
                    key={`${colIdx}-${idx}-${item.label ?? item.title}`}
                    onMouseEnter={(e) => {
                      if (hasChild) {
                        openMenuAtLevel(level + 1, e.currentTarget, item.child);
                      } else {
                        setMenus((prev) => prev.slice(0, level + 1));
                      }
                    }}
                    sx={{
                      bgcolor:
                        typeof item.isActive === 'boolean'
                          ? item.isActive
                            ? theme.palette.primary.main
                            : 'inherit'
                          : item?.isActive?.replaceAll(' ', '%20') ===
                            withoutQueryString()
                            ? theme.palette.primary.main
                            : 'inherit',
                    }}
                  >
                    <MenuItem
                      component={!hasChild && item.href ? 'a' : 'li'}
                      href={!hasChild ? item.href : undefined}
                      onClick={(e) => {
                        if (!hasChild) handleClickLeaf(item, e);
                      }}
                      sx={{
                        justifyContent: 'space-between',
                        whiteSpace: isVerticalSubmenu ? 'normal' : 'nowrap',
                        ...(!hasChild && item.href
                          ? { textDecoration: 'none', color: 'inherit' }
                          : {}),
                        ...(isVerticalSubmenu
                          ? {
                              py: 2,
                              px: 2,
                              minHeight: 40,
                            }
                          : {
                              py: 3,
                            }),
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: '#1F1B13',
                          cursor: 'pointer',
                        }}
                        data-speech-control="true"
                      >
                        <SpeakableText cursor={true}>
                          {item.title}
                        </SpeakableText>
                      </Typography>
                      {hasChild && (
                        <ArrowDropDownIcon
                          fontSize="small"
                          sx={{ color: isColorInverted ? '#fff' : 'inherit' }}
                        />
                      )}
                    </MenuItem>
                  </Box>
                );
              };

              return (
                <Box
                  display="flex"
                  flexDirection={
                    useMultiColumn
                      ? 'row'
                      : isVerticalSubmenu
                        ? 'column'
                        : 'row'
                  }
                  flexWrap={isVerticalSubmenu && !useMultiColumn ? 'nowrap' : 'wrap'}
                  gap={useMultiColumn ? 3 : 0}
                  alignItems="flex-start"
                  sx={useMultiColumn ? { px: 1, py: 0.5 } : undefined}
                >
                  {columns.map((columnItems, colIdx) => (
                    <Box
                      key={`submenu-col-${colIdx}`}
                      display="flex"
                      flexDirection="column"
                      sx={
                        useMultiColumn
                          ? {
                              minWidth: 200,
                              maxWidth: 280,
                              flex: '1 1 0',
                            }
                          : undefined
                      }
                    >
                      {columnItems.map((item, idx) =>
                        renderSubmenuItem(item, idx, colIdx)
                      )}
                    </Box>
                  ))}
                </Box>
              );
            })()}
          </Paper>
        </Popper>
      ))}
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
  _brand,
}: AppBarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        color: '#1F1B13',
      }}
    >
      {!showBackIcon ? (
        <>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={(e) => setIsDrawerOpen(true)}
          >
            <MenuIcon sx={{ cursor: 'pointer', color: '#1F1B13' }} />
          </IconButton>
          <Brand {..._brand} name={''} />
          {/* {!isShowLang && <Box />} */}
        </>
      ) : (
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
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'left', fontWeight: 500 }}
          >
            <SpeakableText>{title}</SpeakableText>
          </Typography>
        </>
      )}
      {isShowLang && <LanguageSelect onLanguageChange={onLanguageChange} />}
      <CommonDrawer
        open={isDrawerOpen}
        onDrawerClose={() => setIsDrawerOpen(false)}
        items={navLinks}
        topElement={<Brand {..._brand} />}
      />
    </Box>
  );
};

const Brand = ({
  _box,
  name = 'Pratham',
  logo = '/logo.png',
}: {
  _box?: any;
  name?: string;
  logo?: string;
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} {..._box}>
      {_box?.brandlogo ?? (
        <>
          <img src={logo} alt={TenantName.YOUTHNET} style={{ height: '40px' }} />
          {name && (
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                ...(_box?._text ?? {}),
              }}
            >
              <SpeakableText>{name}</SpeakableText>
            </Typography>
          )}
          {_box?.children}
        </>
      )}
    </Box>
  );
};
