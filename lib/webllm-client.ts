import * as webllm from "@mlc-ai/web-llm";

let engine: webllm.MLCEngine | null = null;

export const MODEL_NAME = "Llama-3.2-3B-Instruct-q4f16_1-MLC";

export async function initializeWebLLM(
  onProgress?: (report: webllm.InitProgressReport) => void
): Promise<webllm.MLCEngine> {
  if (engine) return engine;

  engine = new webllm.MLCEngine();
  
  await engine.reload(MODEL_NAME, {
    initProgressCallback: onProgress
  });

  return engine;
}

export async function analyzeData(
  dataPreview: string,
  vertical: string,
  additionalContext?: string
): Promise<string> {
  if (!engine) {
    throw new Error("WebLLM engine not initialized");
  }

  const messages: webllm.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a data analysis expert specializing in ${vertical}. Analyze the provided data and suggest:
1. What type of data this appears to be
2. Key patterns or insights visible in the data
3. Potential use cases in ${vertical}
4. What additional datasets would be valuable to combine with this data
5. Specific problems this data could help solve in ${vertical}

Be specific and actionable in your recommendations.`
    },
    {
      role: "user",
      content: `Data preview:\n${dataPreview}\n\n${additionalContext ? `Additional context: ${additionalContext}` : ''}`
    }
  ];

  const reply = await engine.chat.completions.create({
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  return reply.choices[0]?.message?.content || "";
}

export async function generateSolution(
  primaryData: string,
  additionalDatasets: string[],
  vertical: string,
  problemStatement: string
): Promise<string> {
  if (!engine) {
    throw new Error("WebLLM engine not initialized");
  }

  const messages: webllm.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are an expert in ${vertical} data solutions. Generate a comprehensive solution that:
1. Explains how to combine and analyze the provided datasets
2. Provides specific analytical approaches and methodologies
3. Suggests implementation steps
4. Identifies potential challenges and mitigation strategies
5. Estimates potential impact and ROI

Be detailed and industry-specific in your recommendations.`
    },
    {
      role: "user",
      content: `Problem: ${problemStatement}
      
Primary Dataset: ${primaryData}

Additional Datasets: ${additionalDatasets.join(', ')}

Generate a comprehensive solution for the ${vertical} industry.`
    }
  ];

  const reply = await engine.chat.completions.create({
    messages,
    temperature: 0.7,
    max_tokens: 1500,
  });

  return reply.choices[0]?.message?.content || "";
}

export function isWebLLMInitialized(): boolean {
  return engine !== null;
}

export function resetWebLLM(): void {
  engine = null;
}