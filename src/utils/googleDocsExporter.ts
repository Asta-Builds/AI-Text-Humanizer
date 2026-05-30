import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";

// Cache for access token and auth reference
let cachedAccessToken: string | null = null;
let isInitialized = false;

/**
 * Safely fetches firebase config from the server or local file and initializes Firebase
 */
export async function ensureFirebaseInitialized(): Promise<boolean> {
  if (isInitialized) return true;

  try {
    // Dynamically fetch config to prevent static compilation errors on missing config
    const response = await fetch("/firebase-applet-config.json");
    if (!response.ok) {
      console.warn("firebase-applet-config.json not found on backend. OAuth setup needs to be run first.");
      return false;
    }
    
    const config = await response.json();
    if (!config.apiKey || !config.authDomain) {
      console.warn("Missing critical parameters in firebase-applet-config.json");
      return false;
    }

    if (getApps().length === 0) {
      initializeApp(config);
    }
    isInitialized = true;
    return true;
  } catch (err) {
    console.error("Failed to initialize Firebase applet configuration dynamically", err);
    return false;
  }
}

/**
 * Sign in with Google requesting Drive create scopes
 */
export async function signInWithGoogleDocsScope(): Promise<{ user: User; token: string } | null> {
  const active = await ensureFirebaseInitialized();
  if (!active) {
    throw new Error("Google Authentication is not fully configured yet on this development server. Please wait for OAuth Provision.");
  }

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  // Minimize scopes to only creating and managing documents created by this app
  provider.addScope("https://www.googleapis.com/auth/drive.file");

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    if (!token) {
      throw new Error("No Google Access Token retrieved from credential.");
    }
    
    cachedAccessToken = token;
    return { user: result.user, token };
  } catch (error: any) {
    console.error("Firebase Signin Error:", error);
    throw error;
  }
}

/**
 * Upload styled HTML content to Google Drive and convert to a native Google Doc
 */
export async function uploadToGoogleDocs(
  accessToken: string,
  title: string,
  htmlContent: string
): Promise<string> {
  const metadata = {
    name: title,
    mimeType: "application/vnd.google-apps.document", // Tells Google Drive to convert HTML to native Google Doc
  };

  const boundary = "314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    htmlContent +
    closeDelimiter;

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: body,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Drive Upload response failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  if (!data.id) {
    throw new Error("Drive upload succeeded but document index ID was not received.");
  }

  return data.id;
}

/**
 * Create a beautifully structured HTML document representation for conversion
 */
export function generateAcademicDocHtml(
  title: string,
  metadataHtml: string,
  inputText: string,
  outputText: string,
  comparativeHtml?: string
): string {
  // Format body paragraphs with double line-breaks
  const formattedProse = outputText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p style="margin-bottom: 12pt; font-family: 'Times New Roman', Times, serif; font-size: 11.5pt; text-align: justify; line-height: 1.6; text-indent: 0.5in;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const formattedOriginal = inputText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p style="margin-bottom: 10pt; font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #555555; text-align: justify;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #111111; line-height: 1.5; padding: 20px; }
        h1 { font-family: Arial, Helvetica, sans-serif; font-size: 18pt; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; margin-bottom: 6px; }
        h2 { font-family: Arial, Helvetica, sans-serif; font-size: 13pt; font-weight: bold; color: #2c3e50; margin-top: 24pt; margin-bottom: 10px; }
        .meta-container { margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
        .diff-block { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .diff-block td { border: 1px solid #cbd5e1; padding: 8px; font-size: 10pt; vertical-align: top; }
        .diff-header { font-weight: bold; background-color: #f1f5f9; font-size: 9.5pt; text-align: left; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta-container">
        ${metadataHtml}
      </div>

      <h2>Part I: Approved Scholarly Prose Output</h2>
      <div style="border-left: 3px solid #6366f1; padding-left: 15px;">
        ${formattedProse}
      </div>

      ${comparativeHtml ? `
        <h2>Part II: Humanizer Comparative Alignment</h2>
        ${comparativeHtml}
      ` : ""}

      <h2>Part III: Original Submission Reference</h2>
      <div style="background-color: #fafafa; border: 1px solid #e1e8ed; padding: 12px; margin-top: 10px;">
        ${formattedOriginal}
      </div>
    </body>
    </html>
  `;
}
