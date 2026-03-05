import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { text, type, action = 'enhance', context } = await req.json();

        // Only require text if the action is 'enhance'. Generation can happen purely off context for experience.
        if (action === 'enhance' && !text) {
            return NextResponse.json({ error: 'Text is required for enhancement' }, { status: 400 });
        }

        // Handle mock for placeholder API key
        if (process.env.GROQ_API_KEY === 'gsk_placeholder' || !process.env.GROQ_API_KEY) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockResponse = type === 'summary'
                ? `Result: This is an AI-${action}d professional summary. Note that this is a placeholder response because no real Groq API key was provided.`
                : `- Result: This is an AI-${action}d bullet point for your experience considering the role: ${context?.position || 'Unknown'}. Note that this is a placeholder because no API key was provided.`;

            return NextResponse.json({ result: mockResponse });
        }

        // System prompts based on the enhancement type
        let systemPrompt = '';
        if (type === 'summary') {
            if (action === 'generate') {
                systemPrompt = `You are an expert resume writer. The user is a ${text || 'professional'}.
Your task is to write a compelling, professional, and ATS-friendly professional summary (3-4 sentences max) for a resume. 
Focus on highlighting industry standards, key strengths, and measurable impact typical for this role.
CRITICAL RULE: DO NOT invent, guess, or mention any specific "years of experience" (e.g., do not say "With 5 years of experience..."). Keep experience descriptions qualitative rather than quantitative unless the user provided exact numbers.
Return ONLY the newly written summary paragraph. Do not include any introductory text, titles, or quotes.`;
            } else {
                systemPrompt = `You are an expert resume writer. The user will provide a rough draft of their professional summary. 
Your task is to correct any grammatical errors, spelling mistakes, and improve the sentence structure to make it compelling, professional, and ATS-friendly. 
Return ONLY the corrected and enhanced summary paragraph. Do not include any introductory text, titles, or quotes.`;
            }
        } else if (type === 'experience') {
            if (action === 'generate') {
                systemPrompt = `You are an expert resume writer. 
Context: Job Title - ${context?.position || 'Not specified'}, Company - ${context?.company || 'Not specified'}.
Write 2-3 powerful, action-oriented bullet points suitable for a resume describing typical achievements and responsibilities for this role at this company.
CRITICAL RULE: DO NOT invent, guess, or mention any specific "years of experience".
Start with strong action verbs. Return ONLY the bullet points, formatted strictly as a markdown list.`;
            } else {
                systemPrompt = `You are an expert resume writer. The user will provide existing notes or a draft about their work experience.
Context: Job Title - ${context?.position || 'Not specified'}, Company - ${context?.company || 'Not specified'}.
Your task is to correct any grammatical errors, spelling mistakes, and improve the sentence structure of their input. 
Ensure the output consists of powerful, action-oriented bullet points suitable for a resume.
Return ONLY the corrected bullet points, formatted strictly as a markdown list.`;
            }
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 300,
        });

        return NextResponse.json({ result: completion.choices[0]?.message?.content || '' });
    } catch (error: unknown) {
        console.error('AI Enhancement Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to enhance text' },
            { status: 500 }
        );
    }
}
