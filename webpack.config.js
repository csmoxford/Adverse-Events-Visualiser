var webpack = require("webpack");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: "dist/assets",
		filename: "bundle.js",
		publicPath: "assets"
	},
	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000
	},
	resolve: {
    extensions: ['','.js', '.jsx']
  },
  plugins: [
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
    ],
	module: {
		loaders: [
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader'
      },
			{
				test: /\.js$|\.jsx$/,
				exclude: /(node_modules)/,
				loader: "babel-loader",
				query: {
					presets: ["react", "env"]
				}
			},
			{
				test: /\.json$/,
				exclude: /(node_modules)/,
				loader: "json-loader"
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!autoprefixer-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
			}
		]
	}
}
