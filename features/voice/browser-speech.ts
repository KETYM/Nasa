export type BrowserSpeechAlternative = {
  transcript: string;
};

export type BrowserSpeechResult = {
  length: number;
  [index: number]: BrowserSpeechAlternative;
};

export type BrowserSpeechResultList = {
  length: number;
  [index: number]: BrowserSpeechResult;
};

export type BrowserSpeechRecognitionEvent = {
  results: BrowserSpeechResultList;
};

export type BrowserSpeechRecognitionErrorEvent = {
  error: string;
};

export type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type SpeechWindow = Window & {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor;
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
};

export function createSpeechRecognition(): BrowserSpeechRecognition | null {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as SpeechWindow;
  const Recognition =
    speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

  return Recognition ? new Recognition() : null;
}

export function speakText(text: string): Promise<void> {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return Promise.reject(
      new Error("Speech output is not available in this browser."),
    );
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-AR";

  return new Promise((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      if (event.error === "canceled" || event.error === "interrupted") {
        resolve();
        return;
      }

      reject(
        new Error(event.error || "Speech output could not be completed."),
      );
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
}
