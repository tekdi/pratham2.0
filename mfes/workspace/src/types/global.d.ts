interface Window {
  GA_INITIALIZED: boolean;
}

declare namespace JSX {
  interface IntrinsicElements {
    "sunbird-pdf-player": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "player-config"?: string;
    };
    "sunbird-quml-player": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > & {
    "player-config"?: string;
  };

    "sunbird-video-player": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "player-config"?: string;
      onEvent?: any;
      onTelemetry?: any;
    };

    "sunbird-epub-player": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "player-config"?: string;
      onEvent?: any;
      onTelemetry?: any;
    };
  }
}
