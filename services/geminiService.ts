import { blobToBase64 } from "../utils/audioUtils";
import { GeminiResult } from "../types";

const processAudioResponse = async (audioBlob: Blob): Promise<GeminiResult> => {
  const base64Audio = await blobToBase64(audioBlob);

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audioBase64: base64Audio,
      mimeType: audioBlob.type || "audio/webm",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to process audio");
  }

  const result = await response.json() as GeminiResult;
  return result;
};

const processTextResponse = async (text: string): Promise<GeminiResult> => {
  const response = await fetch('/api/analyze-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to analyze text");
  }

  const result = await response.json() as GeminiResult;
  return result;
};

export { processAudioResponse, processTextResponse };
