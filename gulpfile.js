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
var exec = require('child_process').exec;
var through = require('through2');

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

var voices = ['Kathy', 'Agnes', 'Princess', 'Vicki', 'Junior', 'Ralph'];

gulp.task('pre-commit', guppy.src('pre-commit', function(files) {
  var gulpFilter = require('gulp-filter');
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');
  var filter = gulpFilter(['*.js', '!www/js/app.js', '!www/js/ng-cordova.min.js']);
  return gulp.src(files)
    .pipe(filter)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs('.jscsrc'))
    .pipe(through.obj(function(chunk, enc, done) {
      var index = Math.floor((Math.random() * (voices.length - 1)) + 1);
      var voice = voices[index];
      exec('echo "Lucky bastard, you passed all the tests, Miss Puff will be happy" | say -v ' +
      voice, function(err, stdout, stderr) {
        done();
      });
    }))
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
