// Inline core logic for verification
function ipToInt(ip) {
  const parts = ip.split('.');
  return (
    (parseInt(parts[0], 10) * Math.pow(2, 24)) +
    (parseInt(parts[1], 10) * Math.pow(2, 16)) +
    (parseInt(parts[2], 10) * Math.pow(2, 8)) +
    parseInt(parts[3], 10)
  ) >>> 0;
}

function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') return false;
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && part === num.toString();
  });
}

function getIPType(ip) {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  const first = parts[0];
  const second = parts[1];
  if (first === 127) return 'Loopback';
  if (first === 10) return 'Private';
  if (first === 172 && second >= 16 && second <= 31) return 'Private';
  if (first === 192 && second === 168) return 'Private';
  if (first === 169 && second === 254) return 'Link-Local';
  if (first >= 224 && first <= 239) return 'Multicast';
  if (first >= 240) return 'Reserved';
  return 'Public';
}

function calculateSubnet(ip, cidr) {
  const ipLong = ipToInt(ip);
  const maskLong = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = cidr === 32 ? networkLong : (networkLong | (~maskLong)) >>> 0;
  
  let firstHostLong, lastHostLong, totalHosts;
  if (cidr === 32) {
    firstHostLong = networkLong; lastHostLong = networkLong; totalHosts = 1;
  } else if (cidr === 31) {
    firstHostLong = networkLong; lastHostLong = (networkLong + 1) >>> 0; totalHosts = 2;
  } else if (cidr === 0) {
    firstHostLong = 1; lastHostLong = 0xfffffffe; totalHosts = 4294967294;
  } else {
    firstHostLong = (networkLong + 1) >>> 0;
    lastHostLong = (broadcastLong - 1) >>> 0;
    totalHosts = Math.pow(2, 32 - cidr) - 2;
  }
  
  return {
    networkAddress: intToIp(networkLong),
    broadcastAddress: intToIp(broadcastLong),
    firstHost: intToIp(firstHostLong),
    lastHost: intToIp(lastHostLong),
    totalHosts: Math.max(0, totalHosts),
    ipType: getIPType(ip)
  };
}

function test(ip, cidr) {
  process.stdout.write(`Testing ${ip}/${cidr}... `);
  if (!isValidIP(ip)) {
    console.log(`INVALID format`); return;
  }
  const r = calculateSubnet(ip, cidr);
  console.log(`NET: ${r.networkAddress}, BC: ${r.broadcastAddress}, HOSTS: ${r.totalHosts}, TYPE: ${r.ipType}`);
}

console.log('--- VERIFYING LOGIC ---');
test('192.168.1.5', 24);
test('10.0.0.1', 8);
test('172.16.50.10', 16);
test('1.2.3.4', 30);
test('8.8.8.8', 31);
test('4.4.4.4', 32);
test('256.0.0.1', 24);
test('0.0.0.0', 0);
console.log('--- DONE ---');
