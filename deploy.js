/**
 * gulp发布版本配置
 * gulp --gulpfile ./gulpfile-deploy.js [default|deploy]
 */
var gulp = require("gulp"),                                 //gulp基础库
    plugins = require('gulp-load-plugins')(),               //自动require你在package.json中声明的依赖
    pngquant = require('imagemin-pngquant'),                //png图片压缩插件
    runSequence = require("run-sequence"),                  //串行依次执行任务
    filePath = require("./src/config/filePath");            //文件路径配置

var pkg = require("./package.json"),
    //添加注释信息到自己编辑的文件头部
    info = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' */',
        ''
    ].join('\n');

//拷贝文件
gulp.task("copy:files", function () {
    //拷贝字体文件
    gulp.src(filePath.sourcePath.fonts)
        .pipe(gulp.dest(filePath.targetPath.fonts));

    //拷贝图片
    gulp.src(filePath.sourcePath.images)
        .pipe(plugins.imagemin({
            progressive: true,
            use: [pngquant()]           //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest(filePath.targetPath.images));
});

//压缩合并css
gulp.task("build:css", function () {
    var cssFilter = plugins.filter(["src/css/**/*.css", "!src/css/components/**"], {restore: true}),
        compFilter = plugins.filter("src/css/components/**/*.{css,less}", {restore: true}),
        cssOptions = {
            keepSpecialComments: 0              //删除所有注释
        };
    return gulp.src(filePath.sourcePath.css)
        .pipe(plugins.plumber())
        .pipe(cssFilter)
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(plugins.concat("style.min.css"))
        .pipe(plugins.cleanCss(cssOptions))
        .pipe(plugins.header(info, {
            pkg: pkg
        }))
        .pipe(cssFilter.restore)
        .pipe(compFilter)
        .pipe(plugins.less())
        .pipe(plugins.concat("common.min.css"))
        .pipe(plugins.cleanCss(cssOptions))
        .pipe(compFilter.restore)
        .pipe(plugins.plumber.stop())
        .pipe(plugins.rev())
        .pipe(gulp.dest(filePath.targetPath.css))
        .pipe(plugins.rev.manifest({
            base: 'src/revision',
            merge: true // merge with the existing manifest (if one exists)
        }));
});

//压缩合并js
gulp.task("build:js", function () {
    var jsFilter = plugins.filter(["src/js/**/*.js", "!src/js/vendors/*"], {restore: true}),
        vendorFilter = plugins.filter(["src/js/vendors/**/*.js"], {restore: true});

    return gulp.src(filePath.sourcePath.js)
        .pipe(plugins.print())
        .pipe(plugins.plumber())
        .pipe(jsFilter)
        .pipe(plugins.concat("custom.min.js"))
        .pipe(plugins.uglify())
        .pipe(plugins.header(info, {
            pkg: pkg
        }))
        .pipe(jsFilter.restore)
        .pipe(vendorFilter)
        .pipe(plugins.concat("lib.min.js"))
        .pipe(plugins.uglify())
        .pipe(vendorFilter.restore)
        .pipe(plumber.stop())
        .pipe(plugins.rev())
        .pipe(gulp.dest(filePath.targetPath.js))
        .pipe(plugins.rev.manifest({
            base: 'src/revision',
            merge: true // merge with the existing manifest (if one exists)
        }));
});
