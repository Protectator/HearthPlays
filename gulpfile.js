//////////////
// Required //
//////////////
var gulp = require('gulp');
var ts = require('gulp-typescript');
var qunit = require('gulp-qunit');
var opn = require('opn');
var electronc = require('electron-connect').server.create({
    stopOnClose: true
});

////////////////
// File paths //
////////////////
var src = {
    client: './src/client/**/*',
    electron: './src/electron/**/*',
    static: './src/static/**/*',
    test: './src/test/**/*',
    launcher: './app.ts'
};
var out = {
    client: './out/client.js',
    electron: ['./app.js', './out/electron.js'],
    test: './out/test.js'
};
var projects = {
    client : ts.createProject('./src/client/tsconfig.json'),
    electron : ts.createProject('./src/electron/tsconfig.json'),
    test : ts.createProject('./src/test/tsconfig.json'),
    launcher : ts.createProject('./tsconfig.json')
};

///////////
// Tasks //
///////////
gulp.task('default', ['serve']);

gulp.task('build', ['build:launcher', 'build:electron', 'build:client', 'build:test']);

gulp.task('test', ['test:phantom']);

gulp.task('start', ['serve']);

// Builds
gulp.task('build:launcher', function() {
    var tsResult = projects.launcher.src()
        .pipe(ts(projects.launcher));
    return tsResult.js.pipe(gulp.dest('.'));
});

gulp.task('build:electron', function() {
    var tsResult = projects.electron.src()
        .pipe(ts(projects.electron));
    return tsResult.js.pipe(gulp.dest('out'));
});

gulp.task('build:client', function() {
    var tsResult = projects.client.src()
        .pipe(ts(projects.client));
    return tsResult.js.pipe(gulp.dest('out'));
});

gulp.task('build:test', function() {
    var tsResult = projects.test.src()
        .pipe(ts(projects.test));
    return tsResult.js.pipe(gulp.dest('out'));
});

// Tests
gulp.task('test:phantom', ['build'], function() {
    return gulp.src('./src/test/test.html').pipe(qunit());
});

gulp.task('test:browser', ['build'], function() {
    return opn('./src/test/test.html');
});

// Run
gulp.task('serve', ['build'], function() {
    return electronc.start();
});

gulp.task('watch', ['serve'], function() {
    // Recompile when sources change
    gulp.watch([src.launcher], ['build:launcher']);
    gulp.watch([src.electron], ['build:electron']);
    gulp.watch([src.client], ['build:client']);

    // Reload/Restart when necessary
    gulp.watch([out.electron], ['electron:restart']);
    gulp.watch([out.client, src.static], ['electron:reload']);
});

gulp.task('electron:reload', function() {
    electronc.reload();
});

gulp.task('electron:restart', function() {
    electronc.restart();
});