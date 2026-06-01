"use client";
import React, { useState } from "react";
import type { AnalyzeResult } from "@/lib/translation";

type TranslationFormProps = {
    onVisualize: (text: string, result: AnalyzeResult) => void;
};

const LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Chinese"];

export default function TranslationForm({ onVisualize }: TranslationFormProps) {

    const [text, setText] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("English");
    const [targetLanguage, setTargetLanguage] = useState("Spanish");
    const [result, setResult] = useState<AnalyzeResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const submitted = result !== null;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, sourceLanguage, targetLanguage }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);

            setResult(data as AnalyzeResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleClear = () => {
        setText("");
        setResult(null);
        setError(null);
    }

    const selectClasses = "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-400 focus:outline-none disabled:opacity-60";

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <select value={sourceLanguage} disabled={submitted}
                    onChange={(e) => setSourceLanguage(e.currentTarget.value)}
                    className={selectClasses}>
                    {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                <span aria-hidden>→</span>
                <select value={targetLanguage} disabled={submitted}
                    onChange={(e) => setTargetLanguage(e.currentTarget.value)}
                    className={selectClasses}>
                    {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                </select>
            </div>

            <textarea value={text}
                readOnly={submitted}
                onChange={(e) => setText(e.currentTarget.value)}
                placeholder="Enter text to translate..."
                className="min-h-32 w-full resize-y rounded-xl border border-gray-300 bg-white p-4 text-gray-800 shadow-sm transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none" />
            <textarea value={result?.translated ?? ""} readOnly
                placeholder="Translation will appear here..."
                className="min-h-32 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700 shadow-sm" />
            {error && (
                <p key="error" className="text-sm text-red-600">{error}</p>
            )}
            {submitted && result ? (
                <div key="actions" className="flex justify-center gap-3">
                    <button type="button" onClick={handleClear}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                        Clear
                    </button>
                    <button type="button" onClick={() => onVisualize(text, result)}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-sm hover:bg-blue-700">
                        Visualize
                    </button>
                </div>
            ) : (
                <button key="translate" type="submit" disabled={loading}
                    className="self-center rounded-lg bg-gray-800 px-6 py-2 font-medium text-white shadow-sm hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Translating…" : "Translate"}
                </button>
            )}
        </form>
    )

}
