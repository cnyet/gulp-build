/**开发环境打包配置**/
var gulp = require("gulp");
var less = require("gulp-less");                            //将less编译成css
var notify = require('gulp-notify');                        // 打印出用户出错信息
var cleanCss = require("gulp-clean-css");                   //压缩css代码
var filter = require("gulp-filter");                        //把stream里的文件根据一定的规则进行筛选过滤
var plumber = require("gulp-plumber");                      //一旦pipe中的某一steam报错了，保证下面的steam还继续执行
var autoprefixer = require('gulp-autoprefixer');            //针对不同浏览器添加样式前缀
var mapStream = require("map-stream");                      //检查结果的详细的错误信息
var eslint = require("gulp-eslint");                        //js编码规范审查
var fileinclude = require("gulp-file-include");             //在html中引入模板文件
var print = require("gulp-print");                          //打印出stream里面的所有文件名
var htmlmin = require("gulp-htmlmin");                      //压缩html文件
var imagemin = require("gulp-imagemin");                    //压缩图片
var pngquant = require('imagemin-pngquant');                //png图片压缩插件
var concat = require("gulp-concat");                        //文件合并
var gutil = require("gulp-util");                           //提供很多常用函数
var watchPath = require('gulp-watch-path');                 //监听变化文件的路径信息
var clean = require("gulp-clean");                          //清除文件
var connect = require("gulp-connect");                      //web服务器

module.exports = {
  compileCSS: function(){
    var cssFilter = filter(["src/css/*.css", "!src/css/ui.css"], {restore: true}),
        cssOptions = {
            compatibility: 'ie8',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepSpecialComments: '*', //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀  
        };
    return gulp.src(["src/css/**/*.css", "!src/css/{ui,less}/**"])    
         .pipe(plumber({ errorHandler: function(err) {
                    notify.onError({
                        title: "Gulp error in " + err.plugin,
                        message:  err.toString()
                    })(err);            
                }}))      
        .pipe(cssFilter)        
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true
        }))
        .pipe(cssFilter.restore)
        .pipe(cleanCss(cssOptions))
        .pipe(plumber.stop())
        .pipe(gulp.dest("dist/css"))
  },
  compileJS: function(){
    return gulp.src(["src/js/**/*.js", "!src/js/{lib,vendrs}/**"])
        .pipe(plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);            
        }}))       
        .pipe(eslint())
        .pipe(eslint.results(results => {
            gutil.log(gutil.colors.yellow("Eslint Warnings: ") + results.warningCount)
            gutil.log(gutil.colors.red("Eslint Errors: ") + results.errorCount)
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
        .pipe(plumber.stop())
        .pipe(gulp.dest("dist/js"))
  },
  compileHTML: function(){
    var options = {            
            collapseBooleanAttributes: true,        //省略布尔属性值        
            removeEmptyAttributes: true,            //删除所有空格作为属性值
            removeScriptTypeAttributes: true,       //删除script的type属性
            removeStyleTypeAttributes: true,        //删除link的type属性
            minifyJS: true,                         //压缩页面js
            minifyCSS: true                         //压缩页面css
        };
    return gulp.src(["src/**/!(_*).html", "!src/pages/include/*.html"])               
        .pipe(fileinclude({                         //在html文件中直接include文件
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest("dist"))
  },
  watchFiles: function(){
    gulp.task('watch', function () {
      //监听图片文件
      gulp.watch("src/images/**/*.{png,jpg,gif,ico}", function (event) {
          var paths = watchPath(event, 'src/', 'dist/');
          gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);

          if(event.type == "deleted"){
              return gulp.src(paths.distPath)
                  .pipe(clean());
          }else{
              gulp.src(paths.srcPath)
              .pipe(imagemin({
                  use: [pngquant()],         //使用pngquant来压缩png图片
                  optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
                  progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                  interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                  multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
              }))
              .pipe(gulp.dest(paths.distDir))
              .pipe(connect.reload());
              gutil.log(gutil.colors.blue('built') + ' ' + paths.distPath); 
          }
      });

      //监听css文件
      gulp.watch("src/css/**/*.{css,less}", function (event) {        
          var paths = watchPath(event, 'src/', 'dist/'),
              cssFilter = filter(["src/css/*.css", "!src/css/ui.css"], {restore: true}),
              cssOptions = {
                  compatibility: 'ie8',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
                  keepSpecialComments: '*', //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀  
              };
          gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
          if(event.type == "deleted"){
              return gulp.src(paths.distPath)
                  .pipe(clean());
          }else {     
              gutil.log(gutil.colors.blue('built') + ' ' + paths.distPath);     
              return gulp.src("src/css/*.css")                
                  .pipe(plumber({ errorHandler: function(err) {
                      notify.onError({
                          title: "Gulp error in " + err.plugin,
                          message: err.toString()
                      })(err);            
                  }}))
                  .pipe(print())
                  .pipe(cssFilter)                     
                  .pipe(less())
                  .pipe(autoprefixer({
                      browsers: 'last 2 versions',
                      cascade: true
                  }))  
                  .pipe(cssFilter.restore)        
                  .pipe(cleanCss(cssOptions))
                  .pipe(plumber.stop())
                  .pipe(gulp.dest("dist/css"))
                  .pipe(connect.reload());
          }
      });
      //监听html文件
      gulp.watch("src/**/!(_*).html", function (event) {
          var paths = watchPath(event, 'src/', 'dist/');
          gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
          if(event.type == "deleted"){
              return gulp.src(paths.distPath)
                  .pipe(clean());
          }else {
              var options = {            
                  collapseBooleanAttributes: true,        //省略布尔属性值        
                  removeEmptyAttributes: true,            //删除所有空格作为属性值
                  removeScriptTypeAttributes: true,       //删除script的type属性
                  removeStyleTypeAttributes: true,        //删除link的type属性
                  minifyJS: true,                         //压缩页面js
                  minifyCSS: true                         //压缩页面css
              };
              gutil.log(gutil.colors.blue('built') + ' ' + paths.distPath); 
              return gulp.src(["src/**/!(_*).html", "!src/views/include/*.html"])
                  .pipe(fileinclude({                         //在html文件中直接include文件
                      prefix: '@@',
                      basepath: '@file'
                  }))
                  .pipe(htmlmin(options))
                  .pipe(gulp.dest("dist"))
                  .pipe(connect.reload());
          }
      });
      //监听js文件
      gulp.watch("src/js/**/*.js", function (event) {   
          var paths = watchPath(event, 'src/', 'dist/');
          var jsFilter = filter(["src/js/**/*.js", "!src/js/{lib,vendrs}/**"], {restore: true});
          /*
           paths
           { srcPath: 'src/js/log.js',
           srcDir: 'src/js/',
           distPath: 'dist/js/log.js',
           distDir: 'dist/js/',
           srcFilename: 'log.js',
           distFilename: 'log.js' }
           */
          gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
          if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
          }else {
            gutil.log(gutil.colors.blue('built') + ' ' + paths.distPath); 
            return gulp.src(paths.srcPath)
                .pipe(plumber({ errorHandler: function(err) {
                    notify.onError({
                        title: "Gulp error in " + err.plugin,
                        message:  err.toString()
                    })(err);            
                }})) 
                .pipe(jsFilter)  
                .pipe(eslint())
                .pipe(eslint.results(results => {
                    gutil.log(gutil.colors.yellow("Eslint Warnings: ") + results.warningCount)
                    gutil.log(gutil.colors.red("Eslint Errors: ") + results.errorCount)
                }))
                .pipe(eslint.format())
                .pipe(eslint.failAfterError())
                .pipe(jsFilter.restore)       
                .pipe(plumber.stop())
                .pipe(gulp.dest(paths.distDir))
                .pipe(connect.reload());
          }
        })
      })
    }
};