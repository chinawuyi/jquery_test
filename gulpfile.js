const gulp = require('gulp')
const swig = require('gulp-swig')
const del = require('del')
const pkg = require('./package.json')

// const dest = './dist'
const dest = pkg.dist
const tpldir = dest + '/pages'

gulp.task('clean', function(done){
  del.sync([dest], {
    force: true
  })

  done()
})

gulp.task('build:swig', gulp.series(function(){
  return gulp.src('./pages/**/*.html')
        .pipe(swig({
          varControls: ['{{', '}}'], // 只有设置varControls之后，其他的配置项才能生效
          cache: false
        }))
        .pipe(gulp.dest(tpldir))
}))

gulp.task('build:other', gulp.series(function(){
  return gulp.src(['css/**/*', 'fonts/**/*', 'img/**/*', 'js/**/*', 'layui/**/*'], {
    base: './',
    cwd: './'
  }).pipe(gulp.dest(dest))
}))

gulp.task('build', gulp.series('clean', 'build:swig', 'build:other', function(done){
  return gulp.src(tpldir + '/*.html') // 移动根目录html文件
        .pipe(gulp.dest(dest))
        .on('end', function(e){
          del.sync(tpldir + '/*.html', {
            force: true
          })
          done()
        })
}))

gulp.task('build:w', gulp.series('build', function(done){
  gulp.watch(['./css/**/*', './fonts/**/*', './img/**/*', './js/**/*', './layui/**/*', 
    './pages/**/*', './pages-layout/**/*'], gulp.series('build'))
  done()
}))
