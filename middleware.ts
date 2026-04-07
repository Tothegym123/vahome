import { updateSession } from '@/app/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// =============================================================
// IP WHITELIST - Only these IPs can access the site
// To disable: set ENABLE_IP_WHITELIST to false
// To add IPs: add them to the ALLOWED_IPS array
// =============================================================
const ENABLE_IP_WHITELIST = true

const ALLOWED_IPS = [
  '47.133.138.47',  // Tom - home/office
  // Add more IPs here as needed:
  // '123.456.789.0',  // Dariya
  // '98.765.432.1',   // Developer
]

export async function middleware(request: NextRequest) {
  // --- IP Whitelist Check ---
  if (ENABLE_IP_WHITELIST) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    // Allow Vercel's own internal requests (cron, ISR, etc.)
    const isVercelInternal = request.headers.get('x-vercel-proxy-signature')

    if (!isVercelInternal && !ALLOWED_IPS.includes(ip)) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VaHome.com - Coming Soon</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .container { max-width: 500px; }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #dc2626, #f97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p { color: rgba(255,255,255,0.6); font-size: 1.1rem; line-height: 1.6; margin-top: 1rem; }
    .badge {
      display: inline-block;
      background: rgba(220,38,38,0.15);
      color: #fca5a5;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.35rem 1rem;
      border-radius: 999px;
      margin-bottom: 1.5rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .contact {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.4);
      font-size: 0.85rem;
    }
    .contact a { color: #dc2626; text-decoration: none; }
    .contact a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">Under Development</div>
    <h1>VaHome.com</h1>
    <p>We're building something great for Hampton Roads home buyers. Our new site is currently under development and will be available soon.</p>
    <div class="contact">
      Questions? Reach us at <a href="mailto:tom@vahomes.com">tom@vahomes.com</a><br>
      or call <a href="tel:7577777577">(757) 777-7577</a>
    </div>
  </div>
</body>
</html>`,
        {
          status: 403,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      )
    }
  }

  // --- Supabase Session Update (existing logic) ---
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
