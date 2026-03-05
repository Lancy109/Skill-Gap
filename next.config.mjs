/** @type {import('next').NextConfig} */
const nextConfig = {
    // Helpful for Vercel builds to ensure all files are traces correctly
    output: 'standalone',
    // Ensure images from external creators work
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'yt3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
        ],
    },
};

export default nextConfig;
