const gulp = require('gulp')
const $ = require('gulp-load-plugins')({ pattern: ["*"], scope: ["devDependencies"] })
const browserSync = require('browser-sync').create()
const runSequence = require('run-sequence')
const path = require('path')
const nameOVA = path.basename(__dirname)

gulp.task('styles', () => {
  return gulp.src('./common/base/css/main.css')
    .pipe($.cssimport())
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe($.cssmin())
    .pipe($.rename('bundle.css'))
    .pipe(gulp.dest('common/base/css/'))
})

gulp.task('default', () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: '.'
    }
  })

  gulp.watch(['*.html', 'content/*.html', 'common/**/*'], browserSync.reload)
})

gulp.task('html:content', () => {
  return gulp.src(['content/*.html', 'content/navigation.json'])
    .pipe($.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {
        compress: {
          drop_console: true
        }
      },
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(gulp.dest(`../${nameOVA}_build/content`))
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

gulp.task('html:viewer', () => {
  return gulp.src('index.html')
    .pipe($.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {
        compress: {
          drop_console: true
        }
      },
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(gulp.dest(`../${nameOVA}_build/`))
})

gulp.task('styles:prod', () => {
  return gulp.src('./common/base/css/bundle.css')
    .pipe(gulp.dest(`../${nameOVA}_build/common/base/css/`))
})

gulp.task('scripts:viewer', () => {
  return gulp.src('./common/base/js/viewer.js')
    .pipe($.babel({ presets: ['env'] }))
    .pipe($.uglify())
    .pipe(gulp.dest(`../${nameOVA}_build/common/base/js/`))
})

gulp.task('scripts:main', () => {
  return gulp.src('./common/base/js/main.js')
    .pipe(gulp.dest(`../${nameOVA}_build/common/base/js/`))
})

gulp.task('common:base', ['styles:prod', 'scripts:viewer', 'scripts:main'], () => {
  return gulp.src(['./common/base/*/*', '!./common/base/js/*', '!./common/base/css/*'])
    .pipe(gulp.dest(`../${nameOVA}_build/common/base`))
})

gulp.task('common:prod', ['common:base'], () => {
  return gulp.src(['./common/*/**', '!./common/base/**/*'])
    .pipe(gulp.dest(`../${nameOVA}_build/common/`))
})

gulp.task('build', (callback) => {
  runSequence([
    'common:prod',
    'html:content',
    'html:viewer',
    'images:prod',
    'audios:prod',
    'iframes:prod'
  ],
  callback)

  browserSync.init({
    notify: false,
    server: {
      baseDir: `../${nameOVA}_build/`
    }
  })
})
