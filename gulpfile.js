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

gulp.task('json', () => {
  return mongobackup.export({
    host: 'localhost',
    port: 27017,
    db: 'counteroffer',
    collection: 'portfolios',
    query: '{"_id": {"$oid": "577b11b224ec6cce246a5751"}}',
    out: 'public/dist/577b11b224ec6cce246a5751.json' // TODO: parameterize based on id?
  });
});

gulp.task('export', ['move'], () => {
  return gulp.start('rename');
});

gulp.task('move', ['json'], () => {
  return gulp.src([
    'public/readonly.css',
    'public/*.json',
    'public/js/readonly.js', 
    'public/export_html/*.html', 
    'public/bower_components/angular/angular.min.js'
  ], {base: 'public'})
    .pipe(gulp.dest(dist));
});

gulp.task('concat-js', () => {
  return gulp.src(`${dist}/js/*.js`)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(dist));
});

gulp.task('uglify-js', () => {
  return gulp.src(`${dist}/scripts.js`)
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

gulp.task('concat-lib', () => {
  return gulp.src(`${dist}/bower_components/**/*.min.js`)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(dist));
});

gulp.task('concat-css', () => {
  return gulp.src(`${dist}/bower_components/**/*.css`)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest(dist));
});

// https://gist.github.com/liangzan/807712
const rmDir = (dirPath) => {
  try { 
    var files = fs.readdirSync(dirPath); 
  }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
};

gulp.task('remove-non-concat', ['concat-js', 'concat-lib', 'concat-css'], () => {
//   fs.unlinkSync(`${dist}/js/*.js`);
//   fs.rmdirSync(`${dist}/js`);
  rmDir(`${dist}/js`);
//   fs.unlinkSync(`${dist}/bower_components/**/*`);
//   fs.rmdirSync(`${dist}/bower_components`);
  rmDir(`${dist}/bower_components`);
  fs.unlinkSync(`${dist}/bower.json`);
});

/*
gulp.task('uglify-lib', () => {
  return gulp.src(`${dist}/lib.js`)
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});
*/

// TODO: combine with export
gulp.task('replace', ['remove-non-concat'], () => {
  return gulp.src(`${dist}/index.html`)
    .pipe(htmlreplace({
      js: 'scripts.js',
      lib: 'lib.js',
      hide: '',
      css: 'lib.css'
    }))
    .pipe(gulp.dest(dist))
});