// global.d.ts
export {};

// Define the AIStudio interface to ensure consistent typing for window.aistudio
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    html2pdf: any; // Declare html2pdf as any, as its type definition might be external or complex.
    google: any; // Declare google as any to resolve potential complex type conflicts with external/implicit declarations.
    // Use the defined AIStudio interface for window.aistudio
    AIStudio: AIStudio;
    aistudio: AIStudio; // Also support lowercase
  }
}
