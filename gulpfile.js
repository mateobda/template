// const gulp = require('gulp')
// const uglify = require('gulp-uglify')
// const imagemin = require('gulp-imagemin')
// const cache = require('gulp-cache')
// const autoprefixer = require('gulp-autoprefixer')
// const babel = require('gulp-babel')
// const htmlmin = require('gulp-htmlmin')
// const cssmin = require('gulp-cssmin')
// const cssimport = require("gulp-cssimport")

const pkg = require('./package.json')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')({
  pattern: ["*"],
  scope: ["devDependencies"]
})
const browserSync = require('browser-sync').create()
const runSequence = require('run-sequence')
const path = require('path')
const nameOVA = path.basename(__dirname)

gulp.task('vendors', () => {
  return gulp.src('common/base/css/_vendors/vendors.css')
  .pipe($.cssimport())
  .pipe($.cssmin())
  .pipe(gulp.dest('common/base/css/'))
})

gulp.task('styles:common', () => {
  return gulp.src('common/base/css/_styles/main.css')
  .pipe($.cssimport())
  .pipe($.cssmin())
  .pipe(gulp.dest('common/base/css/'))
})

gulp.task('default', () => {
  browserSync.init({
    server: {
      baseDir: '.'
    },
  })

  gulp.watch(['*.html', 'content/*.html', 'common/**/*'], browserSync.reload)
})

gulp.task('html:content', () => {
  return gulp.src(['content/*.html', 'content/navigation.json'])
  .pipe($.htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: {compress: {drop_console: true}},
    processConditionalComments: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  }))
  .pipe(gulp.dest(`../${nameOVA}_build/content`))
})

gulp.task('html:viewer', () => {
  return gulp.src('index.html')
  .pipe($.htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: {compress: {drop_console: true}},
    processConditionalComments: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  }))
  .pipe(gulp.dest(`../${nameOVA}_build/`))
})

gulp.task('images:prod', () => {
  return gulp.src('images/**/*')
  .pipe($.cache($.imagemin()))
  .pipe(gulp.dest(`../${nameOVA}_build/images`))
})

gulp.task('iframes:prod', () => {
  return gulp.src('iframes/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/iframes`))
})

gulp.task('audios:prod', () => {
  return gulp.src('audio/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/audio`))
})

gulp.task('common:prod', () => {
  return gulp.src('common/**/*')
  .pipe(gulp.dest(`../${nameOVA}_build/common`))
})

gulp.task('build', (callback) => {
  runSequence(['common:prod', 'html:content', 'html:viewer', 'images:prod', 'audios:prod', 'iframes:prod'], callback)
})
