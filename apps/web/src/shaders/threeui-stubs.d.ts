declare module "*?raw" {
  const content: string;
  export default content;
}

declare module "../tidecrest-hero/tidecrestDocument.js" {
  export const buildTidecrestDocument: any;
}

declare module "../meridian-landing-page/meridianDocument.js" {
  export const buildMeridianDocument: any;
}

declare module "../ascii-field/asciiFieldDocuments.js" {
  export const buildAsciiFieldDocument: any;
}

declare module "../betawise-globe/betawiseGlobeDocument.js" {
  export const buildBetawiseGlobeDocument: any;
}

declare module "../nocturne-hero/NocturneScene" {
  export const NOCTURNE_TITLES: any;
  export const NOCTURNE_VARIANTS: any;
  export const buildNocturneDocument: any;
  export type NocturneVariant = string;
}

declare module "./sandboxedPageDocument" {
  export const buildSandboxedPageDocument: any;
}

declare module "../sylva-living-world/SylvaLivingWorldScene" {
  export const MAPLE_AUTUMN_STYLE: any;
  export const SAKURA_SUNSET_STYLE: any;
  export const SEQUOIA_MIST_STYLE: any;
  export const applyMapleAutumnVariant: any;
  export const applySakuraSunsetVariant: any;
  export const applySequoiaMistVariant: any;
}
