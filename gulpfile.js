const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const webp = require("gulp-webp");
const del = require("del");
const svgstore = require("gulp-svgstore");

// Css
const css = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.css = css;

// Styles
const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//Html
const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream())
}

exports.html = html;

//Js
const js = () => {
  return gulp.src("source/js/**.js")
  .pipe(gulp.dest("build/js"))
}

exports.js = js;

//Sprite
const sprite = () => {
  return gulp.src(["source/img/**/icon-*.svg", "source/img/htmlacademy.svg"])
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))
}

exports.sprite = sprite;

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.watcher = watcher;

//Clean
const clean = () => {
  return del("build");
}

exports.clean = clean;

//Copy
const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico",
    "source/*.html",
    "source/css/**",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
}

exports.copy = copy;

//Webp
const image = () => {
  return gulp.src("source/img/**/*.{jpg,jpeg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"))
    .pipe(sync.stream());
}

exports.image = image;

//Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", sync.reload);
  gulp.watch("source/js/**.js", gulp.series("js")).on("change", sync.reload);
  done();
}

exports.server = server;

//Build
exports.build = gulp.series(
  clean,
  copy,
  css,
  styles,
  html,
  js,
  image,
);

//Start
exports.default = gulp.series(
  clean,
  copy,
  css,
  styles,
  html,
  js,
  image,
  server
);
