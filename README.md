# gulp-build
### 有三个分支：master, gulp-static, gulp-dynamic
- master分支下是空的，包括几个不同打包方式的配置文件
- gulp-static分支是自动化打包多页面的纯静态项目构建配置，
- gulp-dynamic分支是自动化打包带有后台服务的多页面项目构建配置。


***
### 目录结构
```
.
├── bower_components                //bower组件库文件目录
├── dist                            //编译后的文件目录
├── src                             //源文件目录
├── node_modules                    //node模块目录
├── vendors                         //第三方插件和组件文件目录
├── README.md                       //说明文件
├── .gitignore                      //git提交忽略文件集合
├── .bowerrc                        //bower配置文件
├── bower.json                      //bower文件依赖关系说明
├── gulpfile-dev.js                 //gulp开发环境配置文件
├── gulpfile-deploy.js              //gulp发布配置文件
├── gulpfile-test.js                //gulp测试环境配置文件
├── gulpfile.js                     //gulp主要配置文件
├── LICENSE.json                    //license
└── package.json                    //项目依赖关系说明    

```
