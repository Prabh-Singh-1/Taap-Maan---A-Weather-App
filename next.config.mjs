/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'export',
   webpack(config, options) {
     config.module.rules.push({
       test: /\.(mp4|webm|ogg|swf|ogv)$/,
       use: [
         {
           loader: 'file-loader',
           options: {
             publicPath: '/_next/static/videos/',
             outputPath: 'static/videos/',
             name: '[name].[hash].[ext]',
           },
         },
       ],
     });
 
     return config;
   },
 };
 
 export default nextConfig;