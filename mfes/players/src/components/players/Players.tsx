import dynamic from 'next/dynamic';
import React from 'react';

const SunbirdPdfPlayer = dynamic(() => import('./SunbirdPdfPlayer'), {
  ssr: false,
});

const SunbirdVideoPlayer = dynamic(() => import('./SunbirdVideoPlayer'), {
  ssr: false,
});
const SunbirdEpubPlayer = dynamic(() => import('./SunbirdEpubPlayer'), {
  ssr: false,
});

const SunbirdQuMLPlayer = dynamic(() => import('./SunbirdQuMLPlayer'), {
  ssr: false,
});

const SunbirdV1Player = dynamic(() => import('../V1-Player/V1Player'), {
  ssr: false,
});

interface PlayerProps {
  'player-config': any;
  courseId?: string;
  unitId?: string;
  userId?: string;
  configFunctionality?: any;
  firstName?: string;
}

const SunbirdPlayers = ({
  'player-config': playerConfig,
  courseId,
  unitId,
  userId,
  configFunctionality,
  firstName,
}: PlayerProps) => {
  console.log('workspace playerconfig', playerConfig);

  const mimeType = playerConfig?.metadata?.mimeType;
  let updatedPlayerConfig = playerConfig;
  //set firname and lastname
  if (updatedPlayerConfig) {
    if (typeof updatedPlayerConfig?.context !== 'object' || updatedPlayerConfig?.context === null) {
      updatedPlayerConfig.context = {};
    }
    if (firstName) {
      updatedPlayerConfig.context.userData = { firstName: firstName, lastName: '' };
    }
    else {
      updatedPlayerConfig.context.userData = { firstName: 'Guest', lastName: 'User' };
    }
  }
  switch (mimeType) {
    case 'application/pdf':
      return (
        <SunbirdPdfPlayer
          playerConfig={updatedPlayerConfig}
          relatedData={{ courseId, unitId, userId }}
          configFunctionality={configFunctionality}
        />
      );
    case 'video/mp4':
    case 'video/webm':
    case 'audio/mp3':
    case 'audio/wav':
      return (
        <SunbirdVideoPlayer
          playerConfig={updatedPlayerConfig}
          relatedData={{ courseId, unitId, userId }}
          configFunctionality={configFunctionality}
        />
      );
    case 'application/vnd.sunbird.questionset':
      return (
        <SunbirdQuMLPlayer
          playerConfig={updatedPlayerConfig}
          relatedData={{ courseId, unitId, userId }}
          configFunctionality={configFunctionality}
        />
      );
    case 'application/epub':
      return (
        <SunbirdEpubPlayer
          playerConfig={updatedPlayerConfig}
          relatedData={{ courseId, unitId, userId }}
          configFunctionality={configFunctionality}
        />
      );
    case 'application/vnd.ekstep.h5p-archive':
    case 'application/vnd.ekstep.html-archive':
    case 'video/youtube':
    case 'video/x-youtube':
      //case 'application/vnd.ekstep.ecml-archive':
      return (
        <SunbirdV1Player
          playerConfig={updatedPlayerConfig}
          relatedData={{ courseId, unitId, userId }}
          configFunctionality={configFunctionality}
        />
      );
    default:
      return <div>Unsupported media type</div>;
  }
};

export default SunbirdPlayers;
