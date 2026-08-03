import express from 'express';
import Post from '../models/Post.js';
import Vertical from '../models/Vertical.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).populate('vertical', 'slug');
    const verticals = await Vertical.find({ active: true });

    const baseUrl = process.env.CLIENT_URL || 'https://walletpickle.com';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add homepage
    xml += `  <url>\n    <loc>${baseUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Add verticals
    for (const vertical of verticals) {
      xml += `  <url>\n    <loc>${baseUrl}/${vertical.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // Add posts
    for (const post of posts) {
      const verticalSlug = post.vertical ? post.vertical.slug : 'vertical';
      xml += `  <url>\n    <loc>${baseUrl}/${verticalSlug}/${post.slug}</loc>\n    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
