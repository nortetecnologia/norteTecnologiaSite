import { createAdminClient } from "@/lib/supabase/admin";
import { FeedbackAdminClient } from "./FeedbackAdminClient";

export const dynamic = "force-dynamic";

interface FeedbackRow {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  consent_given: boolean;
  created_at: string;
}

export default async function AdminFeedbackPage() {
  let items: FeedbackRow[] = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("feedback")
      .select("id, name, email, message, consent_given, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    items = (data ?? []) as FeedbackRow[];
  } catch {
    // Migration não aplicada ou banco indisponível
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Feedback dos Clientes</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Mensagens enviadas pelo formulário público do site.
        </p>
      </div>

      <FeedbackAdminClient items={items} />
    </div>
  );
}
