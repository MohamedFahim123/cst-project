export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://${req.headers.host}/sitemap.xml`);
}
