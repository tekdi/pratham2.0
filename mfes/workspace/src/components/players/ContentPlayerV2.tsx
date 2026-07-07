import React, { useEffect, useRef } from "react";

interface PlayerConfigProps {
  playerConfig: any;
}

const ContentPlayerV2 = ({ playerConfig }: PlayerConfigProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const configuration = playerConfig;

  const baseUrl = process.env.NEXT_PUBLIC_WORKSPACE_ROUTES ?? "";
  const previewUrl = `${baseUrl}/content/preview/preview.html?webview=true`;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const windows = iframe.contentWindow as any;

      if (windows && typeof windows.initializePreview === "function") {
        windows.initializePreview(configuration);
      } else {
        console.warn("####h5pdebug initializePreview function not found");
      }

      if (windows && typeof windows.previewcheckh5p === "function") {
        windows.previewcheckh5p(configuration);
      } else {
        console.warn("####h5pdebug previewcheckh5p function not found");
      }
    };

    iframe.addEventListener("load", handleLoad);
    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [configuration]);

  return (
    <div className="player" style={{ height: "70vh" }}>
      <iframe
        ref={iframeRef}
        src={previewUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="fullscreen"
      />
    </div>
  );
};

export default ContentPlayerV2;
