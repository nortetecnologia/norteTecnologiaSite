import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

interface HeaderItem {
  label: string;
  href: string;
  imageUrl: string | null;
}

async function getHeaderItems(): Promise<HeaderItem[]> {
  try {
    const supabase = await createClient();

    // Buscar a vitrine_header e seu content_type
    const { data: vitrine } = await supabase
      .from("vitrines")
      .select("id, content_type, is_active")
      .eq("slug", "vitrine_header")
      .single();

    if (!vitrine || !vitrine.is_active) return [];

    if (vitrine.content_type === "categories") {
      const { data: rows } = await supabase
        .from("vitrine_categories")
        .select("position, categories(id, name, slug)")
        .eq("vitrine_id", vitrine.id)
        .order("position", { ascending: true })
        .limit(10);

      type Row = { position: number; categories: { id: string; name: string; slug: string } | null };
      return ((rows ?? []) as unknown as Row[])
        .filter((r) => r.categories)
        .map((r) => ({
          label: r.categories!.name,
          href: `/categoria/${r.categories!.slug}`,
          imageUrl: null,
        }));
    }

    // content_type === 'products'
    const { data: rows } = await supabase
      .from("vitrine_products")
      .select("position, products(id, name, slug, product_images(url, is_primary))")
      .eq("vitrine_id", vitrine.id)
      .order("position", { ascending: true })
      .limit(10);

    type ImgRow = { url: string; is_primary: boolean };
    type ProdRow = { id: string; name: string; slug: string; product_images: ImgRow[] };
    type VPRow = { position: number; products: ProdRow | null };

    return ((rows ?? []) as unknown as VPRow[])
      .filter((r) => r.products)
      .map((r) => {
        const imgs = r.products!.product_images ?? [];
        const img = imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null;
        return {
          label: r.products!.name,
          href: `/produto/${r.products!.slug}`,
          imageUrl: img,
        };
      });
  } catch {
    return [];
  }
}

export async function HeaderItemsBar() {
  const items = await getHeaderItems();

  if (items.length === 0) return null;

  return (
    <ul className="flex items-center gap-1 overflow-x-auto scrollbar-hide" aria-label="Destaques">
      {items.map((item) => (
        <li key={item.href} className="flex-shrink-0">
          <Link
            href={item.href}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-brand-gray-dark hover:text-brand-yellow"
          >
            {item.imageUrl && (
              <div className="relative h-5 w-5 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="20px"
                  className="object-cover"
                  aria-hidden="true"
                />
              </div>
            )}
            <span className="truncate max-w-[120px]">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
