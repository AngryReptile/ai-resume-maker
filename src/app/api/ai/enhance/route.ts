import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text, type, action = 'enhance', context } = await req.json();

        // Only require text if the action is 'enhance'. Generation can happen purely off context for experience.
        if (action === 'enhance' && !text) {
            return NextResponse.json({ error: 'Text is required for enhancement' }, { status: 400 });
        }

        // Handle mock for placeholder API key
        if (process.env.GROQ_API_KEY === 'gsk_placeholder' || !process.env.GROQ_API_KEY) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (type === 'skills') {
                return NextResponse.json({ result: 'Communication, Teamwork, Problem Solving, Analytical Thinking, Project Management (Placeholder results)' });
            }

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
OBLIGATORY: Return ONLY the newly written summary paragraph. DO NOT include any introductory text, titles, quotes, or conversational filler like "Here is your summary". NO prefixes like "Summary:".`;
            } else {
                systemPrompt = `You are an expert resume writer. The user will provide a rough draft of their professional summary. 
Your task is to correct any grammatical errors, spelling mistakes, and improve the sentence structure to make it compelling, professional, and ATS-friendly. 
OBLIGATORY: Return ONLY the corrected and enhanced summary paragraph. DO NOT include any introductory text, titles, quotes, or conversational filler. NO prefixes.`;
            }
        } else if (type === 'experience') {
            if (action === 'generate') {
                systemPrompt = `You are an expert resume writer. 
Context: Job Title - ${context?.position || 'Not specified'}, Company - ${context?.company || 'Not specified'}.
Write 2-3 powerful, action-oriented bullet points suitable for a resume describing typical achievements and responsibilities for this role at this company.
CRITICAL RULE: DO NOT invent, guess, or mention any specific "years of experience".
Start with strong action verbs. 
OBLIGATORY: Return ONLY the bullet points, formatted strictly as a markdown list. DO NOT include any introductory text, titles, quotes, or conversational filler.`;
            } else {
                systemPrompt = `You are an expert resume writer. The user will provide existing notes or a draft about their work experience.
Context: Job Title - ${context?.position || 'Not specified'}, Company - ${context?.company || 'Not specified'}.
Your task is to correct any grammatical errors, spelling mistakes, and improve the sentence structure of their input. 
Ensure the output consists of powerful, action-oriented bullet points suitable for a resume.
OBLIGATORY: Return ONLY the corrected bullet points, formatted strictly as a markdown list. DO NOT include any introductory text, titles, quotes, or conversational filler. NO prefixes.`;
            }
        } else if (type === 'skills') {
            systemPrompt = `You are an expert resume writer. The user is a ${text || 'professional'}.
Context: Job Title - ${context?.position || text || 'Not specified'}.
Your task is to provide a comma-separated list of the 10-12 most relevant, high-impact, and ATS-friendly skills (both hard and soft) for this specific role.
OBLIGATORY: Return ONLY the comma-separated list. DO NOT include any introductory text, titles, quotes, headings, or conversational filler. NO numbering.`;
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
