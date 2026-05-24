import { useState } from "react";
import Tesseract from "tesseract.js";

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractText = async (image: File): Promise<string> => {
    setIsProcessing(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(image, "ind+eng", {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(m.progress * 100);
        },
      });
      return text;
    } catch (error) {
      console.error("OCR Error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return { extractText, isProcessing, progress };
};
