import dynamic from "next/dynamic";
import React from "react";

const SunbirdPdfPlayer = dynamic(
  () => import("@/components/players/SunbirdPdfPlayer"),
  {
    ssr: false,
  }
);

const SunbirdVideoPlayer = dynamic(
  () => import("@/components/players/SunbirdVideoPlayer"),
  {
    ssr: false,
  }
);
const SunbirdEpubPlayer = dynamic(
  () => import("@/components/players/SunbirdEpubPlayer"),
  {
    ssr: false,
  }
);

const SunbirdQuMLPlayer = dynamic(
  () => import("@/components/players/SunbirdQuMLPlayer"),
  {
    ssr: false,
  }
);

interface PlayerProps {
  playerConfig: any;
}

const Players = ({ playerConfig }: PlayerProps) => {
  const mimeType = playerConfig?.metadata?.mimeType;
  switch (mimeType) {
    case "application/pdf":
      return <SunbirdPdfPlayer playerConfig={playerConfig} />;
    case "video/webm":
      return <SunbirdVideoPlayer playerConfig={playerConfig} />;
    case "video/mp4":
      return <SunbirdVideoPlayer playerConfig={playerConfig} />;
    case "application/vnd.sunbird.questionset":
      return <SunbirdQuMLPlayer playerConfig={playerConfig} />;
    case "application/epub":
      return <SunbirdEpubPlayer playerConfig={playerConfig} />;
    default:
      return <div>Unsupported media type</div>;
  }
};

export default Players;
