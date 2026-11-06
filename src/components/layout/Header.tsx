import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getStoreSettings, buildWhatsAppUrl } from "@/lib/store-settings";
import { createClient } from "@/lib/supabase/server";
import { CartIcon } from "@/components/ui/CartIcon";
import { SearchBar } from "@/components/ui/SearchBar";
import { HamburgerMenu } from "@/components/layout/HamburgerMenu";
import { HeaderItemsBar } from "@/components/layout/HeaderItemsBar";

async function getCategories() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, subcategories(id, name, slug)")
      .eq("is_active", true)
      .order("position", { ascending: true });
    return (data ?? []) as Array<{
      id: string;
      name: string;
      slug: string;
      subcategories: Array<{ id: string; name: string; slug: string }>;
    }>;
  } catch {
    return [];
  }
}

export default async function Header() {
  const settings = await getStoreSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number);
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-gray-mid bg-brand-black/95 backdrop-blur-sm">
      {/* Row 1: Logo + (SearchBar desktop) + WhatsApp + Cart */}
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-4 px-4 py-3 sm:gap-5 sm:px-6 sm:h-[88px] sm:py-0 lg:px-10">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2" aria-label="Ir para a página inicial">
          <Image
            src="/logo.png"
            alt="Norte Tecnologia"
            width={44}
            height={44}
            className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            priority
          />
          <span className="text-base font-bold text-white sm:text-lg">
            Norte <span className="text-brand-yellow">Tecnologia</span>
          </span>
        </Link>

        {/* SearchBar — só visível no desktop (sm+) aqui; no mobile fica na row abaixo */}
        <div className="hidden sm:flex flex-1">
          <Suspense fallback={<div className="flex-1 h-10 animate-pulse rounded-lg bg-brand-gray-dark" />}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="ml-auto flex flex-shrink-0 items-center gap-3 sm:ml-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark sm:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          <CartIcon />
        </div>
      </div>

      {/* Row mobile: SearchBar em linha própria, largura total — oculta em sm+ */}
      <div className="block sm:hidden border-t border-brand-gray-mid/40 px-4 py-2">
        <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-lg bg-brand-gray-dark" />}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Row final: Hamburger + HeaderItemsBar */}
      <div className="border-t border-brand-gray-mid/50">
        <div className="mx-auto flex h-11 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-10">
          <HamburgerMenu categories={categories} />
          <div className="h-5 w-px bg-brand-gray-mid flex-shrink-0" aria-hidden="true" />
          <Suspense fallback={null}>
            <HeaderItemsBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
