const gulp = require("gulp");
const gulpIf = require("gulp-if");
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const babelify = require("babelify");
const hbsfy = require("hbsfy").configure({extensions: ["hbs"]});
const jshint = require("gulp-jshint");
const stylish = require("jshint-stylish");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const useref = require("gulp-useref");

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

gulp.task("sass", function() {
  return gulp.src("src/sass/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ["> 1%"] }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("useref", ["sass", "babel"], function() {
  return gulp.src("src/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", ["browserSync", "babel", "sass"], function() {
  gulp.watch("src/sass/**/*.scss", ["sass"]);
  gulp.watch("src/js.es6/**/*.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
