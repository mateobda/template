const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const runSequence = require('run-sequence')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const htmlmin = require('gulp-htmlmin')
const cssmin = require('gulp-cssmin')
const cssimport = require("gulp-cssimport")
const gulpif = require('gulp-if')
const path = require('path')
const nameOVA = path.basename(__dirname)

const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('BDA/css/dev/*.css')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(concat('main.css'))
  .pipe(cssmin())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('BDA/css'))
  .pipe(reload({ stream: true }))
})

gulp.task('vendors', () => {
  return gulp.src('common/base/css/_vendors/vendors.css')
  .pipe(cssimport())
  .pipe(cssmin())
  .pipe(gulp.dest('common/base/css/'))
})

gulp.task('styles:common', () => {
  return gulp.src('common/base/css/_styles/main.css')
  .pipe(cssimport())
  .pipe(cssmin())
  .pipe(gulp.dest('common/base/css/'))
})

gulp.task('scripts', () => {
  return gulp.src('BDA/js/dev/*.js')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(concat('index.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('BDA/js'))
  .pipe(reload({ stream: true }))
})

gulp.task('watch', ['styles', 'scripts'], () => {
  browserSync.init({
    startPath: 'BDA',
    server: { baseDir: '.' }
  })

  gulp.watch('BDA/*.html', browserSync.reload)
  gulp.watch('common/**/*', browserSync.reload)
  gulp.watch('BDA/css/**/*.css', ['styles'])
  gulp.watch('BDA/js/**/*.js', ['scripts'])
})

gulp.task('html:prod', () => {
  return gulp.src('BDA/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: {compress: {drop_console: true}},
    processConditionalComments: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  }))
  .pipe(gulp.dest(`../${nameOVA}_build/BDA`))
})

gulp.task('images:prod', () => {
  return gulp.src('BDA/images/**/*')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/images`))
})

gulp.task('styles:prod', () => {
  return gulp.src(['BDA/css/*.css', '!BDA/css/dev'])
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/css`))
})

gulp.task('scripts:prod', () => {
  return gulp.src(['BDA/js/*.js', '!BDA/js/dev'])
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/js`))
})

gulp.task('iframes:prod', () => {
  return gulp.src('BDA/iframes/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/iframes`))
})

gulp.task('common:prod', () => {
  return gulp.src('common/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/common`))
})

gulp.task('clean', () => del.sync(`../${nameOVA}_build`))

gulp.task('build', (callback) => {
  runSequence('clean', ['html:prod', 'styles:prod', 'scripts:prod', 'images:prod', 'iframes:prod', 'common:prod'], callback)
})
