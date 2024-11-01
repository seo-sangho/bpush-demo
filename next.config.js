/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // stricMode는 일부 이벤트가 두번 호출됨
  async rewrites() {
    return [
      {
        source: '/bpush/:path*',
        destination: 'http://172.29.58.64:8283/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
