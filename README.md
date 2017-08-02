# gulp-static

<p>这是用gulp构建纯静态页面的项目配置目录。</p>
#### 有两个配置文件：
- gulpfile.js 是开发环境和测试环境下用的配置文件，执行命令：gulp dev
- deploy.js是发布项目时用的配置文件，文件经过了合并，压缩，加时间戳等处理,<br>
执行命令：gulp --gulpfile ./gulpfile-deploy.js default

***
###目录结构
<pre>

.
├──── src                               //源文件目录
│     ├──── config                      //配置文件目录
│     ├──── css                         //样式文件    
│     │     ├──── common                //公共样式文件目录
│     │     │     ├──── less            //less文件
│     │     │     └──── common.css      //公共样式文件集合
│     │     ├──── components            //UI样式,插件样式文件目录
│     │     └──── ……                    
│     ├──── js                          //js文件
│     │     ├──── common                //公共js文件目录
│     │     │     └──── common.js       //公共样式文件集合
│     │     ├──── vendors               //js插件库文件目录
│     │     └──── ……                    
│     ├── fonts                         //字体文件目录
│     └── images                        //图片       
├──── README.md               //说明文件
├──── .gitignore              //git提交忽略文件集合
├──── .bowerrc                //bower配置文件
├──── bower.json              //bower文件依赖关系说明
├──── gulpfile.js             //gulp开发环境配置文件
├──── gulpfile.js             //gulp线上环境配置文件
├──── LICENSE.json            //license
└──── package.json            //项目依赖关系说明    

</pre>
