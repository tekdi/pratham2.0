import { Box, Stack } from '@mui/material';

interface CustomStackProps {
  data: { id: number; name: string }[];
  itemsPerRow: number;
  renderItem: (item: { id: number; name: string }) => JSX.Element;
}

export const CustomStack = ({
  data,
  itemsPerRow,
  renderItem,
}: CustomStackProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      {Array.from(
        { length: Math.ceil(data.length / itemsPerRow) },
        (_, index) => (
          <Stack key={index} direction="row" spacing={2}>
            {data
              .slice(index * itemsPerRow, index * itemsPerRow + itemsPerRow)
              .map((item, i) => renderItem(item))}
          </Stack>
        )
      )}
    </Box>
  );
};
