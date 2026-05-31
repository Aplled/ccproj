"use client";
import { useState } from "react";
import TranslationForm from "@/components/TranslationForm";
import Visualizer from "@/components/Visualizer";
import type { AnalyzeResult } from "@/lib/translation";

export default function Home() {
  const [view, setView] = useState<"form" | "visualizer">("form");
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const showVisualizer = (text: string, result: AnalyzeResult) => {
    setText(text);
    setResult(result);
    setView("visualizer");
  };

  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="w-full bg-gray-800 px-6 py-6 text-center text-3xl font-semibold tracking-tight text-gray-100 shadow-sm">
        Translation Visualizer!
      </h1>
      {view === "form" || !result ? (
        <TranslationForm onVisualize={showVisualizer} />
      ) : (
        <Visualizer text={text} result={result} onBack={() => setView("form")} />
      )}
    </main>
  );
}
