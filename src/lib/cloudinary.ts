import crypto from "crypto";

interface CloudinaryCreds {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

// Aceita vars separadas OU a URL no formato cloudinary://KEY:SECRET@CLOUD_NAME
export function getCloudinaryCreds(): CloudinaryCreds | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  // Fallback: CLOUDINARY_URL (ou o typo CLOUDNARY_URL)
  const url = process.env.CLOUDINARY_URL ?? process.env.CLOUDNARY_URL;
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }

  return null;
}

// Extrai o public_id de uma URL do Cloudinary
// Ex: https://res.cloudinary.com/cloud/image/upload/v123/norte-tecnologia/produtos/abc.jpg
//  → norte-tecnologia/produtos/abc
function extractPublicId(url: string): string | null {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^./]+$/);
  return m ? m[1] : null;
}

// Exclui uma imagem do Cloudinary pelo URL. Best-effort: erros são logados mas não relançados.
export async function deleteCloudinaryImage(imageUrl: string): Promise<void> {
  if (!imageUrl.includes("res.cloudinary.com")) return;

  const creds = getCloudinaryCreds();
  if (!creds) return;

  const publicId = extractPublicId(imageUrl);
  if (!publicId) return;

  const { cloudName, apiKey, apiSecret } = creds;
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(paramsToSign + apiSecret).digest("hex");

  const body = new URLSearchParams({ public_id: publicId, api_key: apiKey, timestamp: String(timestamp), signature });

  try {
    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch (e) {
    console.error("[cloudinary] deleteCloudinaryImage error:", e);
  }
}
