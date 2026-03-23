export type IPClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'Invalid';
export type IPType = 'Private' | 'Public' | 'Loopback' | 'Reserved';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface SubnetResults {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  ipClass: IPClass;
  ipType: IPType;
  riskLevel: RiskLevel;
  subnetMask: string;
}

// Convert "192.168.1.1" to 32-bit unsigned integer
export function ipToInt(ip: string): number {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Convert 32-bit unsigned integer back to "192.168.1.1"
export function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

// Validate basic IP format
export function isValidIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && part === num.toString(); // prevents "01" or empty string
  });
}

// Generate an array of objects for the CIDR dropdown
export function getCidrOptions() {
  const options = [];
  for (let i = 1; i <= 32; i++) {
    const maskInt = (0xffffffff << (32 - i)) >>> 0;
    options.push({
      value: i,
      label: `/${i} — ${intToIp(maskInt)}`
    });
  }
  return options;
}

// Get the class of an IP address based on its first octet
export function getIPClass(ip: string): IPClass {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E';
  return 'Invalid';
}

// Determine if an IP is private, public, etc.
export function getIPType(ip: string): IPType {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  
  if (parts[0] === 10) return 'Private';
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return 'Private';
  if (parts[0] === 192 && parts[1] === 168) return 'Private';
  if (parts[0] === 127) return 'Loopback';
  if (parts[0] === 169 && parts[1] === 254) return 'Reserved'; // APIPA
  
  return 'Public';
}

// Determine Risk level based on network size and type
export function getRiskLevel(type: IPType, cidr: number): RiskLevel {
  if (type === 'Private') {
    return cidr >= 24 ? 'Low' : 'Medium';
  } else {
    // Public or other
    return cidr >= 24 ? 'Medium' : 'High';
  }
}

// Main calculation function
export function calculateSubnet(ip: string, cidr: number): SubnetResults {
  const ipLong = ipToInt(ip);
  const maskLong = (0xffffffff << (32 - cidr)) >>> 0;
  
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | (~maskLong)) >>> 0;
  
  let firstHostLong = networkLong;
  let lastHostLong = broadcastLong;
  let totalHosts = 0;
  
  if (cidr === 32) {
    totalHosts = 1;
  } else if (cidr === 31) {
    totalHosts = 2; // Point-to-point links (RFC 3021)
    // For /31, network and broadcast are technically host addresses
  } else {
    firstHostLong = (networkLong + 1) >>> 0;
    lastHostLong = (broadcastLong - 1) >>> 0;
    totalHosts = Math.pow(2, 32 - cidr) - 2;
  }
  
  const type = getIPType(ip);
  
  return {
    networkAddress: intToIp(networkLong),
    broadcastAddress: intToIp(broadcastLong),
    firstHost: intToIp(firstHostLong),
    lastHost: intToIp(lastHostLong),
    totalHosts: Math.max(0, totalHosts),
    ipClass: getIPClass(ip),
    ipType: type,
    riskLevel: getRiskLevel(type, cidr),
    subnetMask: intToIp(maskLong)
  };
}
