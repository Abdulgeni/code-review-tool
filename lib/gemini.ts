import { GoogleGenAI } from '@google/genai';

export async function reviewCode(code: string, language: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key is not configured in the environmental workspace variables.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert static analyzer and code reviewer. Analyze this ${language} code block carefully.

Identify issues structured exactly inside these sections if they are present:
1. 🐛 BUGS & LOGIC ERRORS:
2. ⚡ PERFORMANCE & COMPLEXITY:
3. 🔒 SECURITY VULNERABILITIES:
4. 📐 UNHANDLED EDGE CASES:
5. ✅ ARCHITECTURE & BEST PRACTICES:

For each issue found, state the specific issue, reference the line or section, and suggest a concise corrected code block.

If the provided code has zero flaws or issues in a particular category, explicitly write "No issues detected" in that section.

Source code:
\`\`\`${language}
${code}
\`\`\`

Review details:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || 'Analysis empty or unresolvable response received.';
}