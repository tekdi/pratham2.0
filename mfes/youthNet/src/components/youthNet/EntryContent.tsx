import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { UserList } from './UserCard';
import UploadedFile from './UploadedFile';

type QuestionAnswer = {
  question: string;
  answer: React.ReactNode;
};

type EntryContentProps = {
  date: string;
  qaPairs: QuestionAnswer[];
};

const EntryContent: React.FC<EntryContentProps> = ({ date, qaPairs }: any) => {
  return (
    <Box>
      <Typography
        sx={{ fontSize: '12px', fontWeight: '300', fontStyle: 'italic' }}
      >
        {date}
      </Typography>
      <Divider />
      {qaPairs.map((pair: any, index: any) => (
        <Box key={index} sx={{ marginTop: '20px' }}>
          <Typography
            sx={{ fontSize: '14px', fontWeight: '500', color: 'black' }}
          >
            {pair.question}
          </Typography>
          <Box sx={{ marginTop: '8px' }}>{pair.answer}</Box>
        </Box>
      ))}
    </Box>
  );
};
export default EntryContent;