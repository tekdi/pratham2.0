import dynamic from 'next/dynamic';
import React from 'react';

const teacher = () => {
  const mfe_scp_teacher = process.env.NEXT_PUBLIC_SCP_PROJECT;

  return (
    <div
      style={{
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <iframe
        src={mfe_scp_teacher}
        style={{
          display: 'block', // Ensures no extra space around the iframe
          margin: 0,
          padding: 0,
          width: '100vw',
          height: '100vh',
          border: 'none',
        }}
        title="Embedded Localhost"
      />
    </div>
  );
};

export default teacher;
