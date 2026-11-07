import { createClient } from "@/lib/supabase/server";

interface ReviewsListProps {
  productId: string;
}

interface Review {
  id: string;
  name: string | null;
  rating: number;
  message: string;
  created_at: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-[#ffd600]" : "text-[#3a3a3a]"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

export async function ReviewsList({ productId }: ReviewsListProps) {
  let reviews: Review[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("product_reviews")
      .select("id, name, rating, message, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(50);

    reviews = (data ?? []) as Review[];
  } catch {
    // banco indisponível
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-2">
        Ainda não há avaliações para este produto. Seja o primeiro a avaliar!
      </p>
    );
  }

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-white">{avg.toFixed(1)}</span>
        <div>
          <StarDisplay rating={Math.round(avg)} />
          <p className="text-xs text-gray-500 mt-0.5">{reviews.length} avaliação{reviews.length !== 1 ? "ões" : ""}</p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="border border-[#2a2a2a] rounded-xl p-4 bg-[#111111]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <StarDisplay rating={r.rating} />
                <span className="text-sm font-medium text-white">
                  {r.name ?? "Cliente"}
                </span>
              </div>
              <time
                dateTime={r.created_at}
                className="text-xs text-gray-500 shrink-0"
              >
                {new Date(r.created_at).toLocaleDateString("pt-BR")}
              </time>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
