declare module '*.gif' {
  const src: string;
  
  export default src;
}

declare module 'dom-to-image-more' {
  interface Options {
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
    scale?: number;
  }
  function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  function toPng(node: HTMLElement, options?: Options): Promise<string>;
  function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  const domtoimage: { toJpeg: typeof toJpeg; toPng: typeof toPng; toSvg: typeof toSvg; toBlob: typeof toBlob };
  export default domtoimage;
}

