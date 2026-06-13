import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin paths EXCEPT /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    let adminPassphrase = process.env.ADMIN_PASSPHRASE || 'admin123';

    try {
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
      if (projectId && dataset) {
        const query = encodeURIComponent('*[_type == "siteSettings"][0]');
        const url = `https://${projectId}.apicdn.sanity.io/v2023-05-03/data/query/${dataset}?query=${query}`;
        
        const res = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60 seconds
        if (res.ok) {
          const json = await res.json();
          if (json.result?.adminPassphrase) {
            adminPassphrase = json.result.adminPassphrase;
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch admin password from Sanity in middleware:', error);
    }

    if (sessionCookie !== adminPassphrase) {
      // Clear cookie if it's invalid and redirect with error
      const response = NextResponse.redirect(new URL('/admin/login?error=true', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

// Matching paths starting with /admin
export const config = {
  matcher: ['/admin/:path*'],
};
