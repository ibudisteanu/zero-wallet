module.exports = {
    extractCSS: process.argv.includes('--production'),
    preserveWhitespace: false,
    postcss: [
        require('autoprefixer')({
            browsers: ['last 3 versions']
        })
    ]
}
