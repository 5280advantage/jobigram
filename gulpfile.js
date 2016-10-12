/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
// pass along gulp reference to have tasks imported
require('gulp-release-tasks')(gulp);
/*
tagging
task	version
gulp tag	v0.0.1 -> v0.0.2 + commit + tag + push
gulp tag    --minor	v0.0.1 -> v0.1.0 + commit + tag + push
gulp tag    --major	v0.0.1 -> v1.0.1 + commit + tag + push
bumping
task	version
gulp bump	v0.0.1 -> v0.0.2
gulp bump --minor	v0.0.1 -> v0.1.0
gulp bump --major	v0.0.1 -> v1.0.1
*/

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
