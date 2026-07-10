import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // getClaims verifica o JWT localmente quando o projeto usa chaves de
  // assinatura assimétricas (sem round-trip de rede por navegação, com JWKS
  // em cache). Se a chave for simétrica, faz fallback automático para
  // getUser() — ou seja, nunca menos seguro que antes. O refresh do token
  // continua ocorrendo via setAll dos cookies.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const isPublicRoute = request.nextUrl.pathname === "/";

  // Não autenticado tentando acessar rota protegida
  if (!user && !isAuthRoute && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Autenticado tentando acessar /login
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/servicos";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
