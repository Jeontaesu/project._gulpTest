import gulp from 'gulp';
import { deleteAsync } from 'del';
import ws from 'gulp-webserver';
import image from 'gulp-image';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';
import fileInclude from 'gulp-file-include';
import { exec } from 'child_process';

const sass = gulpSass(dartSass);

const routes = {
    html: {
        watch: 'src/html/**/*.html',
        src: 'src/html/**/*.html',
        dest: 'dist',
    },
    img: {
        src: 'src/static/img/*',
        dest: 'dist/static/img',
    },
    scss: {
        watch: 'src/static/scss/**/*.scss',
        src: 'src/static/scss/*.scss',
        dest: 'dist/static/css',
    },
    js: {
        watch: 'src/static/js/**/*.js',
        src: 'src/static/js/main.js',
        dest: 'dist/static/js',
    },
    libs: {
        src: 'src/static/js/libs/*',
        dest: 'dist/static/js/libs',
    },
};

// HTML task with file include support
const html = () =>
    gulp
        .src(routes.html.src)
        .pipe(
            fileInclude({
                prefix: '@@',
                basepath: './src/html', // 기본 경로를 src/html로 설정
                context: {
                    // 필요한 경우 여기에 전역 변수 추가
                },
            }),
        )
        .pipe(gulp.dest(routes.html.dest));

const clean = () => deleteAsync(['dist', '.publish']);

const webserver = () =>
    gulp.src('dist').pipe(ws({ livereload: true, open: true }));

const img = () =>
    gulp.src(routes.img.src, {encoding: false}).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoPrefixer({
                overrideBrowserslist: ['last 2 versions', '> 1%'],
                cascade: false,
            }),
        )
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ['@babel/preset-env'] }),
                    ['uglifyify', { global: true }],
                ],
            }),
        )
        .pipe(gulp.dest(routes.js.dest));

const libs = () => gulp.src(routes.libs.src).pipe(gulp.dest(routes.libs.dest));

const ghdeploy = (cb) => {
    exec('gh-pages -d dist', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
};

const watch = () => {
    gulp.watch(routes.html.watch, html);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
    gulp.watch(routes.libs.src, libs);
};

const prepare = gulp.series(clean, img);
const assets = gulp.series(html, styles, js, libs);
const postDev = gulp.parallel(webserver, watch);

export const build = gulp.series(prepare, assets);
export const dev = gulp.series(build, postDev);
export const deploy = gulp.series(clean, build, ghdeploy);
