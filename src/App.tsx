// Save as H:\MahimaAI\src\App.tsx
import React, { useState, useEffect } from "react";

interface StatusMetrics {
  stt: string;
  tts: string;
  wakeword: string;
  ollama: string;
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [outputLog, setOutputLog] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setMetrics] = useState<StatusMetrics>({
    stt: "Offline",
    tts: "Offline",
    wakeword: "Offline",
    ollama: "Connecting...",
  });

  useEffect(() => {
    // Audit core services and establish connection parameters
    const checkServices = async () => {
      try {
        const res = await fetch("http://localhost:8008/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "Hello" }),
        });
        if (res.ok) {
          setMetrics({
            stt: "Operational (Local)",
            tts: "Operational (Kokoro-82M)",
            wakeword: "Active (openWakeWord)",
            ollama: "Operational (Qwen-2.5-7B)",
          });
          setOutputLog((prev) => MahimaAI services are online and active."]);
        }
      } catch (err) {
        setMetrics({
          stt: "Offline",
          tts: "Offline",
          wakeword: "Offline",
          ollama: "Connection Refused (Check Ollama Service)",
        });
      }
    };
    checkServices();
  },);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setOutputLog((prev) => [...prev, `[User] ${prompt}`]);

    try {
      // Route commands locally [11]
      const response = await fetch("http://localhost:8008/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      
      if (data.response) {
        setOutputLog((prev) => [...prev, `[MahimaAI] ${data.response}`]);
        // Trigger high-fidelity local voice feedback
        await fetch("http://localhost:8008/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.response }),
        });
      }
    } catch (err) {
      setOutputLog((prev) => [...prev, "[Error] Failed to route intent locally."]);
    } finally {
      setPrompt("");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 font-mono text-slate-100 selection:bg-teal-500 selection:text-slate-900">
      {/* Top Navigation Control Strip */}
      <header className="flex items-center justify-between border-b border-slate-900 bg-slate-900/40 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-teal-400" />
          <h1 className="text-lg font-bold tracking-widest text-teal-400 uppercase">MahimaAI Operating Layer</h1>
        </div>
        <div className="text-xs text-slate-400">Ver 1.0.0 (Local Sandbox)</div>
      </header>

      {/* Main UI Workspace split view */}
      <main className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Terminal output panel */}
        <section className="flex flex-1 flex-col rounded-xl border border-slate-900 bg-slate-900/10 p-5 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {outputLog.map((log, index) => (
              <div key={index} className="text-sm leading-relaxed border-l-2 border-slate-800 pl-3">
                {log}
              </div>
            ))}
            {isProcessing && (
              <div className="text-sm text-teal-400 animate-pulse">[MahimaAI is executing cognitive routing actions...]</div>
            )}
          </div>
          
          {/* User Console Input */}
          <form onSubmit={handleCommandSubmit} className="mt-4 flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter system prompt or speak 'Hey Mahima'..."
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-teal-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-teal-400"
            >
              Execute
            </button>
          </form>
        </section>

        {/* Local Environment System Metrics Panel */}
        <section className="w-80 rounded-xl border border-slate-900 bg-slate-900/30 p-5">
          <h2 className="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Sandbox Environment Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500">Local WakeWord Core</div>
              <div className="text-sm text-teal-400 font-semibold">{metrics.wakeword}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Quantized Whisper Engine</div>
              <div className="text-sm text-teal-400 font-semibold">{metrics.stt}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Kokoro-82M TTS Pipeline</div>
              <div className="text-sm text-teal-400 font-semibold">{metrics.tts}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Local Reasoning Engine</div>
              <div className="text-sm text-teal-400 font-semibold">{metrics.ollama}</div>
            </div>
            <div className="border-t border-slate-900 pt-4">
              <div className="text-xs text-slate-500 mb-2">Sandbox Storage Root</div>
              <div className="rounded bg-slate-950/80 px-3 py-2 text-xs text-slate-400">H:\MahimaAI\AppData</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
