/*
 'use strict';
 const gulp     = require('gulp');
 const prettify = require('gulp-jsbeautifier');
 const conf     = require('./conf');

 // Prettify Code
 gulp.task('prettify', [
 // 'prettify:gulp:js',
 'prettify:app:js',
 'prettify:app:html',
 ]);

 // Gulp
 gulp.task('prettify:gulp:js', () => {
 gulp.src('./gulp/!*.js')
 .pipe(prettify({config: 'gulp/.jsbeautifyrc'}))
 .pipe(gulp.dest(conf.paths.src + '/gulp'));
 });

 // JS
 gulp.task('prettify:app:js', () => {
 gulp.src([conf.paths.src + '/app/!**!/!*.js', conf.paths.src + '/app/!**!/!*.json'])
 .pipe(prettify({config: 'gulp/.jsbeautifyrc'}))
 .pipe(gulp.dest(conf.paths.src + '/app'));
 })
 ;

 // HTML
 gulp.task('prettify:app:html', () => {
 gulp.src(conf.paths.src + '/app/!**!/!*.html')
 .pipe(prettify({
 braceStyle: "collapse",
 indentChar: ' ',
 indentScripts: 'keep',
 indentSize: 4,
 maxPreserveNewlines: 10,
 preserveNewlines: true,
 wrapLineLength: 0
 }))
 .pipe(gulp.dest(conf.paths.src + '/app'));
 })
 ;
 */
