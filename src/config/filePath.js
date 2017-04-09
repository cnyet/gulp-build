/**
 * Created by Yate on 2017/3/12.
 */
"use strict";
var filePath = {
        baseDir: __dirname,
        source: 'source',
        develop: 'develop',
        production: 'production',
        sourceCss: "src/css/**/*.css",
        sourceJs: "src/js/**/*.js",
        sourcePath: {
            css: 'src/css/**',
            js: 'src/js/**',
            html: 'src/html/**/*.html',
            images: 'src/images/**/*',
            fonts: "src/fonts/**"
        },
        targetPath: {
            css: 'dist/css/',
            js: 'dist/js/',
            html: 'dist/html/',
            images: 'dist/images/',
            fonts: "dist/fonts/"
        }
};

module.exports = filePath;


