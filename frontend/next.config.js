module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

    // Important: return the modified config
    return config
  },
  env: {
    DEV_API_HOST: "http://localhost:5000",
    PROD_API_HOST: "https://breadcrumbfilexplorer.herokuapp.com",
    NEXT_ENV: "development",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:5000/api/:path*`, // Proxy to Backend
      },
    ];
  },
};
