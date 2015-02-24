const gulp = require('gulp'),
      multipipe = require('multipipe'),
      path = require('path'),
      browserify = require('browserify'),
      browserSync = require('browser-sync'),
      reload = browserSync.reload,
      source = require('vinyl-source-stream'),
      _ = require('lodash'),
      {
        autoprefixer,
        cached,
        clean,
        concat,
        jshint,
        less,
        lessReporter,
        minifyCss,
        minifyHtml,
        pipe,
        print,
        remember,
        sequence,
        sourcemaps,
        uglify,
        util
      } = require('gulp-load-plugins')();

gulp.task('default', ['build']);

gulp.task('build', sequence('clean-dist', ['js-vendor', 'js-app', 'less:debug', 'html', 'images', 'fonts'], ['minify-css', 'minify-html', 'minify-js']));

gulp.task('dev', cb => {
  const {src} = paths;

  sequence('clean-dev', ['js-vendor', 'js-app', 'less:debug', 'html'], 'browser-sync')(cb);

  gulp.watch(src.html, ['html']);
  gulp.watch(src.scripts, ['js:debug']);
  gulp.watch(src.templates, ['js:debug']);
  gulp.watch(src.less, ['less:debug'])
      .on('change', event => {
        if (event.type === 'deleted') {
          delete cached.caches['less'][event.path];
          remember.forget('less', event.path);
        }
      });
});

gulp.task('browser-sync',
  () => browserSync({
    server: paths.dev.$,
    ghostMode: false
  }));

gulp.task('js-vendor',
  () => pipe([
    browserify()
      .require(_.keys(require('./package.json').dependencies))
      .bundle()
    ,source('vendor.js')
    ,print()
    ,gulp.dest(paths.dev.$)
  ]));

gulp.task('js-app', ['jshint'],
  () => pipe([
    browserify({
      entries: [paths.src.app],
      debug: true
    })
      .external(_.keys(require('./package.json').dependencies))
      .bundle()
    ,source('app.js')
    ,print()
    ,gulp.dest(paths.dev.$)
  ]));

gulp.task('jshint',
  () => pipe([
    gulp.src(paths.src.scripts)
    ,cached('jshint')
    ,print()
    ,jshint()
    ,jshint.reporter('jshint-stylish')
    ,jshint.reporter('fail')
  ]));

gulp.task('less:debug',
  () => multipipe( // my gulp-pipe fails here because of the less().on [doesn't forward errors]
    gulp.src(paths.src.less)
    ,cached('less')
    ,print()
    ,sourcemaps.init()
    ,less()
      .on('error', lessReporter)
    ,autoprefixer()
    ,sourcemaps.write()
    ,remember('less')
    ,concat('app.css')
    ,print()
    ,gulp.dest(paths.dev.$)
    ,print(f => `reload${f}`)
    ,reload({stream: true})
  ));

gulp.task('html',
  () => pipe([
    gulp.src(paths.src.html)
    ,print()
    ,gulp.dest(paths.dev.$)
    ,reload({stream: true})
  ]));

gulp.task('minify-css',
  () => pipe([
    gulp.src([paths.dev.css])
    ,print()
    ,minifyCss()
    ,gulp.dest(paths.dist.$)
  ]));

gulp.task('minify-js',
  () => pipe([
    gulp.src([paths.dev.app].concat([paths.dev.vendor]))
    ,print()
    ,uglify()
    ,gulp.dest(paths.dist.$)
  ]));

gulp.task('minify-html',
  () => pipe([
    gulp.src([paths.dev.html])
    ,print()
    ,minifyHtml()
    ,gulp.dest(paths.dist.$)
  ]));

gulp.task('images');

gulp.task('fonts');

gulp.task('clean-dev',
  () => pipe([
    gulp.src(paths.dev.$, {read: false})
    ,clean()
  ]));

gulp.task('clean-dist',
  () => pipe([
    gulp.src(paths.dist.$, {read: false})
    ,clean()
  ]));

const paths = {
  src: {
    $: './src',
    app: ['./src/app.js'],
    less: ['src/**/*.less'],
    html: ['./src/index.html'],
    scripts: ['src/**/*.js'],
    templates: ['src/modules/**/template.html']
  },
  dist: {
    $: './.dist',
    app: './.dist/app.js',
    css: './.dist/app.css',
    html: './.dist/index.html'
  },
  dev: {
    $: './.dev',
    app: './.dev/app.js',
    css: './.dev/app.css',
    html: './.dev/index.html',
    vendor: './.dev/vendor.js'
  }
};