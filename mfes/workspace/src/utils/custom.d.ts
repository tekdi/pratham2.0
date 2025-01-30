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
  iziModal(options?: any);
  DataTable(options?: any);
}
