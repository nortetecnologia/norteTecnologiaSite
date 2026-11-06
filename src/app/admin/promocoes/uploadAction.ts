"use server";

import crypto from "crypto";

export type UploadResult = { url?: string; error?: string };

export async function uploadPromoImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { error: "Nenhum arquivo selecionado." };

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return { error: "Cloudinary não configurado no servidor." };
    }

    if (!file.type.startsWith("image/")) {
      return { error: "Apenas imagens são permitidas (JPEG, PNG, WebP, etc.)." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { error: "Arquivo muito grande. O limite é 10 MB." };
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "norte-tecnologia/promocoes";

    const params: Record<string, string> = {
      folder,
      signature_algorithm: "sha256",
      timestamp: String(timestamp),
    };

    const paramsToSign = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&");

    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("timestamp", String(timestamp));
    uploadForm.append("api_key", apiKey);
    uploadForm.append("signature", signature);
    uploadForm.append("folder", folder);
    uploadForm.append("signature_algorithm", "sha256");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as { error?: { message?: string } }).error?.message;
      console.error("[admin/promocoes/upload] Cloudinary error:", err);
      return { error: msg ?? "Falha no upload. Verifique as credenciais do Cloudinary." };
    }

    const data = await response.json() as { secure_url?: string };
    if (!data.secure_url) return { error: "Cloudinary não retornou a URL da imagem." };

    return { url: data.secure_url };
  } catch (e) {
    console.error("[admin/promocoes/upload] exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado no upload." };
  }
}
