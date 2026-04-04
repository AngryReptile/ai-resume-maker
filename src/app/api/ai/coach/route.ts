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

        const { resumeData } = await req.json();

        if (!resumeData) {
            return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
        }

        // Handle mock for placeholder API key
        if (process.env.GROQ_API_KEY === 'gsk_placeholder' || !process.env.GROQ_API_KEY) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json({
                result: {
                    score: 7,
                    verdict: "Good foundation, but lacks quantified impact in several key areas.",
                    strengths: ["Clean professional summary", "Consistent formatting"],
                    issues: ["Missing metrics in work history", "Skills section is too generic", "No projects listed"],
                    rewrites: [
                        "Drove 20% increase in user engagement by implementing real-time chat features using WebSockets.",
                        "Optimized database queries, reducing page load times by 40% across all high-traffic modules.",
                        "Led a team of 4 engineers to deliver a critical cloud migration project 2 weeks ahead of schedule."
                    ],
                    keywords: ["React", "TypeScript", "Node.js", "System Architecture", "Agile Methodologies"],
                    recommendation: "Focus on adding measurable results (percentages, dollar amounts, time saved) to each work experience bullet point."
                }
            });
        }

        const systemPrompt = `You are an expert resume coach and HR professional with 15+ years of experience reviewing resumes across the tech industry. Your job is to analyze resumes submitted by users and provide clear, structured, actionable feedback.

Instructions:
1. Analyze the provided resume data thoroughly.
2. Provide an Overall Score (1-10) and a one-sentence verdict.
3. List 2-3 specific Strengths.
4. List Critical Issues (red flags, gaps, missing metrics).
5. Rewrite up to 3 weak bullet points using the CAR format (Challenge, Action, Result) with quantified outcomes.
6. Suggest 5-8 missing ATS Keywords based on the professional profile.
7. Provide one concrete Final Recommendation.

OBLIGATORY: You MUST return the response as a VALID JSON object with the following keys:
{
  "score": number, 
  "verdict": "string",
  "strengths": ["string", ...],
  "issues": ["string", ...],
  "rewrites": ["string", ...],
  "keywords": ["string", ...],
  "recommendation": "string"
}

Tone: direct, supportive, professional. Do not pad responses. Return ONLY the JSON object.`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify(resumeData) }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.5,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content || '{}';
        return NextResponse.json({ result: JSON.parse(content) });
    } catch (error: unknown) {
        console.error('AI Coach Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to analyze resume' },
            { status: 500 }
        );
    }
}
