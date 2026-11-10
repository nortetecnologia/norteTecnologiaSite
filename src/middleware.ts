import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// CSP dinâmica — frame-src construído a partir das URLs configuradas pelo admin
// ---------------------------------------------------------------------------

// Cache por instância Edge (TTL 60 s). Fallback: Google Maps permitido por padrão.
let _frameSrcCache = "https://www.google.com https://maps.google.com";
let _frameSrcExpiry = 0;

async function getFrameSrc(supabaseUrl: string, anonKey: string): Promise<string> {
  const now = Date.now();
  if (now < _frameSrcExpiry) return _frameSrcCache;

  const origins = new Set(["https://www.google.com", "https://maps.google.com"]);

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/store_settings?select=location_url&limit=1`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
    );
    if (res.ok) {
      const rows = (await res.json()) as Array<{ location_url?: string | null }>;
      const locationUrl = rows[0]?.location_url?.trim();
      if (locationUrl) {
        try {
          const { protocol, hostname } = new URL(locationUrl);
          origins.add(`${protocol}//${hostname}`);
        } catch {
          // URL inválida — ignora
        }
      }
    }
  } catch {
    // Falha na rede ou Supabase indisponível — usa cache atual
  }

  _frameSrcCache = Array.from(origins).join(" ");
  _frameSrcExpiry = now + 60_000;
  return _frameSrcCache;
}

function buildCSP(frameSrc: string): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://api.cloudinary.com",
    `frame-src ${frameSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

// ---------------------------------------------------------------------------
// Middleware principal
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Fail-secure: se as variáveis de ambiente não estiverem configuradas,
  // redireciona rotas admin para login em vez de lançar exceção.
  if (!supabaseUrl || !supabaseKey) {
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    supabaseResponse.headers.set("Content-Security-Policy", buildCSP(_frameSrcCache));
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (user && isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  } catch {
    // Fail-secure: qualquer falha do Supabase Auth redireciona para login.
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Aplica CSP com frame-src dinâmico baseado nas URLs configuradas pelo admin.
  const frameSrc = await getFrameSrc(supabaseUrl, supabaseKey);
  supabaseResponse.headers.set("Content-Security-Policy", buildCSP(frameSrc));

  return supabaseResponse;
}

export const config = {
  // Cobre todas as rotas exceto assets estáticos do Next.js e arquivos públicos fixos.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|sw\\.js|icons/).*)",
  ],
};
