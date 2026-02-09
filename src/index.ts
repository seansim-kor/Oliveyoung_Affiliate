export default {
  async fetch(request: Request) {
    return new Response('Not Found', { status: 404 });
  },
};
