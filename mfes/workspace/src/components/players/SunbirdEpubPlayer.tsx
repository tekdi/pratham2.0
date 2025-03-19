import "reflect-metadata";
import React, { useEffect, useRef, useState } from "react";
import { getTelemetryEvents, handleExitEvent } from "@workspace/utils/Helper";

interface PlayerConfigProps {
  playerConfig: any;
}

const SunbirdEpubPlayer = ({ playerConfig }: PlayerConfigProps) => {
  const sunbirdEpubPlayerRef = useRef<HTMLDivElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const scriptUrl =
      "https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-epub-player-web-component@1.4.0/sunbird-epub-player.js";
    const styleUrl =
      "https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-epub-player-web-component@1.4.0/styles.css";

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    const existingStyle = document.querySelector(`link[href="${styleUrl}"]`);

    const onScriptLoad = () => {
      setIsScriptLoaded(true);
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.onload = onScriptLoad;
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }

    if (!existingStyle) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = styleUrl;
      link.className = "sunbird-epub-player-styles";
      document.head.appendChild(link);
    }

    return () => {
      if (!existingScript) {
        const scriptToRemove = document.querySelector(`script[src="${scriptUrl}"]`);
        if (scriptToRemove) document.body.removeChild(scriptToRemove);
      }
      if (!existingStyle) {
        const styleToRemove = document.querySelector(".sunbird-epub-player-styles");
        if (styleToRemove) document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !sunbirdEpubPlayerRef.current) return;

    const playerElement = sunbirdEpubPlayerRef.current;

    const handlePlayerEvent = (event: any) => {
      console.log("Player Event", event.detail);
      if (event?.detail?.edata?.type === "EXIT") {
        handleExitEvent();
      }
    };
    const handleTelemetryEvent = (event: any) => {
      console.log("Telemetry Event", event.detail);
      getTelemetryEvents(event.detail, "epub");
    };

    playerElement.addEventListener("playerEvent", handlePlayerEvent);
    playerElement.addEventListener("telemetryEvent", handleTelemetryEvent);

    return () => {
      playerElement.removeEventListener("playerEvent", handlePlayerEvent);
      playerElement.removeEventListener("telemetryEvent", handleTelemetryEvent);
    };
  }, [isScriptLoaded]);

  return (
    <div className="player-grid">
      {isScriptLoaded ? (
        <sunbird-epub-player
          player-config={JSON.stringify(playerConfig)}
          ref={sunbirdEpubPlayerRef}
        ></sunbird-epub-player>
      ) : (
        <div>Loading EPUB Player...</div>
      )}
    </div>
  );
};

export default SunbirdEpubPlayer;
