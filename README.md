# Gulp自动化构建项目
> 这是一个自动化构建项目的脚手架，包含常用的ui组件和常用插件，卡快速开发PC端前
> 台和后台的项目。提供实时修改渲染和http访问。
> 

### 前端技术架构：
 - UI: bootstrap + bootstrap-table 
 - JS: jquery + require.js
 - plug-in: layui
 - CSS: less
 - Build: gulp
 
### 执行命令：
 - gulp dev : 开发环境下编译
 - gulp build : 生产环境下编译  

### 目录结构
```
.
├──── config                            //配置文件目录
├──── src                               //源文件目录
│     ├──── css                         //样式文件    
│     │     ├──── fonts                 //字体文件目录
│     │     ├──── less                  //字体文件目录
│     │     │     ├──── common.less     //公共的样式文件
│     │     │     ├──── reset.less      //重置的样式文件
│     │     │     └──── variable.css    //定义公共变量的样式文件
│     │     ├──── ui                    //ui组件目录
│     │     │     ├──── bootstrap.css   //bootstrap样式文件
│     │     │     └──── ……     
│     │     ├──── main.css              //主要的公共样式文件
│     │     ├──── ui.css                //组件样式css文件
│     │     ├──── index.css             //首页样式css文件
│     │     └──── ……                    
│     ├──── js                          //js文件
│     │     ├──── lib                   //js类库和插件目录
│     │     │     ├──── jquery.js       //jquery文件
│     │     │     └──── ……     
│     │     ├──── common.js             //公共js文件
│     │     ├──── index.js              //首页js文件目录
│     │     └──── ……                    
│     ├── images                        //图片文件目录
│     ├── index.html                    //首页页面
│     └── pages                         //html页面文件目录 
│           ├──── include               //页面需要引入的公共部分目录
│           ├──── _layout.html          //页面模板文件目录
│           └──── ……                          
├──── README.md                         //说明文件
├──── .gitignore                        //git提交忽略文件集合
├──── .eslintrc.js                      //eslint审查js配置文件
├──── .eslintignore                     //eslint忽略的js配置文件
├──── bower.json                        //bower文件依赖关系说明
├──── gulpfile.js                       //gulp配置文件
├──── LICENSE.json                      //license
├──── tasklist.todo                     //任务列表
└──── package.json                      //项目依赖关系说明    

```
