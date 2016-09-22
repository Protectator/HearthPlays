var gulp = require('gulp');
var ts = require('gulp-typescript');
var qunit = require('gulp-qunit');
var electron = require('electron-connect').server.create({
    stopOnClose: true
});

var app = ts.createProject('src/client/tsconfig.json');
var test = ts.createProject('src/test/tsconfig.json');
var main = ts.createProject('./tsconfig.json');

gulp.task('default', ['build']);

gulp.task('build', ['buildMain', 'buildApp', 'buildTest']);

gulp.task('test', ['build', 'testPhantom']);

gulp.task('start', ['serve']);

gulp.task('buildMain', function() {
    var tsResult = main.src()
        .pipe(ts(main));
    return tsResult.js.pipe(gulp.dest('.'));
});

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
    return gulp.src('./src/test/test.html').pipe(qunit());
});

gulp.task('serve', ['build'], function() {
    electron.start();
});