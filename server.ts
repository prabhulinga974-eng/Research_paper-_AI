import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

interface AnalyzeRequest {
  url?: string;
  paperText?: string;
  paperTitle?: string;
}

// Fallback curated sample papers for instant testing and reference
const SAMPLE_PAPERS = [
  {
    id: "mamba-ssm",
    title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
    authors: "Albert Gu, Tri Dao",
    year: "2023",
    url: "https://arxiv.org/abs/2312.00752",
    tag: "Sequence Modeling / Architecture",
  },
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.",
    year: "2017",
    url: "https://arxiv.org/abs/1706.03762",
    tag: "Transformers / NLP",
  },
  {
    id: "flash-attention-2",
    title: "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning",
    authors: "Tri Dao",
    year: "2023",
    url: "https://arxiv.org/abs/2307.08691",
    tag: "Systems / GPU Acceleration",
  },
  {
    id: "deepseek-v3",
    title: "DeepSeek-V3 Technical Report",
    authors: "DeepSeek-AI",
    year: "2024",
    url: "https://arxiv.org/abs/2412.19437",
    tag: "Mixture of Experts / MoE",
  },
  {
    id: "lora",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: "Edward J. Hu, Yelong Shen, Phillip Wallis, et al.",
    year: "2021",
    url: "https://arxiv.org/abs/2106.09685",
    tag: "Parameter-Efficient Fine-Tuning",
  },
  {
    id: "llava",
    title: "Visual Instruction Tuning (LLaVA)",
    authors: "Haotian Liu, Chunyuan Li, Qingyang Wu, Yong Jae Lee",
    year: "2023",
    url: "https://arxiv.org/abs/2304.08485",
    tag: "Multimodal Vision-Language",
  },
];

app.get("/api/sample-papers", (_req, res) => {
  res.json({ papers: SAMPLE_PAPERS });
});

app.post("/api/analyze-paper", async (req, res) => {
  try {
    const { url, paperText, paperTitle }: AnalyzeRequest = req.body;

    if (!url && !paperText && !paperTitle) {
      return res.status(400).json({
        error: "Please provide a research paper URL, title, or paper excerpt.",
      });
    }

    const inputReference = url
      ? `Research Paper URL: ${url}${paperTitle ? `\nPaper Title: ${paperTitle}` : ""}`
      : paperTitle
      ? `Paper Title: ${paperTitle}${paperText ? `\nAbstract/Text:\n${paperText.slice(0, 3000)}` : ""}`
      : `Paper Text/Abstract:\n${paperText?.slice(0, 4000)}`;

    const systemInstruction = `You are an advanced Computer Science Research Agent specializing in parsing academic papers, extracting system architectures, and identifying student development opportunities.

OPERATIONAL CONSTRAINTS:
- You must always prioritize token efficiency. Ensure your total analysis and tool execution stays well under 25,000 tokens.
- If a paper is too long to ingest entirely, use the Web Search tool to look up summaries, abstracts, and open-source implementations (e.g. GitHub) of the paper's title to gather context efficiently.

When a user provides a research paper URL or title, execute these 3 steps:

1. CORE CONCEPT EXTRACTION:
Summarize the problem statement, the primary methodology introduced, and the key mathematical/algorithmic breakthroughs in under 300 words using plain, accessible language.

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
Generate a clean, syntactically correct Mermaid.js flowchart (graph TD) that charts the components, data inputs, model layers, and data outputs of the system described in the paper.
Important rules for the Mermaid diagram:
- Must begin with "graph TD".
- Must use standard, clean node IDs (e.g. Input[Input Data] --> Tokenizer[Tokenizer] --> Block1[Transformer Block]).
- Avoid special characters, colons, or quotation marks inside node label braces that break Mermaid syntax.
- Ensure all brackets are properly paired.
- Do not use Markdown code blocks (\`\`\`) inside the Mermaid string itself; output the raw Mermaid syntax text in the designated field.

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
Brainstorm 3 concrete, realistic ways a 3rd-year CS student could build upon, extend, or optimize this paper for a resume project. For each idea provide:
- The exact extension (e.g. "Replacing the heavy transformer layer with a lightweight Mamba block for edge deployment").
- The targeted performance metric (e.g. latency reduction, accuracy trade-off).
- The recommended tech stack (e.g. PyTorch, ONNX Runtime).
- A 4-week student implementation roadmap (Weeks 1 to 4).
- A ready-to-use resume bullet point formatted in strong STAR (Situation, Task, Action, Result) format with measurable metric placeholders.
- A concise starter boilerplate Python/PyTorch code snippet showing students where to start their implementation.

You must respond ONLY with a valid, clean JSON object matching the following structure (no surrounding markdown code blocks, or wrapped in standard \`\`\`json \`\`\`):
{
  "paperDetails": {
    "title": "Full accurate paper title",
    "authors": "Author names",
    "year": "Publication year",
    "venueOrArxiv": "ArXiv ID or Conference (e.g., ArXiv:2312.00752 / NeurIPS 2023)",
    "url": "Canonical URL",
    "oneLineTakeaway": "One sharp sentence capturing the core contribution"
  },
  "coreConcept": {
    "problemStatement": "Clear summary of the core computational or theoretical bottleneck the paper solves",
    "primaryMethodology": "The foundational technique or system architecture introduced",
    "keyBreakthroughs": [
      "Mathematical/algorithmic breakthrough 1",
      "Mathematical/algorithmic breakthrough 2",
      "Mathematical/algorithmic breakthrough 3"
    ],
    "accessibleSynthesis": "Comprehensive synthesis under 300 words summarizing the problem, method, and breakthrough in plain, intuitive CS language.",
    "wordCount": 185
  },
  "flowchart": {
    "mermaidCode": "graph TD\\n  Input[Input Tokens] --> Embedding[Embedding Layer]\\n...",
    "componentBreakdown": [
      {
        "component": "Component name (e.g. Selective State Space)",
        "role": "What this layer does",
        "inputsOutputs": "Inputs and outputs"
      }
    ]
  },
  "studentOpportunities": [
    {
      "id": "proj-1",
      "title": "Catchy student project title",
      "exactExtension": "Exact extension description (e.g. Replacing X with Y for Z)",
      "targetedMetric": "Exact targeted performance metric (e.g. 3.2x latency reduction on Raspberry Pi 4 with <1% perplexity drop)",
      "recommendedTechStack": ["PyTorch", "HuggingFace Transformers", "ONNX Runtime"],
      "difficulty": "Intermediate",
      "estimatedWeeks": 4,
      "whyGreatForResume": "Why a recruiter or ML engineer interviewing a 3rd-year CS student will be impressed",
      "fourWeekRoadmap": [
        {"week": "Week 1", "milestone": "Baseline Replication", "tasks": "Clone reference repo, reproduce paper's mini-benchmark on tiny dataset."},
        {"week": "Week 2", "milestone": "Architecture Modification", "tasks": "Swap target module and resolve tensor shape / gradient issues."},
        {"week": "Week 3", "milestone": "Benchmarking & Optimization", "tasks": "Profile latency, memory usage, and throughput against baseline."},
        {"week": "Week 4", "milestone": "Packaging & GitHub Portfolio", "tasks": "Write clear README, plot comparative ablation charts, add CI tests."}
      ],
      "resumeBulletSTAR": "Architected and benchmarked a lightweight variant by replacing heavy multi-head attention with selective state space blocks, achieving 42% faster inference latency on edge hardware with negligible accuracy degradation.",
      "starterCodeSnippet": "# Starter boilerplate snippet demonstrating the core replacement..."
    }
  ],
  "tokenEfficiencyBadge": {
    "estimatedAnalysisTokens": 3200,
    "maxTokenBudget": 25000,
    "budgetAdherence": "Strictly under 25,000 token limit"
  }
}`;

    const prompt = `Analyze the following computer science research paper according to your operational steps:

${inputReference}

Search the web if necessary to gather the abstract, system components, algorithm specifications, and existing GitHub implementations. Ensure your response is strictly valid JSON conforming to the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";

    // Parse the JSON response, stripping any markdown wrappers if present
    let parsedData: any = null;
    try {
      const cleaned = text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "");
      parsedData = JSON.parse(cleaned);
    } catch (_parseErr) {
      // Fallback: extract the outermost JSON object if model included commentary
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsedData = JSON.parse(match[0]);
        } catch (innerErr) {
          console.error("Failed to parse matched JSON substring:", innerErr);
        }
      }
    }

    if (!parsedData) {
      return res.status(500).json({
        error: "Unable to parse agent structured output.",
        rawText: text,
      });
    }

    // Attach search grounding metadata if available
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchQueries =
      response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    return res.json({
      success: true,
      data: parsedData,
      grounding: {
        queries: searchQueries,
        sources: groundingChunks
          .map((c: any) => ({
            title: c.web?.title || "Web Reference",
            uri: c.web?.uri || "",
          }))
          .filter((s: any) => s.uri),
      },
      usage: response.usageMetadata || null,
    });
  } catch (error: any) {
    console.error("Error analyzing paper:", error);
    return res.status(500).json({
      error: error?.message || "An unexpected error occurred during paper analysis.",
    });
  }
});

// Setup Vite dev server middleware in development, or serve static build in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
