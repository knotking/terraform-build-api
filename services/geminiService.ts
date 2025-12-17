import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

if (!apiKey) {
  console.warn("API Key is missing. Please ensure process.env.API_KEY is set.");
}

const ai = new GoogleGenAI({ apiKey });

const BASE_SYSTEM_INSTRUCTION = `You are TerraForge, an expert Senior DevOps Engineer and Terraform Specialist. 
Your goal is to assist users in creating, editing, and analyzing Terraform Infrastructure as Code (IaC).
Always produce valid, production-ready HCL code.
When explaining, use Markdown.
When writing code, wrap it in \`\`\`hcl blocks.
Be concise but thorough. Focus on AWS, Azure, and GCP providers primarily unless specified otherwise.
`;

export const generateTerraform = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
        Task: Generate Terraform code based on the user's natural language request.
        Include comments explaining complex resources.
        Assume a standard provider configuration if not specified.`,
        temperature: 0.2, // Low temperature for code precision
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Generate Error:", error);
    return `Error generating Terraform code: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const editTerraform = async (currentCode: string, instructions: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Current Code:\n\`\`\`hcl\n${currentCode}\n\`\`\`\n\nInstructions: ${instructions}`,
      config: {
        systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
        Task: Modify the provided Terraform code according to the user's instructions.
        Return the full, valid, modified HCL code. Do not skip sections unless explicitly asked to return a diff.`,
        temperature: 0.2,
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    return `Error editing Terraform code: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const analyzeTerraform = async (code: string): Promise<string> => {
  try {
    // Using a "thinking" model if possible for deeper analysis, but falling back to flash for speed/availability in demo
    // Let's use 2.5 flash but with a robust prompt.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this Terraform configuration:\n\`\`\`hcl\n${code}\n\`\`\``,
      config: {
        systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
        Task: Analyze the provided Terraform code.
        Provide a report covering:
        1. Security Vulnerabilities (Critical/High/Medium/Low)
        2. Best Practices Deviations (Naming, Structure, Modules)
        3. Potential Cost Implications (High level)
        4. Logic Errors
        Format the output as a clean Markdown report.`,
        temperature: 0.4,
      },
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analyze Error:", error);
    return `Error analyzing Terraform code: ${error instanceof Error ? error.message : String(error)}`;
  }
};
