import axios from 'axios';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function analyzeCode({ sourceCode, languageName, challengeTitle, challengeDescription, difficulty }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const systemPrompt = `You are an expert code reviewer for a coding challenge platform. Analyze the submitted solution and provide feedback in exactly this JSON format:
{
  "complexity": {
    "time": "O(...) - explanation",
    "space": "O(...) - explanation",
    "optimal": true/false,
    "notes": "any additional notes"
  },
  "quality": {
    "score": 1-10,
    "strengths": ["..."],
    "issues": ["..."],
    "suggestions": ["..."]
  },
  "optimizations": [
    {"title": "...", "description": "...", "impact": "high/medium/low"}
  ],
  "alternatives": [
    {"approach": "...", "description": "...", "tradeoffs": "..."}
  ]
}
Return ONLY valid JSON, no markdown code fences.`;

  const userPrompt = `Challenge: "${challengeTitle}" (${difficulty})
Description: ${challengeDescription}
Language: ${languageName}

Solution:
\`\`\`${languageName.toLowerCase()}
${sourceCode.slice(0, 10000)}
\`\`\`

Analyze this solution.`;

  const FALLBACK_MODELS = [
    model,
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-3-27b-it:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
  ];

  const payload = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  };

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://veecode.dev',
    'X-Title': 'VeeCode',
  };

  let lastError;
  for (const m of FALLBACK_MODELS) {
    try {
      const response = await axios.post(
        OPENROUTER_URL,
        { ...payload, model: m },
        { headers, timeout: 30000 }
      );

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) continue;

      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return { review: JSON.parse(cleaned), model: m };
    } catch (err) {
      lastError = err;
      if (err.response?.status === 429) continue; // rate limited, try next
      throw err;
    }
  }

  throw lastError || new Error('All AI models rate limited. Try again in a minute.');
}
