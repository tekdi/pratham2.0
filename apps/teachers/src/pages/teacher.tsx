import dynamic from 'next/dynamic';
import React from 'react';

const teacher = () => {
  const mfe_scp_teacher = process.env.NEXT_PUBLIC_SCP_PROJECT;

  return (
    <div
      style={{
        margin: -10,
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <iframe
        src={mfe_scp_teacher}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Embedded Localhost"
      />
    </div>
  );
};

export default teacher;
