const http = require('http');
const os = require('os');
const { GAME_HTML } = require('./gameHtml');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(GAME_HTML);
});

function getLocalIps() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ name, ip: net.address });
      }
    }
  }
  return addresses;
}

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIps();
  console.log('\n=================================================');
  console.log('  Water Sort Web Server is running!');
  console.log(`  - Local:    http://localhost:${PORT}`);
  if (ips.length > 0) {
    ips.forEach(item => {
      console.log(`  - Network:  http://${item.ip}:${PORT}  (${item.name})`);
    });
    console.log('\n  Mobile phone me dekhne ke liye:');
    console.log(`  Apne phone ke browser me 'http://${ips[0].ip}:${PORT}' open karein`);
    console.log('  (Make sure phone aur PC same Wi-Fi network par hon)');
  } else {
    console.log(`  - Network:  http://0.0.0.0:${PORT}`);
  }
  console.log('=================================================\n');
});
