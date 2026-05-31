import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { compareRoundTrip, type AnalyzeResult } from "@/lib/translation";

const groq = new Groq();

async function translate(text: string, language: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `Translate the user's text into ${language}. Reply with the translation only, no notes or quotes.`,
      },
      { role: "user", content: text },
    ],
  });
  const out = completion.choices[0]?.message?.content?.trim();
  if (!out) throw new Error("Empty response from Groq.");
  return out;
}

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  const {
    text,
    targetLanguage = "Spanish",
    sourceLanguage = "English",
  } = await request.json();

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json(
      { error: "Request body must include non-empty 'text'." },
      { status: 400 }
    );
  }

  try {
    const translated = await translate(text, targetLanguage);
    const roundTrip = await translate(translated, sourceLanguage);

    const result: AnalyzeResult = {
      translated,
      roundTrip,
      ...compareRoundTrip(text, roundTrip),
    };
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
