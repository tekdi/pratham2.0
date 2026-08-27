// Thin, greyish scrollbar used by the filter dropdowns (Course Type / Language / Course Name) so
// long option lists don't fall back to the browser's default thick scrollbar.
export const getThinScrollbarSx = (theme: any) => ({
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.warning['600'],
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.warning['500'],
  },
  scrollbarWidth: 'thin' as const,
  scrollbarColor: `${theme.palette.warning['600']} transparent`,
});
