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
        targetCss: "dist/css/*.css",
        targetJs: "dist/js/*.js",
        sourcePath: {
            css: 'src/css/**/*.css',            
            js: 'src/js/**/*.js',
            html: 'src/**/!(_*).html',
            images: 'src/images/**/*.{png,jpg,gif,ico}',
            fonts: "src/css/ui/fonts/**",
            vendors: "vendors/**"
        },
        targetPath: {
            css: 'dist/css/',
            js: 'dist/js/',
            html: 'dist/',
            images: 'dist/images/',
            fonts: "dist/fonts/",
            vendors: "dist/vendors/"
        }
};

module.exports = filePath;