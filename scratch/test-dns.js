const dns = require('dns').promises;

async function test() {
  try {
    const addresses = await dns.resolveSrv('_mongodb._tcp.cluster0.mqpvubr.mongodb.net');
    console.log('SRV Records:', addresses);
  } catch (err) {
    console.error('DNS SRV Error:', err);
  }
}

test();
