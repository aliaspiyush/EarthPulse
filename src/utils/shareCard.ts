/**
 * Share card generation using html2canvas.
 * Supports Web Share API with PNG download fallback.
 *
 * NOTE: Web Share API file sharing has limited browser support as of 2024.
 * The download fallback is always available.
 */
export async function generateShareImage(
  element: HTMLElement
): Promise<void> {
  try {
    // html2canvas is a well-established library (npm: html2canvas)
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(element, {
      backgroundColor: '#020810',
      scale: 2, // Higher resolution for sharing
      useCORS: true,
      logging: false,
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );

    if (!blob) {
      console.warn('Failed to generate image blob, falling back to download.');
      downloadCanvas(canvas);
      return;
    }

    const file = new File([blob], 'earthpulse-result.png', {
      type: 'image/png',
    });

    // Try Web Share API first
    // NOTE: navigator.canShare with files is not supported in all browsers.
    // Firefox and some mobile browsers may not support file sharing.
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
        return;
      } catch (shareError: unknown) {
        // User cancelled share or API failed — fall through to download
        if (shareError instanceof Error && shareError.name === 'AbortError') {
          return; // User cancelled, do nothing
        }
        console.info('Web Share API failed, falling back to download.');
      }
    }

    // Fallback: download as PNG
    downloadCanvas(canvas);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Share image generation failed:', message);
    // Final fallback: alert user
    alert('Unable to generate share image. Please try taking a screenshot instead.');
  }
}

function downloadCanvas(canvas: HTMLCanvasElement): void {
  const link = document.createElement('a');
  link.download = 'earthpulse-result.png';
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
