import React, { useRef, useEffect, useState } from 'react';
import { getTelemetryEvents } from '../../services/TelemetryService';
import { handleExitEvent } from '../utils/Helper';

interface PlayerConfigProps {
  playerConfig: any;
  relatedData?: any;
  configFunctionality?: any;
}

const basePath = process.env.NEXT_PUBLIC_ASSETS_CONTENT || '/sbplayer';

const SunbirdVideoPlayer = ({
  playerConfig,
  relatedData: { courseId, unitId, userId },
  configFunctionality,
}: PlayerConfigProps) => {
  const sunbirdVideoPlayerRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState<string>('0vw'); // Default 16:9 aspect ratio
  const [iframeWidth, setIframeWidth] = useState<string>('100%'); // Dynamic width

  useEffect(() => {
    const playerElement: any = sunbirdVideoPlayerRef.current;
    let timeoutIds: NodeJS.Timeout[] = [];
    let observer: MutationObserver | null = null;

    if (playerElement) {
      const originalSrc = playerElement.src;
      playerElement.src = '';
      playerElement.src = originalSrc;

      const handleLoad = () => {
        const timeoutId = setTimeout(() => {
          if (
            playerElement.contentWindow &&
            playerElement.contentWindow.setData
          ) {
            // playerElement.contentWindow.setData(playerConfig);
            const videoElement = document.createElement('sunbird-video-player');
            videoElement.setAttribute(
              'player-config',
              JSON.stringify(playerConfig)
            );
            videoElement.addEventListener('playerEvent', (event: any) => {
              if (event?.detail?.edata?.type === 'EXIT') {
                event.preventDefault();
                handleExitEvent();
              }
            });
            videoElement.addEventListener(
              'telemetryEvent',
              async (event: any) => {
                console.log('On telemetryEvent', event);
                try {
                  await getTelemetryEvents(event.detail, 'video', {
                    courseId,
                    unitId,
                    userId,
                    configFunctionality,
                  });
                } catch (error) {
                  console.error('Error submitting assessment:', error);
                }
              }
            );

            const myPlayer =
              playerElement.contentDocument.getElementById('my-player');
            if (myPlayer) {
              myPlayer.appendChild(videoElement);
            }

            // Function to detect video and adjust iframe height
            const adjustIframeHeight = () => {
              try {
                const iframeDoc = playerElement.contentDocument;
                if (!iframeDoc) {
                  const retryTimeout = setTimeout(adjustIframeHeight, 500);
                  timeoutIds.push(retryTimeout);
                  return;
                }

                // Find the video element
                let video: HTMLVideoElement | null = null;
                
                // Try shadow DOM first
                const sunbirdPlayer = iframeDoc.querySelector('sunbird-video-player');
                if (sunbirdPlayer?.shadowRoot) {
                  video = sunbirdPlayer.shadowRoot.querySelector('video');
                }

                // Try direct query
                if (!video) {
                  video = iframeDoc.querySelector('video') || 
                          iframeDoc.querySelector('.video-js video') as HTMLVideoElement;
                }

                if (video) {
                  const updateHeight = () => {
                    const videoWidth = video!.videoWidth;
                    const videoHeight = video!.videoHeight;
                    const containerElement = playerElement.parentElement;
                    const availableWidth = containerElement?.offsetWidth || window.innerWidth;
                    const availableHeight = window.innerHeight;
                    
                    // Reserve space for padding/margins (approximately 40px top/bottom)
                    const reservedSpace = 0;
                    const maxAvailableHeight = availableHeight - reservedSpace;

                    if (videoWidth && videoHeight && videoWidth > 0 && videoHeight > 0 && availableWidth > 0) {
                      // Calculate aspect ratio
                      const aspectRatio = videoWidth / videoHeight;
                      
                      // Start with full available width
                      let calculatedWidth = availableWidth;
                      let calculatedHeight = calculatedWidth / aspectRatio;
                      
                      // If calculated height exceeds viewport, adjust width to fit viewport
                      if (calculatedHeight > maxAvailableHeight) {
                        // Recalculate width based on available height to fit within viewport
                        calculatedWidth = maxAvailableHeight * aspectRatio;
                        calculatedHeight = maxAvailableHeight;
                      }
                      
                      // Ensure width doesn't exceed available width
                      calculatedWidth = Math.min(calculatedWidth, availableWidth);
                      
                      // Set both width and height in pixels
                      setIframeWidth(`${calculatedWidth}px`);
                      setIframeHeight(`${calculatedHeight}px`);
                      
                      console.log('Iframe dimensions adjusted:', {
                        videoWidth,
                        videoHeight,
                        aspectRatio,
                        availableWidth,
                        availableHeight,
                        maxAvailableHeight,
                        calculatedWidth,
                        calculatedHeight,
                      });
                    }
                  };

                  // If metadata already loaded
                  if (video.readyState >= 1 && video.videoWidth > 0) {
                    updateHeight();
                  } else {
                    // Wait for metadata
                    const handleMetadata = () => {
                      if (video!.videoWidth > 0 && video!.videoHeight > 0) {
                        updateHeight();
                      }
                    };
                    
                    video.addEventListener('loadedmetadata', handleMetadata, { once: true });
                    video.addEventListener('loadeddata', handleMetadata, { once: true });
                    video.addEventListener('canplay', handleMetadata, { once: true });
                  }
                } else {
                  // Video not found, retry
                  const retryTimeout = setTimeout(adjustIframeHeight, 500);
                  timeoutIds.push(retryTimeout);
                }
              } catch (error) {
                console.error('Error adjusting iframe height:', error);
                const retryTimeout = setTimeout(adjustIframeHeight, 1000);
                timeoutIds.push(retryTimeout);
              }
            };

            // Use MutationObserver to watch for video element
            const startObserving = () => {
              try {
                const iframeDoc = playerElement.contentDocument;
                if (!iframeDoc) {
                  setTimeout(startObserving, 500);
                  return;
                }

                observer = new MutationObserver(() => {
                  adjustIframeHeight();
                });

                observer.observe(iframeDoc.body || iframeDoc.documentElement, {
                  childList: true,
                  subtree: true,
                });

                // Try immediately
                adjustIframeHeight();

                // Cleanup observer after 15 seconds
                const cleanupTimeout = setTimeout(() => {
                  if (observer) {
                    observer.disconnect();
                    observer = null;
                  }
                }, 15000);
                timeoutIds.push(cleanupTimeout);
              } catch (error) {
                console.error('Error starting observer:', error);
              }
            };

            // Start observing after a delay to allow video element to be created
            const observeTimeout = setTimeout(startObserving, 1000);
            timeoutIds.push(observeTimeout);
          }
        }, 200);
        timeoutIds.push(timeoutId);
      };

      playerElement.addEventListener('load', handleLoad);

      // Also listen for window resize to recalculate dimensions
      const handleResize = () => {
        const iframeDoc = playerElement.contentDocument;
        if (iframeDoc) {
          const video = iframeDoc.querySelector('video') as HTMLVideoElement;
          if (video && video.videoWidth > 0 && video.videoHeight > 0) {
            const aspectRatio = video.videoWidth / video.videoHeight;
            const containerElement = playerElement.parentElement;
            const availableWidth = containerElement?.offsetWidth || window.innerWidth;
            const availableHeight = window.innerHeight;
            const reservedSpace = 80;
            const maxAvailableHeight = availableHeight - reservedSpace;
            
            if (availableWidth > 0) {
              // Start with full available width
              let calculatedWidth = availableWidth;
              let calculatedHeight = calculatedWidth / aspectRatio;
              
              // If calculated height exceeds viewport, adjust width to fit viewport
              if (calculatedHeight > maxAvailableHeight) {
                calculatedWidth = maxAvailableHeight * aspectRatio;
                calculatedHeight = maxAvailableHeight;
              }
              
              // Ensure width doesn't exceed available width
              calculatedWidth = Math.min(calculatedWidth, availableWidth);
              
              // Set both width and height
              setIframeWidth(`${calculatedWidth}px`);
              setIframeHeight(`${calculatedHeight}px`);
            }
          }
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        playerElement.removeEventListener('load', handleLoad);
        window.removeEventListener('resize', handleResize);
        timeoutIds.forEach((id) => clearTimeout(id));
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [playerConfig, courseId, unitId, userId, configFunctionality]);

  return (
      <iframe
        ref={sunbirdVideoPlayerRef}
        id="contentPlayer"
        title="Content Player"
        src={`${basePath}/libs/sunbird-video-player/index.html`}
        aria-label="Content Player"
        style={{ 
          border: 'none', 
          width: iframeWidth || '100%',
          maxWidth: '100%',
          height: iframeHeight || '56.25vw',
          display: 'block',
          margin: '0 auto',
        }}
      ></iframe>
  );
};

export default SunbirdVideoPlayer;
