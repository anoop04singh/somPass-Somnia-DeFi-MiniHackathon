import React from 'react';

interface AddressAvatarProps {
  address: string;
  className?: string;
}

// Simple hash function to get a number from a string
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate a color palette from the address
const generateColors = (address: string): [string, string, string] => {
  const hash = simpleHash(address.toLowerCase());
  
  const h = (hash % 360);
  const s = 50 + (hash % 25); // Saturation between 50 and 75
  const l = 40 + (hash % 20); // Lightness between 40 and 60

  const color1 = `hsl(${h}, ${s}%, ${l}%)`;
  const color2 = `hsl(${(h + 90) % 360}, ${s}%, ${l + 10}%)`;
  const color3 = `hsl(${(h + 180) % 360}, ${s}%, ${l + 5}%)`;

  return [color1, color2, color3];
};

export const AddressAvatar = ({ address, className }: AddressAvatarProps) => {
  if (!address) {
    return <div className={`rounded-full bg-gray-700 ${className}`} />;
  }

  const [color1, color2, color3] = generateColors(address);

  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${address}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color1 }} />
            <stop offset="100%" style={{ stopColor: color2 }} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#grad-${address})`} />
        <circle cx="25" cy="75" r="40" fill={color3} opacity="0.5" />
        <circle cx="80" cy="30" r="35" fill={color1} opacity="0.6" />
      </svg>
    </div>
  );
};