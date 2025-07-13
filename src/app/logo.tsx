import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="24"
      height="24"
      {...props}
    >
      <path
        d="M224 128a96 96 0 1 1-96-96 96 96 0 0 1 96 96Z"
        opacity="0.2"
        fill="currentColor"
      />
      <path
        d="M128 32a96 96 0 0 0 0 192c48.74 0 90-35.53 95.34-82.66a8 8 0 0 0-7.88-9.34h-48.2a8 8 0 0 0-7.85 6.6C156.4 153.21 143 160 128 160a32 32 0 0 1-32-32 32.12 32.12 0 0 1 .52-5.78A56 56 0 1 0 32 128c0 14.88 5.86 28.53 15.42 38.6A96.34 96.34 0 0 0 128 32Z"
        fill="currentColor"
      />
    </svg>
  );
}
