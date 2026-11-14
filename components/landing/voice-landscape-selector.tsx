"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSpeechRecognition,
  speakText,
  type BrowserSpeechRecognition,
} from "@/features/voice/browser-speech";
import {
  getLandscapeFromVoiceCommand,
  getLandscapeVoiceName,
  getLandscapeVoicePrompt,
} from "@/features/voice/voice-commands";

type VoiceStatus = "idle" | "announcing" | "listening" | "opening" | "error";

function getVoiceErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "not-allowed":
    case "service-not-allowed":
      return "No se concedió acceso al micrófono. Permítelo en la configuración del navegador e inténtalo otra vez.";
    case "audio-capture":
      return "No se encontró un micrófono disponible.";
    case "network":
      return "El reconocimiento por voz necesita conexión. Comprueba internet e inténtalo otra vez.";
    case "no-speech":
      return "No escuché un paisaje. Pulsa el botón y dilo después de oír las opciones.";
    default:
      return "No se pudo iniciar el reconocimiento de voz. Inténtalo otra vez o elige una tarjeta.";
  }
}

export function VoiceLandscapeSelector() {
  const router = useRouter();
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [announcement, setAnnouncement] = useState(
    "Pulsa el botón para oír las opciones y elegir un paisaje con la voz.",
  );
  const [error, setError] = useState<string | null>(null);

  const startVoiceSelection = useCallback(() => {
    const recognition = createSpeechRecognition();
    if (!recognition) {
      setStatus("error");
      setError(
        "Este navegador no admite selección por voz. Prueba Chrome o Edge, o usa los enlaces de paisajes.",
      );
      return;
    }

    setError(null);
    setStatus("announcing");
    setAnnouncement("Voy a leer las opciones de paisajes.");
    recognition.lang = "es-AR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    const startListening = () => {
      if (recognitionRef.current !== recognition) {
        return;
      }

      try {
        recognition.start();
      } catch (startError) {
        recognitionRef.current = null;
        setStatus("error");
        setError(
          startError instanceof Error
            ? `No se pudo activar el micrófono: ${startError.message}`
            : getVoiceErrorMessage("unknown"),
        );
      }
    };

    recognition.onstart = () => {
      setError(null);
      setStatus("listening");
      setAnnouncement(
        "Estoy escuchando. Di el nombre de un paisaje, por ejemplo Forest o bosque.",
      );
    };

    recognition.onerror = (event) => {
      setStatus("error");
      setError(getVoiceErrorMessage(event.error));
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
        setStatus((currentStatus) =>
          currentStatus === "error" ? "error" : "idle",
        );
      }
    };

    recognition.onresult = (event) => {
      let selectedSlug = null;
      for (let resultIndex = 0; resultIndex < event.results.length; resultIndex += 1) {
        const result = event.results[resultIndex];
        for (let alternativeIndex = 0; alternativeIndex < result.length; alternativeIndex += 1) {
          selectedSlug = getLandscapeFromVoiceCommand(
            result[alternativeIndex].transcript,
          );
          if (selectedSlug) {
            break;
          }
        }
        if (selectedSlug) {
          break;
        }
      }

      if (!selectedSlug) {
        setStatus("error");
        setError(
          "No reconocí ese paisaje. Puedes decir forest, ocean, atmosphere, desert, jungle, savanna o polar regions.",
        );
        recognition.stop();
        return;
      }

      const landscapeName = getLandscapeVoiceName(selectedSlug);
      setStatus("opening");
      setAnnouncement(`Abriendo ${landscapeName}.`);
      recognitionRef.current = null;
      recognition.stop();

      const navigate = () =>
        router.push(`/experience/${selectedSlug}`);
      void speakText(`Abriendo ${landscapeName}.`).then(navigate, navigate);
    };

    const prompt = getLandscapeVoicePrompt();
    void speakText(prompt).then(
      startListening,
      () => {
        setAnnouncement(prompt);
        startListening();
      },
    );
  }, [router]);

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    },
    [],
  );

  const isBusy =
    status === "announcing" || status === "listening" || status === "opening";

  return (
    <section
      lang="es-AR"
      aria-labelledby="voice-landscape-heading"
      className="mt-10 rounded-[1.7rem] border border-[#d8b26d]/30 bg-[#0a1f2a]/80 p-6 sm:p-8"
    >
      <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-[#d3b373]">
        Accesibilidad por voz
      </p>
      <h3
        id="voice-landscape-heading"
        className="mt-2 text-xl font-semibold text-[#f8f1e6]"
      >
        Elige un paisaje hablando
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200/75">
        Pulsa el botón para escuchar las opciones y activar el micrófono. Puedes
        decir el nombre en español o en inglés. También puedes recorrer las
        tarjetas con teclado o lector de pantalla.
      </p>
      <p className="mt-3 text-xs leading-5 text-slate-300/65">
        El reconocimiento lo gestiona el navegador y puede usar sus servicios
        de voz. Earth Jukebox no guarda el audio; consulta la política de
        privacidad de tu navegador.
      </p>
      <button
        type="button"
        onClick={startVoiceSelection}
        disabled={isBusy}
        aria-describedby="voice-landscape-status"
        className="mt-5 rounded-full bg-[#d8b26d] px-5 py-3 text-sm font-semibold text-[#061d28] transition hover:bg-[#e2c889] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d9aa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f2a]"
      >
        {status === "listening"
          ? "Escuchando…"
          : status === "announcing"
            ? "Leyendo las opciones…"
            : status === "opening"
              ? "Abriendo paisaje…"
              : "Escuchar opciones y elegir por voz"}
      </button>
      <p
        id="voice-landscape-status"
        role="status"
        aria-live="polite"
        className="mt-3 text-sm text-slate-200/80"
      >
        {announcement}
      </p>
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-rose-200/20 bg-rose-950/30 px-4 py-3 text-sm text-rose-100"
        >
          {error}
        </p>
      )}
    </section>
  );
}
