import { useParams } from 'next/navigation';
import React from 'react';
import { SunbirdPlayer } from '@shared-lib';
interface PlayerPageProps {
  id: string; // Define the type for the 'id' prop
}
const PlayerPage: React.FC<PlayerPageProps> = ({ id }) => {
  const params = useParams();
  const identifier = params?.identifier; // string | string[] | undefined
  if (!identifier) {
    return <div>Loading...</div>;
  }

  return <SunbirdPlayer identifier={id ? id : (identifier as string)} />;
};

export default PlayerPage;
