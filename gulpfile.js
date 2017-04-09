var gulp = require("gulp"),                                 //gulp基础库
    os = require('os'),                                     //获取操作系统对象
    jshint = require("gulp-jshint"),                        //审查js代码
    uglify = require("gulp-uglify"),                        //压缩js代码
    stylelish = require("jshint-stylish"),                  //js错误信息高亮显示
    mapStream = require("map-stream"),                      //检查结果的详细的错误信息
    csslint = require("gulp-csslint"),                      //审查css代码
    cleanCss = require("gulp-clean-css"),
    less = require("gulp-less"),                            //将less编译成css
    minifycss = require("gulp-minify-css"),                 //压缩css文件
    htmlmin = require("gulp-htmlmin"),               //压缩html文件
    imagemin = require("gulp-imagemin"),                    //压缩图片
    pngquant = require('imagemin-pngquant'),                //png图片压缩插件
    header = require("gulp-header"),                        //用来在压缩后的JS、CSS文件中添加头部注释
    spritesmith = require("gulp.spritesmith"),              //合并sprite小图片，生成单独的css和一张大图
    spriter = require("gulp-css-spriter"),                  //将sprite图合并生成样式文件
    base64 = require("gulp-css-base64"),                    //把小图片的URL替换为Base64编码图片
    concat = require("gulp-concat"),                        //文件合并
    rename = require("gulp-rename"),                        //文件重命名
    rev = require("gulp-rev"),                              //加MD5版本号生成无缓存文件
    md5 = require('gulp-md5-plus'),                         //给页面引用的js,css,图片引用路径加MD5
    revReplace = require("gulp-rev-replace"),               //重写加了MD5的文件名
    clean = require("gulp-clean"),                          //清除文件
    gif = require("gulp-if"),                               //判断条件
    del = require("del"),                                   //文件清理
    revCollector = require("gulp-rev-collector"),           //根据map文件替换页面引用文件
    gutil = require("gulp-util"),                            //提供很多常用函数
    autoprefixer = require('gulp-autoprefixer'),
    usemin = require("gulp-usemin"),                        //文件合并到指定的目录，将样式和脚本直接嵌入到页面中，移除部分文件，为文件执行各种任务
    useref = require("gulp-useref"),                        //合并html中引入的静态文件
    fileinclude = require("gulp-file-include"),             //在html中引入模板文件
    runSequence = require("run-sequence"),                  //串行依次执行任务
    filter = require("gulp-filter"),                        //把stream里的文件根据一定的规则进行筛选过滤
    gulpOpen = require('gulp-open'),                        //自动在浏览器打开页面
    print = require("gulp-print"),                          //打印出stream里面的所有文件名
    watchPath = require('gulp-watch-path'),
    plumber = require("gulp-plumber"),                      //一旦pipe中的某一steam报错了，保证下面的steam还继续执行
    inject = require("gulp-inject"),                        //指定需要插入html引用文件的列表
    connect = require("gulp-connect");                      //web服务器

var host = {
    path: "dist",
    port: 3000,
    index: "html/index.html"
};
var filePath = require("./src/config/filePath");

//配置打开的浏览器，mac chrome: "Google chrome"
var browser = os.platform() === "linux" ? "Google chrome" : (
    os.platform() === "darwin" ? "Google chrome" : (
        os.platform() === "win32" ? "chrome" : "firefox"
    )
);
var pkg = require("./package.json"),
    //添加注释信息到自己编辑的文件头部
    info = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' */',
        ''
    ].join('\n');

//拷贝目标文件
gulp.task("copy:files", function () {
    //拷贝字体文件
    gulp.src(filePath.sourcePath.fonts)
        .pipe(gulp.dest(filePath.targetPath.fonts));

    //拷贝图片
    gulp.src(filePath.sourcePath.images)
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]           //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest(filePath.targetPath.images));
});

gulp.task("build:html", function () {
    var options = {
            removeComments: true,                   //清除html注释
            collapseBooleanAttributes: true,        //省略布尔属性值
            collapseWhitespace: true,               //压缩HTML
            preserveLineBreaks: true,               //每行保持一个换行符
            removeEmptyAttributes: true,            //删除所有空格作为属性值
            removeScriptTypeAttributes: true,       //删除script的type属性
            removeStyleTypeAttributes: true,        //删除link的type属性
            minifyJS: true,                         //压缩页面js
            minifyCSS: true                         //压缩页面css
        };
    return gulp.src(filePath.sourcePath.html)
        .pipe(htmlmin(options))
        .pipe(gulp.dest(filePath.targetPath.html))
        .pipe(connect.reload());
});

gulp.task("build:css", function (cb) {
    var cssFilter = filter("src/css/**/*.css", {restore: true});
    return gulp.src([filePath.sourcePath.css, "!src/css/**/less", "!src/css/**/less/*"], {base: "src/css/"})
        .pipe(plumber())
        .pipe(cssFilter)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(cssFilter.restore)
        .pipe(plumber.stop())
        .pipe(gulp.dest(filePath.targetPath.css))
        .pipe(connect.reload());
});

gulp.task("build:js", function () {
    var jsFilter = filter(["src/js/**/*.js", "!src/js/vendors/*"], {restore: true}),
        customerReporter = mapStream(function(file,cb){
            if(!file.jshint.success){
                //打印出错误信息
                console.log("jshint fail in:" + file.path);
                file.jshint.results.forEach(function(err){
                    if(err){
                        console.log("在 "+file.path+" 文件的第"+err.error.line+" 行的第"+err.error.character+" 列发生错误");
                    }
                });
            }
        });
    return gulp.src(filePath.sourcePath.js, {base: "src/js/"})
        .pipe(print())
        .pipe(plumber())
        .pipe(jsFilter)
        /*.pipe(jshint())
        .pipe(customerReporter)*/
        .pipe(jsFilter.restore)
        .pipe(plumber.stop())
        .pipe(gulp.dest(filePath.targetPath.js))
        .pipe(connect.reload());
});

//雪碧图操作，先拷贝图片合并压缩css
gulp.task("sprite", ["copy:files", "build:css"], function (done) {
    var timestamp = +new Date();
    return gulp.src("dist/css/default.min.css")
        .pipe(spriter({
            //生成sprite的位置
            spriteSheet: "dist/images/spritesheet" + timestamp + ".png",
            //修改样式文件引用图片地址路径
            pathToSpriteSheetFromCSS: "../images/spritesheet" +timestamp + ".png",
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(gulp.dest("dist/css"));
});

gulp.task('watch', function () {
    //监听图片文件
    gulp.watch(filePath.sourcePath.images, function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true,
                use: [pngquant()]
            }))
            .pipe(gulp.dest(paths.distDir));
    });
    //监听css文件
    gulp.watch(filePath.sourcePath.css, function (event) {
        var cssFilter = filter("src/css/**/*.css", {restore: true});
        var paths = watchPath(event, 'src/', 'dist/');
        if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
        }else {
            return gulp.src([filePath.sourcePath.css, "!src/css/**/less", "!src/css/**/less/*"], {base: "src/css/"})
                .pipe(plumber())
                .pipe(cssFilter)
                .pipe(less())
                .pipe(autoprefixer({
                    browsers: 'last 2 versions'
                }))
                .pipe(cssFilter.restore)
                .pipe(plumber.stop())
                .pipe(gulp.dest(filePath.targetPath.css))
                .pipe(connect.reload());
        }
    });
    //监听html文件
    gulp.watch(filePath.sourcePath.html, function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        var options = {
            removeComments: true,                   //清除html注释
            collapseBooleanAttributes: true,        //省略布尔属性值
            collapseWhitespace: true,               //压缩HTML
            preserveLineBreaks: true,               //每行保持一个换行符
            removeEmptyAttributes: true,            //删除所有空格作为属性值
            removeScriptTypeAttributes: true,       //删除script的type属性
            removeStyleTypeAttributes: true,        //删除link的type属性
            minifyJS: true,                         //压缩页面js
            minifyCSS: true                         //压缩页面css
        };
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
        }else {
            return gulp.src(paths.srcPath)
                .pipe(htmlmin(options))
                .pipe(gulp.dest(paths.distDir))
                .pipe(connect.reload());
        }
    });
    //监听js文件
    gulp.watch(filePath.sourcePath.js, function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
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
        gutil.log('Dist ' + paths.distPath);
        if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
        }else {
            return gulp.src(paths.srcPath)
                .pipe(gulp.dest(paths.distDir))
                .pipe(connect.reload());
        }
    })
});

gulp.task('connect', function () {
    console.log('connect------------');
    connect.server({
        root: host.path,
        port: host.port,
        index: host.index,
        livereload: true
    });
});

gulp.task('open', function (done) {
    return gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/'
        }));
});

//清除文件
gulp.task('clean', function () {
    return gulp.src(['dist'])
        .pipe(clean())
});

//删除文件
gulp.task('default', ['clean']);

//开发
gulp.task("dev", function(){
    runSequence("copy:files", 'build:html', ['build:css', 'build:js', "watch", 'connect'], 'open');
});
