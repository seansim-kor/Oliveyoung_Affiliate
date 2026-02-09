// Cloudflare Worker that serves static assets from the Vite build
// This allows the K-Beauty Mirror app to run on Cloudflare Workers

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // If requesting the root, serve index.html
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    try {
      // Try to fetch the asset from the dist directory
      const response = await fetch(new Request(
        new URL(`./dist${pathname}`, request.url).toString(),
        request
      ));

      // If asset not found, serve index.html (for SPA routing)
      if (response.status === 404 && !pathname.includes('.')) {
        return fetch(new Request(
          new URL('./dist/index.html', request.url).toString(),
          { method: 'GET' }
        ));
      }

      return response;
    } catch (error) {
      // If there's an error, return 404
      return new Response('Not Found', { status: 404 });
    }
  }
};
