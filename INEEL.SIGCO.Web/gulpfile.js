'use strict';
 
var gulp   = require('gulp');
//var inject = require('gulp-inject');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var gutil  = require('gulp-util');
var cssnano = require('gulp-cssnano');
var condition= ['**/*.js', '!**/*.min.js'];
// Compress into a single file the ones in between of blocks "build:xx" in x.html
gulp.task('indexGO', function () {
  return gulp.src('index.html', {cwd: '.'})
    .pipe(useref())
    
    .pipe(gulpIf('**/*.css', cssnano()))
    .pipe(gulp.dest('./dist'));
});
gulp.task('sigcoGO', function () {
  return gulp.src('sigco.html', {cwd: '.'})
    .pipe(useref())
    
    .pipe(gulpIf('**/*.css', cssnano()))
    .pipe(gulp.dest('./dist'));
});
gulp.task('MTGO', function () {
  return gulp.src('indexMT.html', {cwd: '.'})
    .pipe(useref())
    
    .pipe(gulpIf('**/*.css', cssnano()))
    .pipe(gulp.dest('./dist'));
});
gulp.task('CRGO', function () {
  return gulp.src('indexCR.html', {cwd: '.'})
    .pipe(useref())
    
    .pipe(gulpIf('**/*.css', cssnano()))
    .pipe(gulp.dest('./dist'));
});

gulp.task('CHGO', function () {
  return gulp.src('IndexCH.html', {cwd: '.'})
    .pipe(useref())
    
    .pipe(gulpIf('**/*.css', cssnano()))
    .pipe(gulp.dest('./dist'));
});

gulp.task('todo', ['indexGO', 'sigcoGO', 'CRGO', 'CHGO', 'MTGO']);




////////CHECALO ADRIAN////// espero te sirva
/////inicio////// practicamente esta es la tarea para minificarlo y te lo deje en un archivo, es casi lo mismo que tienes.
///espero sea de utilidad bro
//////////////////////////////////var gulp = require('gulp');
//////////////////////////////////var gutil = require('gulp-util');
//////////////////////////////////var bower = require('bower');
//////////////////////////////////var concat = require('gulp-concat');
//////////////////////////////////var sass = require('gulp-sass');
//////////////////////////////////var minifyCss = require('gulp-minify-css');
//////////////////////////////////var rename = require('gulp-rename');
//////////////////////////////////var sh = require('shelljs');
//////////////////////////////////var concat = require('gulp-concat');
//////////////////////////////////var uglify = require('gulp-uglify');
//////////////////////////////////const babel = require('gulp-babel');
//////////////////////////////////var ngAnnotate = require('gulp-ng-annotate');
//////////////////////////////////var sourcemaps = require('gulp-sourcemaps');
//////////////////////////////////var concat = require('gulp-concat');

//////////////////////////////////var paths = {
//////////////////////////////////    sass: ['./scss/**/*.scss']
//////////////////////////////////};
////////////////////////////////const jsPath = [
////////////////////////////////  "www/common/**/*.js",
////////////////////////////////  "www/app/**/**/*.js",
////////////////////////////////]

////////////////////////////////gulp.task('watch', function () {
////////////////////////////////    gulp.watch(jsPath, ['js'])
////////////////////////////////})

////////////////////////////////gulp.task('js', function () {
////////////////////////////////     { base: 'src/' }
////////////////////////////////    gulp.src(jsPath)
////////////////////////////////       .pipe(sourcemaps.init())
////////////////////////////////       .pipe(babel({ presets: ['es2015'] }))
////////////////////////////////       .on('error',function (err) {
////////////////////////////////         console.error(err);
////////////////////////////////         console.log('Babel error');
////////////////////////////////       })
////////////////////////////////      .pipe(concat('build.js'))
////////////////////////////////       .pipe(ngAnnotate())
////////////////////////////////       .pipe(uglify())
////////////////////////////////       .pipe(sourcemaps.write())
////////////////////////////////      .pipe(gulp.dest('www/js/')) //cambia la ruta
////////////////////////////////});
/////fin


/////si esto te sirve....revisalo tambien

//gulp.task('scripts', function () {
//    gulp.src(['./www/common/*.js']) otra tareita que hice de prueba la de arriba es la chida
//      .pipe(concat('main.js'))
//      .pipe(uglify())
//      .pipe(gulp.dest('./dist/'))
//});

//gulp.task('default', ['sass']);

//gulp.task('sass', function (done) {
//    gulp.src('./scss/ionic.app.scss')
//      .pipe(sass())
//      .on('error', sass.logError)
//      .pipe(gulp.dest('./www/css/'))
//      .pipe(minifyCss({
//          keepSpecialComments: 0
//      }))
//      .pipe(rename({ extname: '.min.css' }))
//      .pipe(gulp.dest('./www/css/'))
//      .on('end', done);
//})

//gulp.task('install', ['git-check'], function () {
//    return bower.commands.install()
//      .on('log', function (data) {
//          gutil.log('bower', gutil.colors.cyan(data.id), data.message);
//      });
//});

//gulp.task('git-check', function (done) {
//    if (!sh.which('git')) {
//        console.log(
//          '  ' + gutil.colors.red('Git is not installed.'),
//          '\n  Git, the version control system, is required to download Ionic.',
//          '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
//          '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
//        );
//        process.exit(1);
//    }
//    done();
//});



