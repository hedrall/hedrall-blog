const rehypePrism = require("@mapbox/rehype-prism");

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [rehypePrism],
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure pageExtensions to include md and mdx
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    // Optionally, add any other Next.js config below
    reactStrictMode: true,
    webpack: config =>{
        config.module.rules.push(
            ...[
                {
                    test: /\.yml$/,
                    // type: "yaml",
                    use: "yaml-loader",
                },
            ]
        );
        return config;
    }
}

module.exports = withMDX(nextConfig)
// module.exports = withMdxEnhanced({
//   layoutPath: "src/layouts",
//   defaultLayout: true,
//   rehypePlugins: [rehypePrism],
// })({
//   pageExtensions: ["mdx", "tsx"],
//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     config.module.rules.push(
//       ...[
//         {
//           test: /\.yml$/,
//           type: "json",
//           use: "yaml-loader",
//         },
//         {
//           test: /\.svg$/,
//           use: "@svgr/webpack",
//         },
//       ]
//     );
//     return config;
//   },
// });
