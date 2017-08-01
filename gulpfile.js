const gulp = require('gulp');
const del = require('del');
const htmlreplace = require('gulp-html-replace');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const fs = require('fs');
const mongobackup = require('mongobackup');

const dist = 'public/dist';

gulp.task('default', ['export', /*'js', 'lib', 'replace'*/]);
gulp.task('js', ['concat-js', 'uglify-js']);
gulp.task('lib', ['concat-lib', 'uglify-lib']);

gulp.task('clean', () => {
  return del(dist);
});

gulp.task('export', () => {
  return gulp.src([
    'public/index.html',
    'public/readonly.css',
    'public/js/*.js', 
    'public/export_html/*.html', 
    'public/bower_components/**/*.min.js',
    'public/bower_components/**/*.css',
    'public/bower_components/**/*.map'
  ], {base: 'public'})
    .pipe(gulp.dest(dist));
});

gulp.task('rename-html', () => {
  fs.rename(`${dist}/export_html`, `${dist}/html`);
});

gulp.task('rename-css', () => {
  fs.rename(`${dist}/readonly.css`, `${dist}/style.css`);
});

gulp.task('json', () => {
  return mongobackup.export({
    host: 'localhost',
    port: 27017,
    db: 'counteroffer',
    collection: 'portfolios',
    query: '{"_id": {"$oid": "577b11b224ec6cce246a5751"}}',
    out: 'portfolio.json'
  });
});

gulp.task('concat-js', () => {
  return gulp.src('public/js/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(dist));
});

gulp.task('uglify-js', () => {
  return gulp.src(`${dist}/scripts.js`)
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

gulp.task('concat-lib', () => {
  return gulp.src('public/bower_components/**/*.js')
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(dist));
});

gulp.task('uglify-lib', () => {
  return gulp.src(`${dist}/lib.js`)
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

gulp.task('replace', () => {
  return gulp.src(`${dist}/index.html`)
    .pipe(htmlreplace({
      js: 'scripts.js',
      lib: 'lib.js'
    }))
    .pipe(gulp.dest(dist))
});