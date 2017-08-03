/**
 * gulp测试版本配置
 * gulp --gulpfile ./gulpfile-test.js [default|deploy]
 */
var gulp = require("gulp"),                     //基础库
    through = require('through2'),              //转化成流文件
    gulpif = require("gulp-if"),                //添加执行任务的条件
    less = require("gulp-less"),                //less编译成css
    minifycss = require("gulp-minify-css"),     //压缩css(或gulp-clean-css)
    csslint = require("gulp-csslint"),          //审查css文件
    uglify = require("gulp-uglify"),            //压缩js
    jshint = require("gulp-jshint"),            //审查js文件
    stylelish = require("jshint-stylish"),      //js错误信息高亮显示
    imagemin = require("gulp-imagemin"),        //压缩图片
    spritesmith = require("gulp.spritesmith"),  //合并sprite小图片
    minifyhtml = require("gulp-htmlmin"),       //压缩html文件
    concat = require("gulp-concat"),            //文件合并
    rename = require("gulp-rename"),            //重命名
    clean = require("gulp-clean"),              //清除文件
    rev = require("gulp-rev"),                  //加版本号生成无缓存文件
    revReplace = require("gulp-rev-replace"),   //重写加了MD5的文件名
    replace = require('gulp-replace'),          //替换字符串
    revCollector = require("gulp-rev-collector"),     //替换文件名
    revAppend = require("gulp-rev-append"),     //给html的(href,src)引用添加版本号
    livereload = require("gulp-livereload"),    //重新加载
    del = require("del"),                       //文件清理
    sync = require("gulp-sync"),                //任务异步处理
    filter = require("gulp-filter"),                //把stream里的文件根据一定的规则进行筛选过滤
    print = require("gulp-print"),                  //打印出stream里面的所有文件名
    runSequence = require("run-sequence"),         //串行执行
    template = require("gulp-template"),           //替换变量以及动态html
    util = require("gulp-util"),                    //打印日志
    usemin = require("gulp-usemin"),             //替换静态资源里面的公共部分
    prefix = require('gulp-prefix'),             //给引用了静态资源的的HTML文件替换引用和加CDN前缀
    reload = require("gulp-livereload"),         //实时刷新
    connect = require("gulp-connect");          //web服务器

var cmd = {
        string: "v",
        default: {v: "1.0"}
    },
    option = {
        src: "poster",
        dest: "poster/build",
        cdn: "http://cdn.code.baidu.com/"
    },
    prefixUrl = "http://mydomain.com/assets";

var pkg = require('./package.json'),
    cssFilter = filter("**/components.css", {restore: true}),
    lessFilter = filter("**/default.min.css", {restore: true}),
    vendorFilter = filter("**/vendor.min.js", {restore: true}),
    defaultFilter = filter("**/common.min.js", {restore: true}),
    info = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');

/**js文件代码校验, 删除注释, 合并, 压缩, MD5**/
gulp.task("minijs", function(){
    util.log("开始优化js代码…");
    gulp.src("src/assets/js/src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(stylelish))
        .pipe(concat("common.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("src/assets/js/min/"))
        .pipe(connect.reload());
    return gulp.src("src/assets/js/vendor/*.js")
        .pipe(concat("vendor.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("src/assets/js/min/"))
        .pipe(connect.reload());
});

/**less编译成css文件, 代码校验, 删除注释, 合并, 压缩, MD5**/
gulp.task("minicss", function(){
    util.log("开始优化css代码…");
    gulp.src("src/assets/css/src/**/*.less")
        .pipe(csslint())
        .pipe(less())
        .pipe(concat("default.min.css"))
        .pipe(minifycss())
        .pipe(gulp.dest("src/assets/css/min/"))
        .pipe(connect.reload());
    return gulp.src("src/assets/css/components/*.css")
        .pipe(concat("components.css"))
        .pipe(minifycss())
        .pipe(gulp.dest("src/assets/css/min/"))
        .pipe(connect.reload());
});

//css,js文件代码校验，编译，合并，压缩，MD5，输出
gulp.task("optimize", function () {
   gulp.src("src/assets/**")
       .pipe(print())
       .pipe(cssFilter)
       .pipe(minifycss())
       .pipe(cssFilter.restore)
});

/**压缩图片**/
gulp.task("miniimg", function(){
   gulp.src("src/images/{*.jpg,*.png,*.gif}")
       .pipe(imagemin({
           optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
           progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
           interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
           multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
       }))
       .pipe(gulp.dest("src/assets/images/min/"))
       .pipe(connect.reload());
});

//合并sprite图片
gulp.task("sprite", function(){
    gulp.src("src/assets/css/sprite/*.png")
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }))
        .pipe(gulp.dest("src/assets/css/sprite/min/"))
        .pipe(connect.reload());
});

//html清除注释,压缩页面js,css,删除空属性
gulp.task("minihtml", function(){
    var options = {
        removeComments: true,                   //清除html注释
        collapseBooleanAttributes: true,        //省略布尔属性值
        collapseWhitespace: false,              //压缩页面
        removeEmptyAttributes: true,            //删除所有空格作为属性值
        removeScriptTypeAttributes: true,       //删除script的type属性
        removeStyleTypeAttributes: true,        //删除link的type属性
        minifyJS: true,                         //压缩页面js
        minifyCSS: true                         //压缩页面css
    };
    util.log("开始优化html代码…");
    return gulp.src("src/**/*.html")
        .pipe(usemin())
        .pipe(minifyhtml(options))
        //.pipe(template({style: "default.min.css", script: "common.min.js"}))
        //.pipe(revAppend())
        //.pipe(gulp.dest("build/views/"))
        .pipe(connect.reload());
});

//静态资源拷贝
gulp.task("copyfile", function(){
    gulp.src(["./bower.json", "./gulpfile.js", "./package.json"])
        .pipe(gulp.dest("build/"));

    gulp.src("src/css/fonts/**")
        .pipe(gulp.dest("build/assets/css/fonts/"));

    return gulp.src("src/views/*.html")
        .pipe(gulp.dest("build/views/"))
        .pipe(connect.reload());
});

//页面替换静态资源命名
gulp.task("rev", ["minihtml"], function(){
    return gulp.src(["src/version/**/*.json", "src/views/*.html"])
        .pipe(revCollector())
        .pipe(gulp.dest("build/views/"));
});

//清除文件
gulp.task("clean", function(cb){
    del(["build/", "src/assets/js/min/**", "src/assets/css/min/**"], cb);
});

gulp.task('templates', function(){
    gulp.src('src/mock/test.txt')
        .pipe(replace(/foo(.{2})/g, '$1foo'))
        .pipe(gulp.dest('build/file'));
});

gulp.task("reload", function () {
    util.log(util.colors.magenta('==>content change'));
    return gulp.src("src/**")
        .pipe(connect.reload());
});

gulp.task("watch", function(){
    gulp.watch(["src/assets/css/src/*.less","src/**/*.html","src/assets/js/src/*.js"], ["reload"]);
});

//定义一个web server
gulp.task("connect", function(){
    connect.server({
        root: "src/",
        name: "dev-app",
        livereload: true,
        port: 8082
    })
});

//执行任务
gulp.task("default", function(){
    runSequence(["clean", "connect", "watch"]);
    //gulp.start("minihtml", "minijs", "minicss");
});