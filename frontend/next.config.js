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
	reactStrictMode: true,
	env: {
		img: `${process.env.FRONTEND_URL}/img`,
		api: `${process.env.API_URL}`,
		title: "Pyramid",
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};
