import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  primaryImageUrl: string | null;
}

export function ProductCard({ slug, name, price, primaryImageUrl }: ProductCardProps) {
  return (
    <Link
      href={`/produto/${slug}`}
      className="group flex flex-col rounded-lg border border-brand-gray-mid bg-brand-gray-dark overflow-hidden hover:border-brand-yellow transition-colors"
    >
      <div className="relative aspect-square bg-brand-black overflow-hidden">
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-brand-gray-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 flex-1 mb-2">
          {name}
        </h3>
        <p className="text-brand-yellow font-bold text-sm">{formatCurrency(price)}</p>
      </div>
    </Link>
  );
}
