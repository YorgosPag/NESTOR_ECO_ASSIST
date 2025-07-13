import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12a10 10 0 0 1 10-10c5.523 0 10 4.477 10 10s-4.477 10-10 10" />
      <path d="M12 2a15.3 15.3 0 0 0-6 10 15.3 15.3 0 0 0 6 10" />
      <path d="M12 2a15.3 15.3 0 0 1 6 10 15.3 15.3 0 0 1-6 10" />
    </svg>
  );
}
