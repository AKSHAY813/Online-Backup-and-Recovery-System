/**
 * Service to interact with Hugging Face Inference API
 */

const HF_MODEL = "signupting/lora1";
// NOTE: Ideally this should be in an environment variable
const HF_TOKEN = localStorage.getItem('HF_TOKEN') || ""; 

export async function generateSecureAvatar(prompt: string): Promise<string> {
  if (!HF_TOKEN) {
    console.warn("HF_TOKEN missing. Using placeholder image.");
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(prompt)}&background=0052A1&color=fff&size=512`;
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Failed to generate AI avatar:", error);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(prompt)}&background=0052A1&color=fff&size=512`;
  }
}

export function setHFToken(token: string) {
  localStorage.setItem('HF_TOKEN', token);
}
