/**
 * Service to handle Hugging Face OAuth 2.0 with PKCE
 */

const CLIENT_ID = "YOUR_HF_CLIENT_ID"; // User will need to replace this
const REDIRECT_URI = window.location.origin;
const HF_AUTH_URL = "https://huggingface.co/oauth/authorize";
const HF_TOKEN_URL = "https://huggingface.co/oauth/token";
const HF_USERINFO_URL = "https://huggingface.co/oauth/userinfo";

// PKCE Helpers
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function initiateHFLogin() {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  
  localStorage.setItem("hf_code_verifier", verifier);
  
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: Math.random().toString(36).substring(7),
  });

  window.location.href = `${HF_AUTH_URL}?${params.toString()}`;
}

export async function handleHFCallback(code: string): Promise<any> {
  const verifier = localStorage.getItem("hf_code_verifier");
  if (!verifier) throw new Error("Missing PKCE verifier");

  const response = await fetch(HF_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || "Token exchange failed");
  }

  const { access_token } = await response.json();
  localStorage.removeItem("hf_code_verifier");
  
  // Fetch user info
  const userResponse = await fetch(HF_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userResponse.ok) throw new Error("Failed to fetch user profile");
  
  const hfUser = await userResponse.json();
  
  // Map HF profile to our User object
  return {
    name: hfUser.name || hfUser.preferred_username,
    email: hfUser.email,
    avatar: hfUser.picture,
    plan: "Hugging Face Pro Node",
    hf_token: access_token // Save for inference usage
  };
}
