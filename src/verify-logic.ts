import { calculateSubnet, isValidIP } from './lib/subnet-logic';

function test(ip: string, cidr: number) {
  console.log(`Testing ${ip}/${cidr}...`);
  if (!isValidIP(ip)) {
    console.log(`  Invalid IP: ${ip}`);
    return;
  }
  const results = calculateSubnet(ip, cidr);
  console.log(`  Network: ${results.networkAddress}`);
  console.log(`  Broadcast: ${results.broadcastAddress}`);
  console.log(`  First Host: ${results.firstHost}`);
  console.log(`  Last Host: ${results.lastHost}`);
  console.log(`  Total Hosts: ${results.totalHosts}`);
  console.log(`  Type: ${results.ipType}`);
  console.log(`  Class: ${results.ipClass}`);
  console.log(`  Risk: ${results.riskLevel}`);
  console.log('---');
}

console.log('--- IP SUBNET CALCULATOR VERIFICATION ---');

// Standard /24
test('192.168.1.5', 24);

// Class A /8
test('10.0.0.1', 8);

// Class B /16
test('172.16.50.10', 16);

// /30 (Point-to-point old)
test('1.2.3.4', 30);

// /31 (Point-to-point new RFC 3021)
test('8.8.8.8', 31);

// /32 (Host)
test('4.4.4.4', 32);

// Invalid IP
test('256.0.0.1', 24);
test('1.2.3', 24);

console.log('--- VERIFICATION COMPLETE ---');
