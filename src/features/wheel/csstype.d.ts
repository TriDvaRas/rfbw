import * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    '--item-nb'?: number;
    '--wheel-size'?: string;
    '--wheel-radius'?: string;
    '--wheel-border-size'?: string;
    '--wheel-color'?: string;
    '--neutral-color'?: string;
    '--border-color'?: string;
    '--nb-turn'?: number;
    '--spinning-duration'?: string | number | null;
    '--reset-duration'?: string ;
    '--item-bg-height'?: string ;
    '--rotate-for'?: string;
    '--scale-factor'?: number;
    '--container-height'?:string;
  }
}