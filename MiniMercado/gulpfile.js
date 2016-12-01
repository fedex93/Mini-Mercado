
//Require
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');

//Watchers
gulp.task('watch',['browserSync','sass'] ,function(){
  //Defino watchers
  gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch('app/*.html', ['build']);
  gulp.watch('app/js/*.js', ['build']);
})

//---------------------Tasks-----------------------------------------

//Build
gulp.task('build', function (callback) {
  runSequence(['clean:dist','sass', 'chico', 'images', 'fonts','minify','run'],
    callback
  )
})

//Run
gulp.task('run', function (callback) {
  runSequence(['browserSync', 'watch'],
    callback
  )
})

//Browser project
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
});

//Sass compiler
gulp.task('sass', function(){
  //Compilo scss en css de todas las folders de sass
  return gulp.src('app/scss/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('chico', function (callback) {
  return gulp.src('app/chico/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/sho_third_parties'))
})

//Imagenes
gulp.task('images', function(){
  //Copio imagenes de app a dist
  return gulp.src('app/images/**/*.+(png|jpg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
});

//Fuentes
gulp.task('fonts', function() {
  //Copio fuentes de app a dist
  return gulp.src('app/fonts/*')
  .pipe(gulp.dest('dist/fonts'))
})

//Minificar
gulp.task('minify', function(){
  //Minifico js y css y lo genero en dist
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

//Delete
gulp.task('clean:dist', function() {
  //Borro dist
  return del.sync('dist');

})
