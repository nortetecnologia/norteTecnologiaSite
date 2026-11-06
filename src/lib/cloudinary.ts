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
