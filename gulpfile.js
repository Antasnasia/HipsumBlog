const gulp = require('gulp');
const browserSync= require('browser-sync').create();
const watch = require ('gulp-watch');
const sass= require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber= require('gulp-plumber');
const notify= require('gulp-notify');
const gcmq = require('gulp-group-css-media-queries');
const sassGlob = require('gulp-sass-glob');
const pug = require('gulp-pug');
const clean = require('gulp-clean');



// таск для сборки pug файлов
gulp.task('pug', function(callback) {
    return gulp.src('./src/pug/pages/**/*.pug')
      /*  .pipe(plumber ({
             errorHandler: notify.onError(function(err) {
                 return {
                     title: "Pug",
                     sound: false,
                    message: err.message
                 }
             })
        }))*/
        .pipe(pug({
            pretty: true
        }))


        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream())
        callback();
});

//таск для компиляции и обработки файлов scss
gulp.task('scss', function(callback) {
    return (gulp.src('./src/scss/main.scss'))
    .pipe(plumber ({
        errorHandler: notify.onError(function(err) {
            return {
                title: "Styles",
                sound: false,
                message: err.message
            }
        })
    }))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
        indentType: 'Tab',
        indentWidth: 1,
        outputStyle: "expanded"
    }))
    // .pipe(gcmq())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 4 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream())
    callback();
});



// Таск для отображения контента в реальном времени
gulp.task('server', function() {
    browserSync.init( {
        server: {
            baseDir: "./dist/"
        }
    })
});
//Таск для очищения папки dist перед запуском сборки
gulp.task('clean:dist', function(callback) {
    return gulp.src("./dist/", {
        read: false,
        allowEmpty: true})
        .pipe(clean())
        callback();
});

// Таск для копирования изображений 
gulp.task('copy:img', function(callback) {
    return gulp.src('./src/img/**/*.*')
      .pipe(gulp.dest('./dist/img'))
      callback();
});

//Копирование скриптов
gulp.task('copy:js', function(callback) {
    return gulp.src('./src/js/**/*.*')
      .pipe(gulp.dest('./dist/js'))
      callback();
});
//Таск для отслеживаниями изменений в файлах
gulp.task('watch', function() {
   watch(['./dist/js/**/*.*', './dist/img/**/*.*'], gulp.parallel(browserSync.reload) );
    watch ('./src/scss/**/*.scss', gulp.parallel('scss'));
   watch('./src/pug/**/*.pug', gulp.parallel('pug'));
   watch('./src/img/**/*.*', gulp.parallel('copy:img') )
   watch('./src/js/**/*.*', gulp.parallel('copy:js') )
});
//Дефолтный запуск gulp
// gulp.task('default', gulp.parallel('server', 'watch',  'scss', 'pug'));

// New  Дефолтный запуск gulp

gulp.task('default', 
    gulp.series(
        gulp.parallel('clean:dist'),
        gulp.parallel('scss', 'pug', 'copy:img', 'copy:js'),
        gulp.parallel('server', 'watch')
    )
);