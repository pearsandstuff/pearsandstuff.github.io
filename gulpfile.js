const { src, dest, watch, series } = require("gulp");
const cache = require("gulp-cached");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// Transpile and minify files that have been changed
function build() {
	return src("./_scripts/**/*.js")
		.pipe(cache("build"))
		.pipe(babel({
			presets: ["env"]
		}))
		.pipe(uglify())
		.pipe(dest("./scripts"))
}

// Just move the files without minifying/transpiling.
function move() {
	return src("./_scripts/**/*.js")
		.pipe(cache("move"))
		.pipe(dest("./scripts"))
}

// Delete the caches to ensure all files are moved.
function uncache(cb) {
	cache.caches = {};
	cb();
}

// Build will transpile and minify files for production.
exports.build = build;
// Move will just move files directly for easier debugging.
exports.move = series(uncache, move);

exports.default = function() {
	exports.move();
	watch("./_scripts/**/*.js", move);
}