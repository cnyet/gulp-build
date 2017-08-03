/**
 * gulp发布版本配置
 * gulp --gulpfile ./gulpfile-deploy.js [default|deploy]
 */
var gulp = require("gulp"),                         //gulp基础库
    jshint = require("gulp-jshint"),                //审查javascript
    uglify = require("gulp-uglify"),                //压缩js文件
    stylelish = require("jshint-stylish"),          //js错误信息高亮显示
    csslint = require("gulp-csslint"),              //审查css代码
    less = require("gulp-less"),                    //将less编译成css
    minifycss = require("gulp-minify-css"),         //压缩css(或gulp-clean-css)
    minifyhtml = require("gulp-htmlmin"),           //压缩html文件
    imagemin = require("gulp-imagemin"),            //压缩图片
    header = require("gulp-header"),                //用来在压缩后的JS、CSS文件中添加头部注释
    spritesmith = require("gulp.spritesmith"),      //合并sprite小图片
    concat = require("gulp-concat"),                //文件合并
    rename = require("gulp-rename"),                //文件重命名
    rev = require("gulp-rev"),                      //加MD5版本号生成无缓存文件
    revReplace = require("gulp-rev-replace"),       //重写加了MD5的文件名
    clean = require("gulp-clean"),                  //清除文件
    del = require("del"),                           //文件清理
    revCollector = require("gulp-rev-collector"),   //替换页面引用文件名
    util = require("gulp-util"),                    //提供很多常用函数
    usemin = require("gulp-usemin"),                //替换静态资源里面的公共部分
    useref = require("gulp-useref"),                //合并插入html中的文件
    runSequence = require("run-sequence"),          //串行依次执行任务
    filter = require("gulp-filter"),                //把stream里的文件根据一定的规则进行筛选过滤
    print = require("gulp-print"),                  //打印出stream里面的所有文件名
    gulpif = require("gulp-if"),                    //添加执行任务的条件
    plumber = require("gulp-plumber"),              //一旦pipe中的某一steam报错了，保证下面的steam还继续执行
    flatten = require("gulp-flatten"),              //去掉多个文件的层级最终只得到文件名
    mergeStream = require("merge-stream"),          //将多个stream合成一个返回
    wiredep = require("wiredep").stream,            //将Bower dependencies声明的依赖插入到源文件中(偶尔出现bug)
    inject = require("gulp-inject"),                //指定需要插入html引用文件的列表
    connect = require("gulp-connect");              //web服务器

var pkg = require('./package.json'),
    //过滤文件
    cssFilter = filter("**/components.css", {restore: true}),
    lessFilter = filter("**/default.min.css", {restore: true}),
    vendorFilter = filter("**/vendor.min.js", {restore: true}),
    defaultFilter = filter("**/common.min.js", {restore: true}),
    //添加注释信息到自己编辑的文件头部
    info = ['/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @author <%= pkg.author %>',
            ' * @version v<%= pkg.version %>',
            ' */',
            ''
        ].join('\n');
//强制清除文件夹
gulp.task("clean", function () {
    return gulp.src("dist/")
        .pipe(clean({force: true}));
});
/**文件引用路径的替换思路：将首页的引用文件单独进行合并后，再编译，压缩，添加自定义注释信息，加MD5，生成版本对照map文件，最后输出到制定目录。
 * 对于其他html引用路径，将首页合并后生成的css,js文件插入页面，并删除多余的引用文件
 */
gulp.task("useref", function () {
    var f = filter("**/{*.css,*.js}", {restore: true});
    return gulp.src("src/index.html")
        .pipe(useref())
        .pipe(cssFilter)
        .pipe(minifycss())
        .pipe(cssFilter.restore)
        .pipe(lessFilter)
        .pipe(less())
        .pipe(minifycss())
        .pipe(lessFilter.restore)
        .pipe(vendorFilter)
        .pipe(uglify())
        .pipe(vendorFilter.restore)
        .pipe(defaultFilter)
        .pipe(uglify())
        .pipe(header(info, {pkg: pkg}))
        .pipe(defaultFilter.restore)
        /*.pipe(gulpif("**!/components.css", minifycss()))
        .pipe(gulpif("**!/default.min.css",  less(), minifycss()))
        .pipe(gulpif("**!/common.min.js", uglify(), header(info, { pkg : pkg })))
        .pipe(gulpif("**!/vendor.min.js", uglify()))*/
        .pipe(f)
        .pipe(print())
        .pipe(rev())
        .pipe(f.restore)
        .pipe(revReplace())
        .pipe(gulp.dest("dist/"))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/revision/'));
});
//将css,js插入到除首页以外的其他页面
gulp.task("inject", function () {
    var source = gulp.src(["dist/css/*.css", "dist/js/*.js"], {read: false});
    return gulp.src(["src/*.html", "!src/index.html"])
        .pipe(print())
        .pipe(inject(source))
        .pipe(usemin())
        .pipe(gulp.dest("dist/"));
});

/*gulp.task("wiredep", function () {
    var sources = gulp.src(["./src/assets/css/!*.css", "./src/assets/js/!*.js"], {read: false});
    return gulp.src("src/!*.html")
        .pipe(wiredep({
            //directory: "bower_components",
            //bowerJson: require('bower.json'),
            optional: 'configuration',
            goes: 'here'
        }))
        //.pipe(inject(sources))
        .pipe(gulp.dest("dist/"));
});*/

gulp.task("default", function(){
    runSequence("clean", ["useref"], "inject");
});



