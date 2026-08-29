export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
    }
  ];

  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api';
    
    // Fetch Verticals
    const verticalsRes = await fetch(`${apiUrl}/verticals`);
    if (verticalsRes.ok) {
      const vData = await verticalsRes.json();
      if (vData.success) {
        vData.data.forEach(v => {
          routes.push({
            url: `${baseUrl}/${v.slug}`,
            lastModified: new Date(),
          });
        });
      }
    }

    // Fetch Posts (fetching a large batch for the sitemap)
    const postsRes = await fetch(`${apiUrl}/posts?status=published&limit=5000`);
    if (postsRes.ok) {
      const pData = await postsRes.json();
      if (pData.success) {
        pData.data.forEach(post => {
          const vSlug = post.vertical?.slug || 'vertical';
          let date = new Date(post.updatedAt || post.createdAt);
          if (isNaN(date.getTime())) date = new Date();
          routes.push({
            url: `${baseUrl}/${vSlug}/${post.slug}`,
            lastModified: date,
          });
        });
      }
    }
  } catch (err) {
    console.error('Failed to generate full sitemap:', err);
  }

  return routes;
}
