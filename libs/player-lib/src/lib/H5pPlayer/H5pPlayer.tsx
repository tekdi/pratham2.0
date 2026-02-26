import React, { useRef, useEffect } from 'react';
import {
  getTelemetryEvents,
  handleExitEvent,
} from '../../../../mfes/players/src/services/TelemetryService';

interface PlayerProps {
  playerConfig: any;
  relatedData?: { courseId?: string; unitId?: string; userId?: string };
  configFunctionality?: any;
}

const basePath =
  typeof process !== 'undefined'
    ? (process.env?.NEXT_PUBLIC_ASSETS_CONTENT ?? '/sbplayer')
    : '/sbplayer';

const H5pPlayer: React.FC<PlayerProps> = ({
  playerConfig,
  relatedData = {},
  configFunctionality,
}) => {
  const playerRef = useRef<HTMLElement | null>(null);
  const { courseId, unitId, userId } = relatedData;

  // Dynamically import the Web Component (SSR-safe; registers <sunbird-h5p-player>).
  useEffect(() => {
    import('sunbird-h5p-player').catch(console.error);
  }, []);

  // Set playerConfig as a JS property — Lit @property({type: Object}) cannot be set as HTML attribute.
  useEffect(() => {
    const el = playerRef.current;
    if (!el || !playerConfig) return;

    // Inject Next.js basePath-aware H5P asset paths.
    const enrichedConfig = {
      ...playerConfig,
      config: {
        ...playerConfig.config,
        h5pOptions: {
          librariesPath: `${basePath}/h5p-libraries`,
          frameJs: `${basePath}/h5p-standalone-assets/frame.bundle.js`,
          frameCss: `${basePath}/h5p-standalone-assets/h5p.css`,
          ...(playerConfig.config?.h5pOptions || {}),
        },
      },
    };

    (el as any).playerConfig = enrichedConfig;
  }, [playerConfig]);

  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;

    // telemetryEvent → existing getTelemetryEvents pipeline (same 'v1' type for tracking compat)
    const handleTelemetry = async (event: any) => {
      console.log('H5P player telemetry event ===>', event);
      await getTelemetryEvents(event.detail, 'v1', {
        courseId,
        unitId,
        userId,
        configFunctionality,
      });
    };

    // playerEvent EXIT → handleExitEvent
    const handlePlayer = (event: any) => {
      console.log('H5P player event ===>', event.detail);
      const action = event?.detail?.action || event?.detail?.edata?.type;
      if (action === 'exit' || action === 'EXIT') {
        handleExitEvent();
      }
    };

    el.addEventListener('telemetryEvent', handleTelemetry);
    el.addEventListener('playerEvent', handlePlayer);
    return () => {
      el.removeEventListener('telemetryEvent', handleTelemetry);
      el.removeEventListener('playerEvent', handlePlayer);
    };
  }, [courseId, unitId, userId, configFunctionality]);

  return (
    <sunbird-h5p-player
      ref={playerRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
};

export default H5pPlayer;
