'use strict'

let gulp = require('gulp')
let connect = require('gulp-connect')
let sass = require('gulp-sass')
let prefix = require('gulp-autoprefixer')
let uglify = require('gulp-uglify')
let sourcemaps = require('gulp-sourcemaps')
let gutil = require('gulp-util')
let browserify = require('browserify')
let babelify = require('babelify')
let source = require('vinyl-source-stream')

let paths = {}

paths.static = {
  ins: [ 'index.html', 'images/**/*' ],
  out: 'dist/'
}

paths.sass = {
  ins: [ 'scss/**/*.scss'],
  main: 'scss/main.scss',
  out: 'dist/css/'
}

paths.js = {
  ins: [ 'js/**/*.jsx', 'js/**/*.js' ],
  out: 'dist/js/',
  entry: 'js/flashcard-bootstrap.js',
  bundle: 'bundle.js',
  minified: 'bundle.min.js'
}

function handleError(err) {
  gutil.log(err.message)
}

gulp.task('serve', function () {
  connect.server({
    root: 'dist/',
    livereload: true
  })
})

gulp.task('static', function () {
  return gulp.src(paths.static.ins, { base: '.' })
    .pipe(gulp.dest(paths.static.out))
})

gulp.task('sass', function () {
  return gulp.src(paths.sass.main)
    .pipe(sass())
    .on('error', handleError)
    .pipe(prefix())
    .on('error', handleError)
    .pipe(gulp.dest(paths.sass.out))
    .pipe(connect.reload())
})

gulp.task('js', function () {
  return browserify({
      entries: 'js/flashcard-bootstrap.js',
      paths: 'js/',
      extensions: ['.jsx', '.js'],
    })
    .transform(babelify.configure({
      ignore: /node_modules\/.*/
    }))
    .bundle()
    .on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload())
})

gulp.task('minify', ['js'], function () {
  gulp.src(paths.js.bundle)
    .pipe(uglify())
    .on('error', handleError)
    .pipe(gulp.dest(paths.js.minified))
})

gulp.task('watch', function () {
  gulp.watch(paths.sass.ins, ['sass'])
  gulp.watch(paths.js.ins, ['js'])
})

gulp.task('build', ['sass', 'js', 'static'])

gulp.task('default', ['watch', 'build', 'serve'])
