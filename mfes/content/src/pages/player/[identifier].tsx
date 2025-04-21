import { useParams } from 'next/navigation';
import React from 'react';
interface PlayerPageProps {
  id?: string; // Define the type for the 'id' prop
}
const PlayerPage: React.FC<PlayerPageProps> = ({ id }) => {
  const params = useParams();
  const identifier = params?.identifier; // string | string[] | undefined
  if (!identifier) {
    return <div>Loading...</div>;
  }

  return (
    <iframe
      src={`/sbplayer?identifier=${id ? id : (identifier as string)}`}
      style={{
        // display: 'block',
        // padding: 0,
        border: 'none',
      }}
      width="100%"
      height="100%"
      title="Embedded Localhost"
    />
  );
};

export default PlayerPage;
