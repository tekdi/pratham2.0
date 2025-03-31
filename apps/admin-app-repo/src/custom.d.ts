interface Window {
  config: any;
  context: any;
  redirectUrl: any;
  $: typeof import('jquery');
  jQuery: typeof import('jquery');
  questionListUrl: string;
}

declare module '*.json' {
  const sample: any;
  export default sample;
}

declare const iziToast: any;

interface JQuery {
  iziModal(options?: any): void;
  DataTable(options?: any): void;
}

declare namespace JSX {
  interface IntrinsicElements {
      'sunbird-quml-player': any;  // Define the custom element for TypeScript
  }
}

declare namespace JSX {
  interface IntrinsicElements {
      'sunbird-pdf-player': any;  // Define the custom element for TypeScript
  }
}

declare namespace JSX {
  interface IntrinsicElements {
      'sunbird-epub-player': any;  // Define the custom element for TypeScript
  }
}

declare namespace JSX {
  interface IntrinsicElements {
      'sunbird-video-player': any;  // Define the custom element for TypeScript
  }
}
