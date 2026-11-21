const http = require('http');
const { GAME_HTML } = require('./gameHtml');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(GAME_HTML);
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`  Water Sort Web is running at: http://localhost:${PORT}`);
  console.log(`=================================================\n`);
});

