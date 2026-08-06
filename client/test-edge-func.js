import botDetector from './netlify/edge-functions/bot-detector.js';

// Mock context
const context = {
  next: () => new Response("MOCK_NEXT_RESPONSE (React SPA)", { status: 200 })
};

// Mock Netlify.env
globalThis.Netlify = {
  env: {
    get: (key) => {
      if (key === 'VITE_API_URL') return 'https://picklejar-backend-2n9l.onrender.com';
      return null;
    }
  }
};

async function testRequest(url, userAgent) {
  console.log(`\n--- Testing ${url} with User-Agent: ${userAgent} ---`);
  const req = new Request(url, {
    headers: { 'user-agent': userAgent }
  });
  
  const res = await botDetector(req, context);
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Headers:");
  res.headers.forEach((value, key) => console.log(`  ${key}: ${value}`));
  console.log("Body excerpt:", text.substring(0, 300) + (text.length > 300 ? "..." : ""));
}

async function runTests() {
  // Test 1: Normal user on post
  await testRequest('http://localhost/insurance/how-the-latest-fed-rate-hike-impacts-your-student-loans', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  
  // Test 2: Bot on post
  await testRequest('http://localhost/insurance/how-the-latest-fed-rate-hike-impacts-your-student-loans', 'facebookexternalhit/1.1');
  
  // Test 3: Bot on api route
  await testRequest('http://localhost/api/posts/some-post', 'Twitterbot');
  
  // Test 4: Bot on homepage
  await testRequest('http://localhost/', 'LinkedInBot');
}

runTests().catch(console.error);
