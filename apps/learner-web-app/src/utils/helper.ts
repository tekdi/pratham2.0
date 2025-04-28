export const firstLetterInUpperCase = (label: string): string => {
  if (!label) {
    return '';
  }

  return label
    ?.split(' ')
    ?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
    ?.join(' ');
};
