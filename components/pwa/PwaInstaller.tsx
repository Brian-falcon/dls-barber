"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function PwaInstaller() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const handlePrompt = (event: Event) => { event.preventDefault(); setPromptEvent(event as InstallPromptEvent); };
    const handleInstalled = () => setPromptEvent(null);
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", handlePrompt); window.removeEventListener("appinstalled", handleInstalled); };
  }, []);

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  if (!promptEvent) return null;
  return <button type="button" onClick={install} className="home-install-button"><Download size={17} /> Instalar app</button>;
}
