var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
// var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var notify = require('gulp-notify');
var jscs = require('gulp-jscs');
var guppy = require('git-guppy')(gulp);
var map = require('map-stream');

var paths = {
  sass: ['./scss/**/*.scss'],
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0,
    }))
    .pipe(rename({
      extname: '.min.css',
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

var exitOnJSHintError = map(function(file, cb) {
  if (!file.jshint.success) {
    notify({
      title: 'JSHINT error',
      message: 'You have JSHINT errors in file: ' + file +
      '\nPlease fix them before commiting',
    });
    process.exit(1);
  }
});

gulp.task('pre-commit', guppy.src('pre-commit', function(files) {
  var gulpFilter = require('gulp-filter');
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');
  var filter = gulpFilter(['*.js', '!www/js/app.js', '!www/js/ng-cordova.min.js']);
  return gulp.src(files)
    .pipe(filter)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(exitOnJSHintError)
    .pipe(jscs('.jscsrc'))
    .pipe(notify({
      title: 'Git commit',
      message: 'JSCS and JSHINT passed, so your commit was successful. Lucky bastard...',
    }));
}));

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
