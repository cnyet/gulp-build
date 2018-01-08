/*
* gulp自动化打包配置
* 开发环境执行：gulp dev
* 生成环境执行：gulp build
*/
var gulp = require("gulp");
var os = require('os');                                     //获取操作系统对象
var gCache = require('gulp-cache');                         //缓存文件
var imagemin = require("gulp-imagemin");                    //压缩图片
var pngquant = require('imagemin-pngquant');                //png图片压缩插件
var clean = require("gulp-clean");                          //清除文件
var revCollector = require("gulp-rev-collector");           //根据map文件替换页面引用文件
var gulpOpen = require('gulp-open');                        //自动在浏览器打开页面
var print = require("gulp-print");                          //打印出stream里面的所有文件名
var devConfig = require("./config/dev");                    //开发环境配置
var buildConfig = require("./config/build");                //生产环境配置
var connect = require("gulp-connect");                      //web服务器
var runSequence = require("run-sequence");                  //串行依次执行任务
var httpProxy = require('http-proxy-middleware');           //gulp-connect服务代理

//配置自动打开浏览器，mac chrome: "Google chrome" 
var browser = os.platform() === "linux" ? "Google chrome" : (
    os.platform() === "darwin" ? "Google chrome" : (
        os.platform() === "win32" ? "chrome" : "firefox"
    )
);

//拷贝插件和图片文件到目标文件
gulp.task("copy:files", function () {
    //拷贝插件
    gulp.src("src/js/{lib,util}/**", {base: "src/"})
        .pipe(gulp.dest("dist"));
    //拷贝字体文件
    gulp.src("src/css/fonts/**", {base: "src"})
        .pipe(gulp.dest("dist"));
    //拷贝图片
    gulp.src("src/images/**/*.{png,jpg,gif,ico}")
        .pipe(gCache(imagemin({
            use: [pngquant()],         //使用pngquant来压缩png图片
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })))
        .pipe(gulp.dest("dist/images"));
});

//开发环境下编译css,js.html
gulp.task("dev:css", devConfig.compileCSS);
gulp.task("dev:js", devConfig.compileJS);
gulp.task("dev:html", devConfig.compileHTML);

//生产环境下压缩合并，依赖注入
gulp.task("revision", buildConfig.compress);
gulp.task("format", buildConfig.manifest);
//监听文件
gulp.task("watch", devConfig.watchFiles);
gulp.task('connect', function () {
    var host = {
        path: "dist/",
        port: 8085,
        index: "index.html"
    };
    connect.server({
        root: host.path,
        port: host.port,
        index: host.index,
        livereload: true,
        /*middleware: function (connect, opt) {                      
            return [
                httpProxy('/proxy',  {
                    target: 'http://localhost:80',
                    changeOrigin:true
                })
            ]                
        }*/
    });
    console.log('=====================Server Connecting=====================');
});

gulp.task('open', function (done) {
    return gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:8085'
        }));
});

//清除文件
gulp.task('clean', function () {
    return gulp.src(['dist'])
        .pipe(clean())
});

//默认删除文件
gulp.task('default', ['clean']);

//开发
gulp.task("dev", function(){
    runSequence("clean", "copy:files", 'dev:html', ['dev:css', "dev:js", "watch"], 'connect', 'open');
});

//发布
gulp.task("build", function(){
    runSequence("clean", "copy:files", "revision", "format");
});