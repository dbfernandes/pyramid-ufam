/** @type {import('next').NextConfig} */

require("dotenv").config();

module.exports = {
	/*async redirects() {
		return [
			{
				source: '/',
				destination: '/home',
				permanent: true
			}
		]
	},*/
	swcMinify: false,
	reactStrictMode: true,
	env: {
		img: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/img`,
		api: `${process.env.NEXT_PUBLIC_API_URL}`,
		title: "Aacc",
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};
