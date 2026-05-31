"use client";
import type { AnalyzeResult } from "@/lib/translation";

type VisualizerProps = {
    text: string;
    result: AnalyzeResult;
    onBack: () => void;
};

export default function Visualizer({ text, result, onBack }: VisualizerProps) {
    const { translated, roundTrip, lossScore, notes, segments } = result;
    const hasSegments = segments && segments.length > 0;

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <button type="button" onClick={onBack}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                    ← Back
                </button>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded bg-green-200" /> Kept
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded bg-red-200" /> Lost
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Original
                    </h2>
                    <p className="leading-relaxed text-gray-800">
                        {hasSegments
                            ? segments.map((segment, i) => (
                                  <span key={i}
                                      className={
                                          segment.status === "kept"
                                              ? "rounded bg-green-100 text-green-900"
                                              : "rounded bg-red-100 text-red-900 line-through decoration-red-400"
                                      }>
                                      {segment.text}
                                  </span>
                              ))
                            : text}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Translated
                    </h2>
                    <p className="leading-relaxed text-gray-800">{translated}</p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Translated back to the original language
                </h2>
                <p className="leading-relaxed text-gray-800">{roundTrip}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Loss Score
                </h2>
                <p className="text-2xl font-semibold text-gray-800">{(lossScore * 100).toFixed(0)}%</p>
                {notes && <p className="mt-2 text-sm text-gray-600">{notes}</p>}
            </div>
        </div>
    );
}
