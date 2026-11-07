"use server";

import crypto from "crypto";
import { getCloudinaryCreds } from "@/lib/cloudinary";

export type UploadResult = { url?: string; error?: string };

export async function uploadCategoryImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { error: "Nenhum arquivo selecionado." };

    const creds = getCloudinaryCreds();
    if (!creds) return { error: "Cloudinary não configurado no servidor." };
    const { cloudName, apiKey, apiSecret } = creds;

    if (!file.type.startsWith("image/")) {
      return { error: "Apenas imagens são permitidas (JPEG, PNG, WebP, etc.)." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { error: "Arquivo muito grande. O limite é 10 MB." };
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "norte-tecnologia/categorias";

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("timestamp", String(timestamp));
    uploadForm.append("api_key", apiKey);
    uploadForm.append("signature", signature);
    uploadForm.append("folder", folder);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    let response: Response;
    try {
      response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: uploadForm, signal: controller.signal }
      );
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
        return { error: "O upload excedeu o tempo limite (30s). Verifique sua conexão e tente novamente." };
      }
      throw fetchErr;
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as { error?: { message?: string } }).error?.message;
      console.error("[admin/categorias/upload] Cloudinary error:", err);
      return { error: msg ?? "Falha no upload. Verifique as credenciais do Cloudinary." };
    }

    const data = await response.json() as { secure_url?: string };
    if (!data.secure_url) return { error: "Cloudinary não retornou a URL da imagem." };

    return { url: data.secure_url };
  } catch (e) {
    console.error("[admin/categorias/upload] exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado no upload." };
  }
}
