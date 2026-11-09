"use server";

import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getCloudinaryCreds } from "@/lib/cloudinary";

export type UploadResult = { url?: string; error?: string };

async function isValidImageBytes(file: File): Promise<boolean> {
  const slice = file.slice(0, 12);
  const bytes = new Uint8Array(await slice.arrayBuffer());
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true;
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true;
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return true;
  return false;
}

export async function uploadCategoryImage(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Não autorizado." };

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

    if (!(await isValidImageBytes(file))) {
      return { error: "Arquivo inválido. Envie uma imagem JPEG, PNG, WebP ou GIF." };
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
