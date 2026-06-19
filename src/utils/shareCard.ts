import { FILE_NAMES } from './constants';
import { logger } from './logger';

/**
 * Share card generation using html2canvas.
 * Supports Web Share API with PNG download fallback.
 * @param {HTMLElement} element - The DOM element to capture.
 * @returns {Promise<void>}
 */
export async function generateShareImage(element: HTMLElement): Promise<void> {
  try {
    const canvas = await createCanvas(element);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );

    if (!blob) {
      logger.warn('Failed to generate image blob, falling back to download.');
      downloadCanvas(canvas);
      return;
    }

    const file = new File([blob], FILE_NAMES.SHARE_IMAGE, {
      type: 'image/png',
    });

    const shared = await shareViaWebAPI(file);
    if (!shared) {
      downloadCanvas(canvas);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Share image generation failed:', message);
    alert('Unable to generate share image. Please try taking a screenshot instead.');
  }
}

/**
 * Creates a canvas from an HTML element using html2canvas.
 * @param {HTMLElement} element - The DOM element.
 * @returns {Promise<HTMLCanvasElement>} The generated canvas.
 */
async function createCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  const html2canvas = (await import('html2canvas')).default;
  return await html2canvas(element, {
    backgroundColor: '#020810',
    scale: 2,
    useCORS: true,
    logging: false,
  });
}

/**
 * Attempts to share the generated file using the native Web Share API.
 * @param {File} file - The image file to share.
 * @returns {Promise<boolean>} True if shared successfully, false otherwise.
 */
async function shareViaWebAPI(file: File): Promise<boolean> {
  if (
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title: 'My EarthPulse Result',
        text: 'Check out my carbon footprint on EarthPulse!',
        files: [file],
      });
      return true;
    } catch (shareError: unknown) {
      if (shareError instanceof Error && shareError.name === 'AbortError') {
        return true; // User cancelled, do not trigger fallback download
      }
      logger.info('Web Share API failed, falling back to download.');
    }
  }
  return false;
}

/**
 * Downloads the canvas as a PNG image.
 * @param {HTMLCanvasElement} canvas - The canvas to download.
 */
function downloadCanvas(canvas: HTMLCanvasElement): void {
  const link = document.createElement('a');
  link.download = FILE_NAMES.SHARE_IMAGE;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
