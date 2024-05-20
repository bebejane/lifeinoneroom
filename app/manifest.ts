import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'A Life in a Room',
    short_name: 'A Life in a Room',
    description: 'A Life in a Room',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f6f3ee',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}