/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

// JSX type declaration for <sunbird-h5p-player> Web Component
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'sunbird-h5p-player': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        locale?: string;
        theme?: 'light' | 'dark' | 'sepia';
        width?: string;
        height?: string;
      };
    }
  }
}
