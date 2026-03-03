import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { text, type, context } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Handle mock for placeholder API key
        if (process.env.GROQ_API_KEY === 'gsk_placeholder' || !process.env.GROQ_API_KEY) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockResponse = type === 'summary'
                ? `Result: This is an AI-enhanced professional summary based on: "${text}". Note that this is a placeholder response because no real Groq API key was provided.`
                : `Result: This is an AI-enhanced bullet point for your experience: "${text}", considering the role: ${context?.position || 'Unknown'}. Note that this is a placeholder response because no real Groq API key was provided.`;

            return NextResponse.json({ result: mockResponse });
        }

        // System prompts based on the enhancement type
        let systemPrompt = '';
        if (type === 'summary') {
            systemPrompt = `You are an expert resume writer. The user will provide a rough draft of their professional summary. 
Your task is to rewrite it into a compelling, professional, and ATS-friendly paragraph (3-4 sentences max). 
Focus on highlighting key strengths, years of experience, and measurable impact.
Return ONLY the newly written summary. Do not include any introductory text or quotes.`;
        } else if (type === 'experience') {
            systemPrompt = `You are an expert resume writer. The user will provide rough notes about their work experience or a bullet point.
Context: Job Title - ${context?.position || 'Not specified'}, Company - ${context?.company || 'Not specified'}.
Rewrite their input into 1-2 powerful, action-oriented bullet points suitable for a resume. 
Start with strong action verbs, quantify achievements where possible (or suggest placeholders like [X]%), and emphasize impact and results.
Return ONLY the bullet points, formatted as a markdown list.`;
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7,
            max_tokens: 300,
        });

        return NextResponse.json({ result: completion.choices[0]?.message?.content || '' });
    } catch (error: any) {
        console.error('AI Enhancement Error:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to enhance text' },
            { status: 500 }
        );
    }
}
