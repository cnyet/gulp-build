/**生产环境打包配置**/
var gulp = require("gulp");
var path = require("path");                                 //
var filter = require("gulp-filter");                        //把stream里的文件根据一定的规则进行筛选过滤
var less = require("gulp-less");                            //将less编译成css
var notify = require('gulp-notify');                        // 打印出用户出错信息
var cleanCss = require("gulp-clean-css");                   //压缩css代码                     
var plumber = require("gulp-plumber");                      //一旦pipe中的某一steam报错了，保证下面的steam还继续执行
var autoprefixer = require('gulp-autoprefixer');            //针对不同浏览器添加样式前缀
var concat = require("gulp-concat");                        //文件合并
var spritesmith = require("gulp.spritesmith");              //合并sprite小图片，生成单独的css和一张大图
var spriter = require("gulp-css-spriter");                  //将sprite图合并生成样式文件
var base64 = require("gulp-css-base64");                    //把小图片的URL替换为Base64编码图片
var gCache = require('gulp-cache');                         //缓存文件
var header = require("gulp-header");                        //用来在压缩后的JS、CSS文件中添加头部注释
var revReplace = require("gulp-rev-replace");               //重写加了MD5的文件名
var usemin = require("gulp-usemin");                        //文件合并到指定的目录，将样式和脚本直接嵌入到页面中，移除部分文件，为文件执行各种任务
var uglify = require("gulp-uglify");                        //压缩js代码
var fileinclude = require("gulp-file-include");             //在html中引入模板文件
var htmlmin = require("gulp-htmlmin");                      //压缩html文件
var inject = require("gulp-inject");                        //指定需要插入html引用文件的列表
var rev = require("gulp-rev");                              //加MD5版本号生成无缓存文件

module.exports = {
  compress: function(){
    var cssFilter = filter(["src/css/**/*.css", "!src/css/ui.css"], {restore: true}),
        compFilter = filter("src/css/ui.css", {restore: true}),
        jsFilter = filter(["src/js/*.js"], {restore: true}),
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
    //配置文件头部标注信息
    var pkg = require(path.resolve(__dirname, '../package.json')),
        info = ['/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @author <%= pkg.author %>',
            ' * @version v<%= pkg.version %>',
            ' */',
            ''
        ].join('\n');
    return gulp.src(["src/css/**/*.css", "!src/css/{ui,less}/**", "src/js/**/*.js", "!src/js/{lib,vendrs}/**"], {base: "src/"})         
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
  },
  manifest: function(){
    var indexFilter = filter("src/index.html", {restore: true}),
        viewsFilter = filter("src/pages/*.html", {restore: true});
    var manifest = gulp.src("src/revision/rev-manifest.json");
    var options = {
            removeComments: true,                   //清除html注释
            collapseBooleanAttributes: true,        //省略布尔属性值
            collapseWhitespace: true,               //压缩HTML
            removeEmptyAttributes: true,            //删除所有空格作为属性值
            removeScriptTypeAttributes: true,       //删除script的type属性
            removeStyleTypeAttributes: true,        //删除link的type属性
            minifyJS: true,                         //压缩页面js
            minifyCSS: true                         //压缩页面css
        };
    return gulp.src("src/**/!(_*).html")    
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
        .pipe(gulp.dest("dist"))
  }
};