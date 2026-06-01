//Function to convert names in capitalize case
export const toPascalCase = (name: string | any) => {
  if (typeof name !== 'string') {
    return name;
  }

  return name
    ?.toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatDate = (dateString: string) => {
  if (dateString) {
    const dateOnly = dateString?.split('T')[0];
    const [year, monthIndex, day] = dateOnly.split('-');
    const MONTHS = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const month = MONTHS[parseInt(monthIndex, 10) - 1];
    return `${day} ${month}, ${year}`;
  }
};

export const transformLabel = (label: string): string => {
  if (typeof label !== 'string') {
    return label;
  }
  return label
    ?.toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const firstLetterInUpperCase = (label: string): string => {
  if (!label) {
    return '';
  }

  return label
    ?.split(' ')
    ?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
    ?.join(' ');
};

