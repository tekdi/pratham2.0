import React, { useRef, useEffect } from 'react';
import { getTelemetryEvents } from '../../services/TelemetryService';
import { handleExitEvent } from '../utils/Helper';

interface PlayerConfigProps {
  playerConfig: any;
  relatedData?: any;
}

const basePath = process.env.NEXT_PUBLIC_ASSETS_CONTENT || '/sbplayer';

const SunbirdPdfPlayer = ({
  playerConfig,
  relatedData: { courseId, unitId, userId },
}: PlayerConfigProps) => {
  const sunbirdPdfPlayerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const playerElement: any = sunbirdPdfPlayerRef.current;
    if (playerElement) {
      const originalSrc = playerElement.src;
      playerElement.src = '';
      playerElement.src = originalSrc;

      const handleLoad = () => {
        setTimeout(() => {
          if (
            playerElement.contentWindow &&
            playerElement.contentWindow.setData
          ) {
            // playerElement.contentWindow.setData(playerConfig);
            const pdfElement = document.createElement('sunbird-pdf-player');
            pdfElement.setAttribute(
              'player-config',
              JSON.stringify(playerConfig)
            );
            pdfElement.addEventListener('playerEvent', (event: any) => {
              if (event?.detail?.edata?.type === 'EXIT') {
                event.preventDefault();
                handleExitEvent();
              }
            });
            pdfElement.addEventListener(
              'telemetryEvent',
              async (event: any) => {
                console.log('On telemetryEvent', event);
                try {
                  await getTelemetryEvents(event.detail, 'pdf', {
                    courseId,
                    unitId,
                    userId,
                  });
                } catch (error) {
                  console.error('Error submitting assessment:', error);
                }
              }
            );

            const myPlayer =
              playerElement.contentDocument.getElementById('my-player');
            if (myPlayer) {
              myPlayer.appendChild(pdfElement);
            }
          }
        }, 200);
      };

      playerElement.addEventListener('load', handleLoad);

      return () => {
        playerElement.removeEventListener('load', handleLoad);
      };
    }
  }, [playerConfig]);

  return (
    <iframe
      ref={sunbirdPdfPlayerRef}
      id="contentPlayer"
      title="Content Player"
      src={`${basePath}/libs/sunbird-pdf-player/index.html`}
      aria-label="Content Player"
      style={{ border: 'none' }}
      width={'100%'}
      height={'100%'}
    ></iframe>
  );
};

export default SunbirdPdfPlayer;
