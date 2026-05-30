// Cache for access token
let cachedAccessToken: string | null = null;

/**
 * Checks if Google Docs OAuth client ID is configured.
 */
export async function ensureGoogleDocsConfigured(): Promise<boolean> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId || clientId === "your-google-client-id.apps.googleusercontent.com") {
    console.warn("Google Docs Client ID not found. VITE_GOOGLE_CLIENT_ID needs to be set.");
    return false;
  }
  return true;
}

// Retain alias for existing App.tsx references to prevent initial compiling failures
export const ensureFirebaseInitialized = ensureGoogleDocsConfigured;

/**
 * Sign in with Google using Google Identity Services (GIS) requesting Drive create scopes
 */
export async function signInWithGoogleDocsScope(): Promise<{ user: any; token: string } | null> {
  const active = await ensureGoogleDocsConfigured();
  if (!active) {
    throw new Error("Google Authentication Client ID is not configured. Please define VITE_GOOGLE_CLIENT_ID in your env.");
  }

  if (typeof (window as any).google === "undefined") {
    throw new Error("Google Identity Services script not loaded. Check index.html configuration.");
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (response: any) => {
          if (response.error) {
            console.error("Google Auth error response:", response);
            reject(new Error(response.error_description || response.error));
            return;
          }
          
          const token = response.access_token;
          if (!token) {
            reject(new Error("No Google Access Token retrieved from credential."));
            return;
          }

          cachedAccessToken = token;
          
          // Provide mock user shape to match component expectations
          resolve({
            user: {
              email: "authenticated-docs-user@gmail.com",
              displayName: "Google Docs Author",
              photoURL: null,
            },
            token,
          });
        },
      });

      // Request token (prompts user for permission)
      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (error: any) {
      console.error("Google OAuth client setup error:", error);
      reject(error);
    }
  });
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
