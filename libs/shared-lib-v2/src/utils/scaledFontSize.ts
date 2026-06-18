/**
 * Scales a px font size with the global accessibility --font-size-scale variable.
 */
export function scaledFontSize(size: number | string): string {
  const px = typeof size === 'number' ? `${size}px` : size;
  if (px.includes('var(--font-size-scale')) {
    return px;
  }
  return `calc(${px} * var(--font-size-scale, 1))`;
}

/**
 * Builds MUI responsive fontSize values that respect accessibility scaling.
 */
export function scaledFontSizeResponsive(
  sizes: Record<string, number | string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(sizes).map(([breakpoint, size]) => [
      breakpoint,
      scaledFontSize(size),
    ])
  );
}
