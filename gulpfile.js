var gulp = require('gulp');
var ts = require('gulp-typescript');
var qunit = require('gulp-qunit');

var app = ts.createProject('src/tsconfig.json');
var test = ts.createProject('test/tsconfig.json');

gulp.task('default', ['build']);

gulp.task('build', ['buildApp', 'buildTest']);

gulp.task('test', ['build', 'testPhantom']);

gulp.task('buildApp', function() {
  var tsResult = app.src()
    .pipe(ts(app));
  return tsResult.js.pipe(gulp.dest('out'));
});

gulp.task('buildTest', function() {
  var tsResult = test.src()
    .pipe(ts(test));
  return tsResult.js.pipe(gulp.dest('out'));
});

gulp.task('testPhantom', function() {
  return gulp.src('./test/test.html').pipe(qunit());
});