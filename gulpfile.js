/*
* gulp自动化打包配置
* 开发环境执行：gulp dev
* 发布线上环境执行：gulp deploy
*/
var gulp = require("gulp"),                                 //gulp基础库
    os = require('os'),                                     //获取操作系统对象
    jshint = require("gulp-jshint"),                        //审查js代码
    uglify = require("gulp-uglify"),                        //压缩js代码
    stylelish = require("jshint-stylish"),                  //js错误信息高亮显示
    mapStream = require("map-stream"),                      //检查结果的详细的错误信息
    csslint = require("gulp-csslint"),                      //审查css代码
    cleanCss = require("gulp-clean-css"),
    less = require("gulp-less"),                            //将less编译成css
    htmlmin = require("gulp-htmlmin"),                      //压缩html文件
    imagemin = require("gulp-imagemin"),                    //压缩图片
    pngquant = require('imagemin-pngquant'),                //png图片压缩插件
    gCache = require('gulp-cache'),                          //缓存文件
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
    watchPath = require('gulp-watch-path'),                 //监听变化文件的路径信息
    plumber = require("gulp-plumber"),                      //一旦pipe中的某一steam报错了，保证下面的steam还继续执行
    inject = require("gulp-inject"),                        //指定需要插入html引用文件的列表
    connect = require("gulp-connect"),                      //web服务器
    notify = require("gulp-notify"),                        //打印用户错误信息
    httpProxy = require('http-proxy-middleware');           //gulp-connect服务代理

//文件路径配置
var filePath = require("./src/config/filePath");

//配置自动打开浏览器，mac chrome: "Google chrome"
var browser = os.platform() === "linux" ? "Google chrome" : (
    os.platform() === "darwin" ? "Google chrome" : (
        os.platform() === "win32" ? "chrome" : "firefox"
    )
);
//配置文件头部标注信息
var pkg = require("./package.json"),
    info = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' */',
        ''
    ].join('\n');

//拷贝插件和图片文件到目标文件
gulp.task("copy:files", function () {
    //拷贝插件
    gulp.src(filePath.sourcePath.vendors)
        .pipe(gulp.dest(filePath.targetPath.vendors));

    //拷贝图片
    gulp.src(filePath.sourcePath.images)
        .pipe(gCache(imagemin({
            progressive: true,
            use: [pngquant()]           //使用pngquant来压缩png图片
        })))
        .pipe(gulp.dest(filePath.targetPath.images));
});

gulp.task("dev:css", function () {
    var cssFilter = filter(["src/css/**/*.css", "!src/css/components.css"], {restore: true}),
        cssOptions = {
            compatibility: 'ie8',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepSpecialComments: '*', //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀           
            format: "beautify"
        };
    return gulp.src(filePath.sourcePath.css)    
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
        .pipe(gulp.dest(filePath.targetPath.css))
});

gulp.task("dev:js", function () {
    var jsFilter = filter(["src/js/**/*.js", "!src/js/(ui|include|vendrs)/**"], {restore: true}),
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
    return gulp.src(filePath.sourcePath.js)
        .pipe(plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);            
        }}))        
        .pipe(jsFilter)  
        // .pipe(jshint())
        // .pipe(customerReporter)   
        .pipe(jsFilter.restore)              
        .pipe(plumber.stop())
        .pipe(gulp.dest(filePath.targetPath.js))
});

gulp.task("dev:html", function () { 
    var options = {            
            collapseBooleanAttributes: true,        //省略布尔属性值        
            removeEmptyAttributes: true,            //删除所有空格作为属性值
            removeScriptTypeAttributes: true,       //删除script的type属性
            removeStyleTypeAttributes: true,        //删除link的type属性
            minifyJS: true,                         //压缩页面js
            minifyCSS: true                         //压缩页面css
        };
    return gulp.src([filePath.sourcePath.html, "!src/views/include/*.html"])               
        .pipe(fileinclude({                         //在html文件中直接include文件
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(filePath.targetPath.html))
        .pipe(connect.reload());
});

gulp.task("revision", function(){
    var cssFilter = filter(["src/css/**/*.css", "!src/css/components.css"], {restore: true}),
        compFilter = filter("src/css/components.css", {restore: true}),
        jsFilter = filter(["src/js/**/*.js"], {restore: true}),
        cssOptions = {
            compatibility: 'ie8',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepSpecialComments: '*', //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀           
            level: {
                1: {
                  specialComments: ""
                }
            }
        },
        timestamp = +new Date();
    return gulp.src([filePath.sourcePath.css, filePath.sourcePath.js], {base: "src/"})         
        .pipe(cssFilter)  
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true
        }))
        .pipe(concat("css/style.css"))
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
        .pipe(cleanCss(cssOptions))
        .pipe(header(info, {
            pkg: pkg
        }))
        .pipe(cssFilter.restore) 
        .pipe(compFilter)
        .pipe(cleanCss(cssOptions))
        .pipe(header(info, {
            pkg: pkg
        }))
        .pipe(compFilter.restore)
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(header(info, {
            pkg: pkg
        }))  
        .pipe(jsFilter.restore)           
        .pipe(rev())
        .pipe(gulp.dest("dist/"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("src/revision/"));
});

gulp.task("format", function () { 
    var indexFilter = filter("src/index.html", {restore: true}),
        viewsFilter = filter("src/views/*.html", {restore: true});
    var manifest = gulp.src("src/revision/rev-manifest.json");
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
        .pipe(fileinclude({                         //在html文件中直接include文件
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(indexFilter)        
        .pipe(inject(gulp.src('dist/css/style*.css', {read: false}), 
            {ignorePath:"dist", addRootSlash: false, starttag: '<!-- inject:style:{{ext}} -->'}))
        .pipe(indexFilter.restore)
        .pipe(viewsFilter)
        .pipe(inject(gulp.src('dist/css/style*.css', {read: false}), 
            {ignorePath:"dist", addRootSlash: false, addPrefix: "..", starttag: '<!-- inject:style:{{ext}} -->'}))
        .pipe(viewsFilter.restore)        
        .pipe(revReplace({manifest: manifest}))            
        .pipe(usemin())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(filePath.targetPath.html))
});

gulp.task('watch', function () {
    //监听图片文件
    gulp.watch(filePath.sourcePath.images, function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log(gutil.colors.blue("build")+ " " + paths.distPath);

        if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
        }else{
            gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true,
                use: [pngquant()]
            }))
            .pipe(gulp.dest(paths.distDir))
            .pipe(connect.reload());
        }
    });

    //监听css文件
    gulp.watch("src/css/**/*.{css,less}", function (event) {        
        var paths = watchPath(event, 'src/', 'dist/'),
            cssFilter = filter(["src/css/**/*.{css,less}", "!src/css/components.css"], {restore: true});
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log(gutil.colors.blue("build")+ " " + paths.distPath);
        if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
        }else {          
            return gulp.src("src/css/**/*.css")                
                .pipe(plumber({ errorHandler: function(err) {
                    notify.onError({
                        title: "Gulp error in " + err.plugin,
                        message:  err.toString()
                    })(err);            
                }}))  
                .pipe(cssFilter)  
                .pipe(less())
                .pipe(autoprefixer({
                    browsers: 'last 2 versions',
                    cascade: true
                }))        
                .pipe(cssFilter.restore)        
                .pipe(plumber.stop())
                .pipe(gulp.dest(filePath.targetPath.css))
                .pipe(connect.reload());
        }
    });
    //监听html文件
    gulp.watch(["src/views/**/*.html", "src/index.html"], function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log(gutil.colors.blue("build")+ " " + paths.distPath);

        if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
        }else {
            return gulp.src(paths.srcPath)
                .pipe(htmlmin({
                    removeComments: true
                }))
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
        gutil.log(gutil.colors.blue("build")+ " " + paths.distPath);
        if(event.type == "deleted"){
            return gulp.src(paths.distPath)
                .pipe(clean());
        }else {
            return gulp.src(paths.srcPath)
                .pipe(plumber({ errorHandler: function(err) {
                    notify.onError({
                        title: "Gulp error in " + err.plugin,
                        message:  err.toString()
                    })(err);            
                }})) 
                .pipe(plumber.stop())
                .pipe(gulp.dest(paths.distDir))
                .pipe(connect.reload());
        }
    })
});

gulp.task('connect', function () {
    var host = {
        path: "dist/",
        port: 8085,
        index: "index.html"
    };
    console.log('server connect----------------------------------');
    connect.server({
        root: host.path,
        port: host.port,
        index: host.index,
        livereload: true,
        middleware: function (connect, opt) {                      
            return [
                httpProxy('/proxy',  {
                    target: 'http://localhost:80',
                    changeOrigin:true
                })
            ]                
        }
    });
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
gulp.task("deploy", function(){
    runSequence("clean", "copy:files", "revision", "format");
});