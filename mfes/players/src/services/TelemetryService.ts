import { ContentCreate, ContentType } from '../utils/Interface';
import { createContentTracking, fetchBulkContents } from './PlayerService';

const lastAccessOn = new Date().toISOString();

export const handleExitEvent = () => {
  const previousPage = sessionStorage.getItem('previousPage');
  if (previousPage) {
    window.location.href = previousPage;
  } else {
    window.history.go(-1);
  }
};

export const handlePlayerEvent = (event: any) => {
  console.log('Player Event', event.detail);
  if (event?.detail?.edata?.type === 'EXIT') {
    handleExitEvent();
  }
};

export const handleTelemetryEventPDF = (event: any) => {
  getTelemetryEvents(event.detail, 'pdf');
};

export const handleTelemetryEventQuml = (event: any) => {
  getTelemetryEvents(event.detail, 'quml');
};

export const getTelemetryEvents = (eventData: any, contentType: string) => {
  console.log(
    'getTelemetryEvents hit',
    'Telemetry Event',
    contentType,
    eventData
  );

  if (!eventData || !eventData.object || !eventData.object.id) {
    console.error('Invalid event data');
    return;
  }

  const {
    eid,
    edata,
    object: { id: identifier },
  } = eventData;
  const telemetryKey = `${contentType}_${identifier}_${eid}`;

  const telemetryData = {
    eid,
    edata,
    identifier,
    contentType,
  };

  console.log(`${eid}Telemetry`, telemetryData);

  localStorage.setItem(telemetryKey, JSON.stringify(telemetryData));

  if (eid === 'END' || (contentType === 'quml' && eid === 'SUMMARY')) {
    try {
      const detailsObject: any[] = [];

      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage);

        // Filter keys for relevant telemetry events based on identifier
        const relevantKeys = keys.filter((key) => key.includes(identifier));

        relevantKeys.forEach((key) => {
          const telemetryEvent = localStorage.getItem(key);
          if (telemetryEvent) {
            const parsedTelemetryEvent = JSON.parse(telemetryEvent);
            let progressFromSummary = null;
            let progressFromExtra = null;

            // Check `summary` for progress
            if (parsedTelemetryEvent?.edata?.summary?.length > 0) {
              progressFromSummary =
                parsedTelemetryEvent.edata.summary[0]?.progress;
            }

            // Check `extra` for progress
            if (parsedTelemetryEvent?.edata?.extra?.length > 0) {
              const progressEntry = parsedTelemetryEvent.edata.extra.find(
                (entry: any) => entry.id === 'progress'
              );
              if (progressEntry) {
                progressFromExtra = parseInt(progressEntry.value, 10);
              }
            }

            // Skip event if `eid === 'END'` and progress is not 100 in either `summary` or `extra`
            if (
              parsedTelemetryEvent?.eid === 'END' &&
              ((progressFromSummary !== 100 && progressFromSummary !== null) ||
                (progressFromExtra !== 100 && progressFromExtra !== null))
            ) {
              return;
            }

            // Push parsed telemetry event
            detailsObject.push(parsedTelemetryEvent);
          }
        });

        // After processing all keys, check if an END event exists in detailsObject for html or h5p
        let hasEndEvent = true;

        if (
          localStorage.getItem('mimeType') === ContentType.H5P ||
          localStorage.getItem('mimeType') === ContentType.HTML
        ) {
          detailsObject.forEach((event) => {
            if (event.eid === 'END') {
              hasEndEvent = false;
            }
          });
          if (!hasEndEvent) {
            detailsObject.push({
              eid: 'END',
              edata: {
                duration: 0,
                mode: 'play',
                pageid: 'sunbird-player-Endpage',
                summary: [
                  {
                    progress: 100,
                  },
                  {
                    totallength: '',
                  },
                  {
                    visitedlength: '',
                  },
                  {
                    visitedcontentend: '',
                  },
                  {
                    totalseekedlength: '',
                  },
                  {
                    endpageseen: false,
                  },
                ],
                type: 'content',
              },
            });
          }
          // });
        }
      }

      try {
        const contentWithTelemetryData = async () => {
          try {
            let resolvedMimeType = localStorage.getItem('mimeType');

            if (!resolvedMimeType) {
              const response = await fetchBulkContents([identifier]);
              resolvedMimeType = response[0]?.mimeType || '';
              if (!resolvedMimeType) {
                console.error('Failed to fetch mimeType.');
                return;
              }
            }
            let userId = '';
            if (typeof window !== 'undefined' && window.localStorage) {
              userId = localStorage.getItem('userId') ?? '';
            }
            if (userId !== undefined || userId !== '') {
              const ContentTypeReverseMap = Object.fromEntries(
                Object.entries(ContentType).map(([key, value]) => [value, key])
              );

              const reqBody: ContentCreate = {
                userId: userId,
                contentId: identifier,
                courseId: identifier,
                unitId: identifier,
                contentType: ContentTypeReverseMap[resolvedMimeType] || '',
                contentMime: resolvedMimeType,
                lastAccessOn: lastAccessOn,
                detailsObject: detailsObject,
              };
              // if (detailsObject.length > 0) {
              const response = await createContentTracking(reqBody);
              if (response) {
                console.log(response);
              }
            }
          } catch (error) {
            console.error('Error in contentWithTelemetryData:', error);
          }
          // }
        };
        contentWithTelemetryData();
      } catch (error) {
        console.log(error);
      }
      console.log('Telemetry END event successfully logged:');
    } catch (error) {
      console.error('Error logging telemetry END event:', error);
    }
  }
};
