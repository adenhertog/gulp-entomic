var gulp = require("gulp");
var gutil = require("gulp-util");
var coffee = require("gulp-coffee");
var del = require("del");
var plumber = require("gulp-plumber");
var mocha = require("gulp-mocha");

var entomic = require("./");

const DIST = "./";
const TEST = "./output";

gulp.task("default", ["clean"], function () {
	gulp.start("watch");
});

gulp.task("watch", function () {
	//watch .coffee files
	gulp.watch(["./**/*.coffee", "!./node_modules/**"], ["test"]);
});

gulp.task("clean", function (cb) {
	del(["index.js"], cb);
});

gulp.task("compile", function () {
	return gulp.src(["./**/*.coffee", "!./node_modules/**"])
		.pipe(plumber())
		.pipe(coffee({ bare: true }))
		.pipe(gulp.dest(DIST));
});

gulp.task("test", ["compile"], function () {
	return gulp.src("./test/**/*.js")
		.pipe(plumber())
		.pipe(mocha());
});

gulp.task("mock", function(){
	return gulp.src("./test/fixtures/*.html")
		.pipe(plumber())
		.pipe(entomic({ componentPath: "./test/fixtures/components" }))
		.pipe(gulp.dest(TEST));
});