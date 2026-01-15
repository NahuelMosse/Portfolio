import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nahuel Mosse - Software Engineer Portfolio',
    short_name: 'Nahuel Mosse',
    description: 'Software Engineer specializing in full-stack development with Node.js, React, TypeScript, and PostgreSQL',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#86efac',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
