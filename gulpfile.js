const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const runSequence = require('run-sequence')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const cssmin = require('gulp-cssmin')
const cssimport = require("gulp-cssimport")
const path = require('path')
const nameOVA = path.basename(__dirname)

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

gulp.task('watch', () => {
  browserSync.init({
    startPath: 'BDA',
    server: { baseDir: '.' }
  })

  gulp.watch('common/**/*', browserSync.reload)
  gulp.watch('BDA/*.html', browserSync.reload)
  gulp.watch('BDA/css/**/*.css', browserSync.reload)
  gulp.watch('BDA/js/**/*.js', browserSync.reload)
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
  return gulp.src('BDA/css/*.css')
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(cssmin())
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/css`))
})

gulp.task('scripts:prod', () => {
  return gulp.src('BDA/js/*.js')
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(uglify())
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/js`))
})

gulp.task('iframes:prod', () => {
  return gulp.src('BDA/iframes/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/iframes`))
})

gulp.task('audios:prod', () => {
  return gulp.src('BDA/audio/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/BDA/audio`))
})

gulp.task('common:prod', () => {
  return gulp.src('common/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/common`))
})

gulp.task('build', (callback) => {
  runSequence(['common:prod', 'html:prod', 'styles:prod', 'scripts:prod', 'images:prod', 'audios:prod', 'iframes:prod'], callback)
})
