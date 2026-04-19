/**
 * IP Subnet Logic Engine - Professional Grade v2
 */

export type IPClass = 'A' | 'B' | 'C' | 'D' | 'E';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface EnumeratedSubnet {
  network: string;
  range: string;
  broadcast: string;
  isCurrent: boolean;
}

export interface SubnetResults {
  ipAddress: string;
  short: string;
  ipInteger: number;
  ipHex: string;
  ipBinary: string;
  networkAddress: string;
  networkBinary: string;
  broadcastAddress: string;
  broadcastBinary: string;
  subnetMask: string;
  subnetMaskBinary: string;
  wildcardMask: string;
  cidr: number;
  usableHostRange: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: IPClass;
  ipType: 'Private' | 'Public';
  riskLevel: RiskLevel;
  ptrRecord: string;
  mappedIPv6: string;
  sixToFourPrefix: string;
  possibleSubnets: EnumeratedSubnet[];
}

export function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function intToIp(int: number): string {
  return [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8) & 0xff,
    int & 0xff
  ].join('.');
}

export function intToBinary(int: number): string {
  const bin = (int >>> 0).toString(2).padStart(32, '0');
  return bin.match(/.{8}/g)!.join('.');
}

export function isValidIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const n = parseInt(part, 10);
    return !isNaN(n) && n >= 0 && n <= 255 && part === n.toString();
  });
}

export function getIPClass(octet: number): IPClass {
  if (octet >= 1 && octet <= 126) return 'A';
  if (octet >= 128 && octet <= 191) return 'B';
  if (octet >= 192 && octet <= 223) return 'C';
  if (octet >= 224 && octet <= 239) return 'D';
  return 'E';
}

export function isPrivateIP(ipInt: number): boolean {
  const first = (ipInt >>> 24) & 0xff;
  const second = (ipInt >>> 16) & 0xff;
  if (first === 10) return true;
  if (first === 172 && (second >= 16 && second <= 31)) return true;
  if (first === 192 && second === 168) return true;
  return false;
}

export function getCidrOptions(ipClass: IPClass | 'Any' = 'Any') {
  const options = [];
  let start = 1;
  if (ipClass === 'A') start = 8;
  if (ipClass === 'B') start = 16;
  if (ipClass === 'C') start = 24;
  for (let i = start; i <= 32; i++) {
    const maskInt = i === 0 ? 0 : (0xffffffff << (32 - i)) >>> 0;
    options.push({ value: i, label: `${intToIp(maskInt)} /${i}` });
  }
  return options;
}

/**
 * 6to4 Prefix Generation (RFC 3056)
 */
export function get6to4Prefix(ip: string): string {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  const hex1 = parts[0].toString(16).padStart(2, '0');
  const hex2 = parts[1].toString(16).padStart(2, '0');
  const hex3 = parts[2].toString(16).padStart(2, '0');
  const hex4 = parts[3].toString(16).padStart(2, '0');
  return `2002:${hex1}${hex2}:${hex3}${hex4}::/48`;
}

/**
 * Generate all possible subnets in the parent /24 (or applicable range)
 */
export function generateSubnetList(ipInt: number, cidr: number): EnumeratedSubnet[] {
  if (cidr < 1) return [];
  
  const maskInt = (0xffffffff << (32 - cidr)) >>> 0;
  const currentNetwork = (ipInt & maskInt) >>> 0;
  const list: EnumeratedSubnet[] = [];

  // Determine starting point and iterations
  // If CIDR >= 24, we loop 0-255 in the last octet
  // If CIDR < 24, looping 0-255 in the last octet is too basic, 
  // but the user asked for "Loop from 0 -> 255" and "X.X.X.*"
  
  const basePrefix = (ipInt & 0xffffff00) >>> 0; // The X.X.X.0 boundary
  const realStep = Math.pow(2, 32 - cidr);

  // If cidr < 24, we show the subnets that intersect this /24
  // If cidr >= 24, we show all subnets in this /24
  
  if (cidr >= 24) {
    for (let i = 0; i < 256; i += realStep) {
      const net = (basePrefix | i) >>> 0;
      const br = (net | (realStep - 1)) >>> 0;
      const uStart = net + 1;
      const uEnd = br - 1;
      
      list.push({
        network: intToIp(net),
        range: realStep > 2 ? `${intToIp(uStart)} - ${intToIp(uEnd)}` : (realStep === 2 ? `${intToIp(net)} - ${intToIp(br)}` : intToIp(net)),
        broadcast: intToIp(br),
        isCurrent: net === currentNetwork
      });
    }
  } else {
    // For CIDR < 24, the "Step" spans multiple /24s. 
    // We'll just show the one current subnet as the user's requirement focus seems to be CIDR >= 24
    // based on "Loop from 0 -> 255"
    list.push({
      network: intToIp(currentNetwork),
      range: '...',
      broadcast: intToIp((currentNetwork | (~maskInt)) >>> 0),
      isCurrent: true
    });
  }

  return list;
}

export function calculateSubnet(ip: string, cidr: number): SubnetResults {
  const ipInt = ipToInt(ip);
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt)) >>> 0;
  
  const totalHosts = Math.pow(2, 32 - cidr);
  let usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;
  let usableStart = networkInt + 1;
  let usableEnd = broadcastInt - 1;

  if (cidr === 31) { usableStart = networkInt; usableEnd = broadcastInt; usableHosts = 2; } 
  else if (cidr === 32) { usableStart = networkInt; usableEnd = networkInt; usableHosts = 1; }

  const hexHex = (ipInt >>> 0).toString(16).toUpperCase().padStart(8, '0');
  
  return {
    ipAddress: ip,
    short: `${ip}/${cidr}`,
    ipInteger: ipInt,
    ipHex: `0x${hexHex}`,
    ipBinary: intToBinary(ipInt),
    networkAddress: intToIp(networkInt),
    networkBinary: intToBinary(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    broadcastBinary: intToBinary(broadcastInt),
    subnetMask: intToIp(maskInt),
    subnetMaskBinary: intToBinary(maskInt),
    wildcardMask: intToIp((~maskInt) >>> 0),
    cidr,
    usableHostRange: usableHosts > 0 ? `${intToIp(usableStart)} - ${intToIp(usableEnd)}` : 'N/A',
    totalHosts,
    usableHosts,
    ipClass: getIPClass((ipInt >>> 24) & 0xff),
    ipType: isPrivateIP(ipInt) ? 'Private' : 'Public',
    riskLevel: isPrivateIP(ipInt) ? (cidr >= 24 ? 'Low' : 'Medium') : (cidr >= 24 ? 'Medium' : 'High'),
    ptrRecord: ip.split('.').reverse().join('.') + '.in-addr.arpa',
    mappedIPv6: `::ffff:${hexHex.slice(0, 4)}:${hexHex.slice(4)}`.toLowerCase(),
    sixToFourPrefix: get6to4Prefix(ip),
    possibleSubnets: generateSubnetList(ipInt, cidr)
  };
}

/**
 * IPv6 Logic (Preserved)
 */
export interface IPv6Results {
  networkPrefix: string;
  prefixLength: number;
  totalAddresses: string;
}

export function isValidIPv6(ip: string): boolean {
  if (!ip) return false;
  const regex = /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){1,7}:|(?:[a-fA-F\d]{1,4}:){1,6}:[a-fA-F\d]{1,4}|(?:[a-fA-F\d]{1,4}:){1,5}(?::[a-fA-F\d]{1,4}){1,2}|(?:[a-fA-F\d]{1,4}:){1,4}(?::[a-fA-F\d]{1,4}){1,3}|(?:[a-fA-F\d]{1,4}:){1,3}(?::[a-fA-F\d]{1,4}){1,4}|(?:[a-fA-F\d]{1,4}:){1,2}(?::[a-fA-F\d]{1,4}){1,5}|[a-fA-F\d]{1,4}:(?::[a-fA-F\d]{1,4}){1,6}|:(?:(?::[a-fA-F\d]{1,4}){1,7}|:))$/;
  return regex.test(ip);
}

export function calculateIPv6Subnet(ip: string, prefix: number): IPv6Results {
  const total = BigInt(2) ** BigInt(128 - prefix);
  return {
    networkPrefix: ip.split('::')[0] + '::',
    prefixLength: prefix,
    totalAddresses: total > BigInt(1e15) ? total.toExponential(2) : total.toString()
  };
}

declare global {
  interface BigInt {
    toExponential(fractionDigits?: number): string;
  }
}

BigInt.prototype.toExponential = function(fractionDigits?: number) {
  const s = this.toString();
  const exponent = s.length - 1;
  const firstDigit = s[0];
  const restDigits = s.slice(1, (fractionDigits || 0) + 1);
  return `${firstDigit}.${restDigits}e+${exponent}`;
};
