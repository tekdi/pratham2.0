import 'reflect-metadata';
import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
import { CircularProgress, Box } from '@mui/material';
import { handleTelemetryEventQuml } from '../../services/TelemetryService';
import { handleExitEvent } from '../utils/helper';
import { createAssessmentTracking } from '../../services/PlayerService';
import axios from 'axios';

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

  const [loadingFirst, setLoadingFirst] = useState<boolean | null>(null);

  useEffect(() => {
    if(loadingFirst==null)
    {
      setLoadingFirst(true);
    }
  }, [playerConfig]);

  useEffect(() => {

    const fetchLoad=async()=>{
      let file_content = {};
      try {
        //check if the playerConfig is valid or not
        let contentObj: any = playerConfig?.metadata;

        try {
          //downlaod here
          let childNodes = contentObj?.childNodes;
          //console.log('childNodes', childNodes);
          let removeNodes = [];
          if (contentObj?.children) {
            for (let i = 0; i < contentObj.children.length; i++) {
              if (contentObj.children[i]?.identifier) {
                removeNodes.push(contentObj.children[i].identifier);
              }
            }
          }
          //console.log('removeNodes', removeNodes);
          let identifiers = childNodes.filter(
            (item:any) => !removeNodes.includes(item)
          );
          //console.log('identifiers', identifiers);
          let questions = [];
          const chunks = [];
          let chunkSize = 10;
          for (let i = 0; i < identifiers.length; i += chunkSize) {
            chunks.push(identifiers.slice(i, i + chunkSize));
          }
          console.log('chunks', chunks);
          for (const chunk of chunks) {
            let response_question : any = await listQuestion(
              `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/question/v2/list`,
              chunk
            );
            if (response_question?.result?.questions) {
              for (
                let i = 0;
                i < response_question.result.questions.length;
                i++
              ) {
                questions.push(response_question.result.questions[i]);
              }
              //console.log('chunk', chunk);
              //console.log('response_question', response_question);
            }
          }
          console.log('questions', questions.length);
          console.log('identifiers', identifiers.length);
          if (questions.length == identifiers.length) {
            //add questions in contentObj for offline use
            let temp_contentObj = contentObj;
            if (contentObj?.children) {
              for (let i = 0; i < contentObj.children.length; i++) {
                if (contentObj.children[i]?.children) {
                  for (
                    let j = 0;
                    j < contentObj.children[i]?.children.length;
                    j++
                  ) {
                    let temp_obj = contentObj.children[i]?.children[j];
                    if (temp_obj?.identifier) {
                      // Example usage
                      const identifierToFind = temp_obj.identifier;
                      const result_question = findObjectByIdentifier(
                        questions,
                        identifierToFind
                      );
                      //replace with question
                      temp_contentObj.children[i].children[j] =
                        result_question;
                    }
                  }
                }
              }
            }
            contentObj = temp_contentObj;
            //end add questions in contentObj for offline use

            let question_result = {
              questions: questions,
              count: questions.length,
            };
            file_content = { result: question_result };
            console.log('file_content',file_content);
          }
        }
        catch(e){
        }

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
                JSON.stringify({ questions_data: file_content }),
                // JSON.stringify({ questions_data: { result: { questions: [] } } })
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

        if (playerElement.contentDocument?.readyState === 'complete') {
          // The iframe already finished its natural load while we were
          // awaiting the question-list fetches above, so call the handler
          // directly instead of forcing a second load of the player document.
          handleLoad();
        } else {
          playerElement.addEventListener('load', handleLoad);
        }

        return () => {
          playerElement.removeEventListener('load', handleLoad);
        };
      }
    }
    if(loadingFirst==true)
    {
      fetchLoad();
    }
  }, [loadingFirst]);

  const listQuestion = async (url:any, identifiers:any) => {
    let data = JSON.stringify({
      request: {
        search: {
          identifier: identifiers,
        },
      },
    });

    let api_response = null;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        api_response = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return api_response;
  };
  const findObjectByIdentifier = (array:any, identifier:any) => {
    return array.find((item:any) => item.identifier === identifier);
  };

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
        let totalDuration=localStorage.getItem('totalDuration');
        let dataTemp={...data,seconds:totalDuration};
        createAssessmentTracking({
          ...dataTemp,
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
