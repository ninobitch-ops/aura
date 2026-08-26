import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, action, voicePersona } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY is not configured. Falling back to native client-side compiler synthesizer.",
        fallback: true
      }, { status: 200 });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let systemInstruction = "You are AuraBots AI Architect & Engine powered by Gemini.";
    if (action === 'voice_assistant') {
      const personaNotes: Record<string, string> = {
        'gemini-cyber': 'You are Gemini Cyber, an ultra-precise, futuristic, analytical AI software architect.',
        'aura-pulse': 'You are Aura Pulse, an energetic, upbeat, innovative voice assistant for creative app building.',
        'atlas': 'You are Atlas, a deep, authoritative enterprise technical advisor and systems engineer.',
        'nova': 'You are Nova, a friendly, warm, inspiring product designer and rapid prototyper.',
        'caly-classic': 'You are Caly Classic, a calm, polished, articulate executive technical consultant.',
      };
      systemInstruction = `${personaNotes[voicePersona || 'gemini-cyber'] || personaNotes['gemini-cyber']} Answer the developer query concisely, offering actionable app architecture suggestions or executing natural language commands. Keep replies under 3 sentences for snappy voice delivery.`;
    } else if (action === 'expand_prompt') {
      systemInstruction = `You are AuraBots AI Architect. Given an app concept prompt, enhance and expand it into a rich, comprehensive specification with clear UI layout, state models, interactive capabilities, and responsive patterns. Keep it structured and concise.`;
    } else {
      systemInstruction = `You are AuraBots Code Synthesizer. Given an application specification, generate or refine the core React (TypeScript) App component code. Ensure it is complete, clean, with state, Tailwind styling, and no missing imports.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({
      success: true,
      text: response.text || "",
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process AI prompt",
      fallback: true
    }, { status: 200 });
  }
}
