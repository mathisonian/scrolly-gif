'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var livereload = require('gulp-livereload');
var tinylr = require('tiny-lr');
var server = tinylr();
var jade = require('jade');
var path = require('path');
var express = require('express');
var app = express();
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var s3 = require('gulp-s3');
var gzip = require('gulp-gzip');
var colors = require('colors');
var rename = require('gulp-rename');
var _ = require('lodash');
var tap = require('gulp-tap');
var ext = gutil.replaceExtension;


var PRODUCTION_MODE = gutil.env.production;
var projectName = require('./package').name;


gulp.task('browserify', function() {
    // Single entry point to browserify
    return gulp.src('src/js/app.js')
        .pipe(browserify({
            debug : !PRODUCTION_MODE
        }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulpif(PRODUCTION_MODE, uglify()))
        .pipe(gulp.dest('./js/'))
        .pipe( livereload( server ));
});


gulp.task('css', function() {
    return gulp
            .src('src/stylesheets/*.scss')
            .pipe(
                sass({
                    includePaths: ['src/stylesheets'],
                    errLogToConsole: true
                }))
            .pipe( gulpif(PRODUCTION_MODE, csso()) )
            .pipe( gulp.dest('./css/') )
            .pipe( livereload( server ));
});



gulp.task('images', function() {
    return gulp
            .src('src/images/**/*')
            .pipe( gulp.dest('./images/') )
            .pipe( livereload( server ));
});

gulp.task('jade', function() {

    var host = './' + projectName + '/';

    if(!PRODUCTION_MODE) {
        host = './';
    }

    return gulp
        .src('src/templates/**/index*.jade')

        .pipe(tap(function(file) {

            var compile = jade.compile(String(file.contents), {
                filename: file.path,
                pretty: false
            });

            var compiled = compile({
                _: _,
                STATIC_URL: host
            });

            file.contents = new Buffer(compiled);
            file.path = ext(file.path, '.html');
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./'));

});

gulp.task('templates', ['static'], function() {
    return gulp.start('jade');
});


gulp.task('express', function() {
    app.use(express.static(path.resolve('./')));
    app.listen(8000);
    gutil.log('Listening on port: 8000');
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('src/stylesheets/**/*.{scss,css}',['css', 'jade']);
    gulp.watch('src/js/**/*.js',['js']);
    gulp.watch('src/templates/**/*.jade',['jade', 'js']);
  });
});


gulp.task('js', ['browserify']);
gulp.task('static', ['js', 'css', 'images']);
gulp.task('default', ['templates','express','watch']);
gulp.task('build', ['templates']);
