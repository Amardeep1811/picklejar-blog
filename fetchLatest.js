const http = require('http');

http.get('http://localhost:5000/api/posts?status=published&limit=9', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('SUCCESS:', parsed.success);
      console.log('TOTAL POSTS RETURNED:', parsed.data.length);
      parsed.data.forEach((post, i) => {
        console.log(`\nPOST ${i + 1}:`);
        console.log(`- ID: ${post._id}`);
        console.log(`- Title: ${post.title}`);
        console.log(`- Status: ${post.status}`);
        console.log(`- EditorsPick: ${post.editorsPick}`);
        console.log(`- CreatedAt: ${post.createdAt}`);
      });
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
  });
}).on('error', (err) => {
  console.error('Request Error: ' + err.message);
});
