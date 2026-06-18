import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;

  // @ts-ignore
  const lib = await import("pdfjs-dist/build/pdf.mjs");

  console.log("PDF.js version:", lib.version);

  lib.GlobalWorkerOptions.workerSrc = pdfWorker;

  pdfjsLib = lib;

  return lib;
}

export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await lib.getDocument({
      data: arrayBuffer,
    }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({
      scale: 4,
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Failed to get canvas context",
      };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({
            imageUrl: "",
            file: null,
            error: "Failed to create image blob",
          });
          return;
        }

        const imageFile = new File(
          [blob],
          file.name.replace(/\.pdf$/i, ".png"),
          {
            type: "image/png",
          },
        );

        resolve({
          imageUrl: URL.createObjectURL(blob),
          file: imageFile,
        });
      });
    });
  } catch (err) {
    console.error(err);

    return {
      imageUrl: "",
      file: null,
      error: String(err),
    };
  }
}
