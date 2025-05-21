import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useFontSize } from './FontSizeContext';
import { Theme } from '@mui/material/styles';
import './FontSize.css';

interface FontSizeThemeProps {
  children: React.ReactNode;
  baseTheme: Theme;
}

const FontSizeTheme: React.FC<FontSizeThemeProps> = ({
  children,
  baseTheme,
}) => {
  const { fontSize } = useFontSize();

  // Apply fontSize scale to the document
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-size-scale',
      fontSize.toString()
    );
  }, [fontSize]);

  return <ThemeProvider theme={baseTheme}>{children}</ThemeProvider>;
};

export default FontSizeTheme;
