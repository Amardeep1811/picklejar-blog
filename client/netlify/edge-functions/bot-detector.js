export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  
  // Exclude static files, API routes, and special paths
  const excludePaths = ['/api/', '/static/', '/assets/', '/sitemap.xml', '/robots.txt'];
  if (excludePaths.some(path => url.pathname.startsWith(path) || url.pathname === path)) {
    return context.next();
  }

  // Known bot signatures (case-insensitive checking later)
  const bots = [
    'facebookexternalhit',
    'Twitterbot',
    'WhatsApp',
    'LinkedInBot',
    'Slackbot',
    'TelegramBot',
    'Discordbot'
  ];
  
  const isBot = bots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
  
  if (!isBot) {
    return context.next();
  }
  
  // It's a bot.
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  // Fallback defaults from existing index.html
  let title = "WalletPickle";
  let description = "The best place for sports and finance news.";
  let imageUrl = "https://walletpickle.com/favicon.svg"; 
  let canonicalUrl = url.href;

  let apiUrl = Netlify.env.get("VITE_API_URL") || "https://picklejar-backend-2n9l.onrender.com";
  // Strip trailing slash and /api if present to normalize
  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1);
  }
  if (apiUrl.endsWith('/api')) {
    apiUrl = apiUrl.slice(0, -4);
  }

  // Post URL: /{verticalSlug}/{postSlug}
  if (pathParts.length === 2) {
    const postSlug = pathParts[1];
    
    try {
      // 3-second timeout for the backend fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(`${apiUrl}/api/posts/${postSlug}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const post = json.data;
          title = post.title || title;
          description = post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '') : description;
          imageUrl = post.bannerImage || imageUrl;
        }
      }
    } catch (err) {
      console.error("Error fetching post data for bot (falling back to defaults):", err);
      // On timeout or failure, we just fall back to the default tags set above.
    }
  } 
  // Vertical page or Homepage (pathParts.length === 1 or 0)
  // For these, we just use the default tags as requested.
  
  // Construct minimal HTML response
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta name="description" content="${description}">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="${canonicalUrl}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${imageUrl}">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="${canonicalUrl}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${imageUrl}">
    </head>
    <body>
      <p>This is a lightweight preview for social media crawlers. <a href="${canonicalUrl}">Click here</a> to visit the full page.</p>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60" 
    }
  });
};
