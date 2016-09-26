const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const babelify = require("babelify");
const hbsfy = require("hbsfy").configure({extensions: ["hbs"]});
const jshint = require("gulp-jshint");
const stylish = require("jshint-stylish");

gulp.task("browserSync", function() {
  browserSync.init({
    server: { baseDir: "src" }
  });
});

gulp.task("lint", function() {
  return gulp.src("src/js.es6/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task("babel", ["lint"], function() {
  return browserify("src/js.es6/app.js", { transform: [babelify, hbsfy] })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("watch", ["browserSync", "babel"], function() {
  gulp.watch("src/js.es6/**/*.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
