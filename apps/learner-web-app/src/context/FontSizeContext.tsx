import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context value type
type FontSizeContextType = {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
};

// Create context with default values
const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 1, // 1 means default (100%)
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
  resetFontSize: () => {},
});

// Custom hook to use the context
export const useFontSize = () => useContext(FontSizeContext);

// Constants for font size adjustment
const MIN_FONT_SIZE = 0.8; // 80% of the default
const MAX_FONT_SIZE = 1.4; // 140% of the default
const STEP_SIZE = 0.1; // 10% increment/decrement

// Provider component
export const FontSizeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState<number>(1);

  const increaseFontSize = () => {
    setFontSize((prevSize) => {
      const newSize = prevSize + STEP_SIZE;
      return newSize <= MAX_FONT_SIZE ? newSize : prevSize;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => {
      const newSize = prevSize - STEP_SIZE;
      return newSize >= MIN_FONT_SIZE ? newSize : prevSize;
    });
  };

  const resetFontSize = () => {
    setFontSize(1);
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

export default FontSizeContext;
