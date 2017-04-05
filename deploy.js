/**
 * gulp发布版本配置
 * gulp --gulpfile ./gulpfile-deploy.js [default|deploy]
 */
var gulp = require("gulp"),                                 //gulp基础库
    plugins = require('gulp-load-plugins')(),               //自动require你在package.json中声明的依赖
    runSequence = require("run-sequence"),                  //串行依次执行任务
    filePath = require("./src/config/filePath");            //文件路径配置

