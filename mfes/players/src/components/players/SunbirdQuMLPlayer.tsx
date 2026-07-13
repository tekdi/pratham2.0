import 'reflect-metadata';
import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
import { CircularProgress, Box } from '@mui/material';
import { handleTelemetryEventQuml } from '../../services/TelemetryService';
import { handleExitEvent } from '../utils/Helper';
import { createAssessmentTracking } from '../../services/PlayerService';

interface PlayerConfigProps {
  playerConfig: any;
  relatedData?: any;
  configFunctionality?: boolean;
}

const basePath = process.env.NEXT_PUBLIC_ASSETS_CONTENT || '/sbplayer';

const SunbirdQuMLPlayer = ({
  playerConfig,
  relatedData: { courseId, unitId, userId },
  configFunctionality,
}: PlayerConfigProps) => {
  const SunbirdQuMLPlayerRef = useRef<HTMLIFrameElement | null>(null);

  const [invalidContent, setInvalidContent] = useState<boolean | null>(null);
  const [renderContent, setRenderContent] = useState(true);

  useEffect(() => {

    try {
      //check if the playerConfig is valid or not
      let contentObj: any = playerConfig?.metadata;
      //fix for maxScore getting zero in backend then do not play the content
      let maxScore_Temp = contentObj?.maxScore;
      if (!maxScore_Temp) {
        maxScore_Temp =
          contentObj?.outcomeDeclaration?.maxScore?.defaultValue;
      }
      if (
        maxScore_Temp == 0 ||
        maxScore_Temp == null ||
        maxScore_Temp == undefined ||
        maxScore_Temp == '0'
      ) {
        setInvalidContent(true);
        setRenderContent(false);
      }
      else {
        setInvalidContent(false);
        setRenderContent(true);
      }
    }
    catch (error) {
      console.error('Error checking content:', error);
      setInvalidContent(true);
      setRenderContent(false);
    }

    const playerElement: any = SunbirdQuMLPlayerRef.current;
    if (playerElement) {
      const originalSrc = playerElement.src;
      playerElement.src = '';
      playerElement.src = originalSrc;

      const handleLoad = async () => {
        // console.log(
        //   'playerConfig',
        //   playerConfig?.metadata?.children,
        //   playerConfig?.metadata?.children.map((child: any) => child.identifier)
        // );

        // if (playerConfig?.metadata?.children) {
        // const { data } = await axios.post(
        //   `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/question/v2/list`,
        //   {
        //     request: {
        //       search: {
        //         identifier: playerConfig?.metadata?.children.map(
        //           (child: any) => child.identifier
        //         ),
        //       },
        //     },
        //   }
        // );
        // localStorage.setItem(
        //   'questions_data',
        //   JSON.stringify({ questions_data: data })
        // );
        // console.log(data, 'result');
        // }
        setTimeout(() => {
          if (
            playerElement.contentWindow &&
            playerElement.contentWindow.setData
          ) {
            playerElement.contentWindow?.localStorage.setItem(
              'questions_data',
              JSON.stringify({ questions_data: { result: { questions: [] } } })
            );
            playerElement.contentWindow?.localStorage.setItem(
              'qumlPlayerObject',
              JSON.stringify({
                qumlPlayerConfig: playerConfig,
                questionListUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/question/v2/list`,
              })
            );

            playerElement.contentWindow.setData(playerConfig);
          }
        }, 200);
      };

      playerElement.addEventListener('load', handleLoad);

      return () => {
        playerElement.removeEventListener('load', handleLoad);
      };
    }
  }, [playerConfig]);

  React.useEffect(() => {
    // The QuML player posts a `maxScore` message when the assessment is submitted.
    // Use it to tell a completed exit (→ exitLink, e.g. /reattempt-check) apart
    // from an abandoned exit (→ previousPage, e.g. /scp-dashboard).
    let isAssessmentCompleted = false;
    const handleMessage = (event: any) => {
      const data = JSON.parse(event?.data);

      // [QuML-DIAG] TEMPORARY instrumentation — remove after analysis.
      // Logs every message the embedded sunbird-quml-player posts, so we can
      // compare the exact sequence for a genuine COMPLETION vs an ABORT (Exit
      // mid-assessment). We want to find a reliable "actually finished" signal
      // (e.g. progress === 100 / all questions answered) rather than relying on
      // "a maxScore or SUMMARY message arrived", which may fire in both cases.
      try {
        const tele = data?.data ?? {};
        const edata = tele?.edata ?? {};
        const progressFromSummary = Array.isArray(edata?.summary)
          ? edata.summary.find((s: any) => s?.progress != null)?.progress
          : undefined;
        const progressFromExtra = Array.isArray(edata?.extra)
          ? edata.extra.find((e: any) => e?.id === 'progress')?.value
          : undefined;
        console.log('[QuML-DIAG] message', {
          hasMaxScore: data?.maxScore !== undefined,
          maxScore: data?.maxScore,
          eid: tele?.eid,
          edataType: edata?.type,
          mid: tele?.mid,
          progressFromSummary,
          progressFromExtra,
          payload: data,
        });
      } catch (diagErr) {
        console.log('[QuML-DIAG] could not inspect message', diagErr, event?.data);
      }

      if (data?.maxScore !== undefined) {
        isAssessmentCompleted = true;
        createAssessmentTracking({
          ...data,
          courseId,
          unitId,
          userId,
        });
      } else if (data?.data?.edata?.type === 'EXIT') {
        handleExitEvent({ preferPreviousPage: !isAssessmentCompleted });
      } else if (data?.data?.mid) {
        // An aborted assessment is never submitted, so `maxScore` /
        // createAssessmentTracking never fires. Its END/SUMMARY telemetry must NOT
        // mark the course content complete. Only forward completion telemetry once
        // the assessment has actually been submitted (isAssessmentCompleted). START
        // and other events still flow through (they record in-progress).
        const telemetryEid = data?.data?.eid;
        const isCompletionTelemetry =
          telemetryEid === 'END' || telemetryEid === 'SUMMARY';
        if (isCompletionTelemetry && !isAssessmentCompleted) {
          return;
        }
        handleTelemetryEventQuml(data, {
          courseId,
          unitId,
          userId,
          configFunctionality,
        });
      }
    };

    window.addEventListener('message', handleMessage, false);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  if (renderContent === true) {
    return (
      <iframe
        ref={SunbirdQuMLPlayerRef}
        id="contentPlayer"
        title="Content Player"
        src={`${basePath}/libs/sunbird-quml-player/index.html`}
        aria-label="Content Player"
        style={{ border: 'none' }}
        width={'100%'}
        height={'100%'}
      ></iframe>
    );
  }
  if (invalidContent === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          width: '100%',
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: '#FDBE16',
            animationDuration: '1.5s',
          }}
        />
      </Box>
    );
  }
  if (invalidContent === true) {
    return <div>Unsupported content</div>;
  }
};

export default SunbirdQuMLPlayer;
