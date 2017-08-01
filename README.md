# local-gulp
有三个分支：master, gulp-static, gulp-dynamic
<p>master分支下是空的，</p>
<p>gulp-static分支是纯静态文件的构建配置，</p>
<p>gulp-dynamic分支是带有后台服务的项目构建配置。</p>


###目录结构
<pre>

.
├── config                  //配置文件目录
├── src                     //源文件目录
│     ├── assets            //静态资源目录    
│     │     ├── css         //样式文件
│     │     ├── images      //图片
│     │     └── js          //js文件
│     ├── include           //公共部分模板文件
│     ├── mock              //mock测试数据
│     └── index.html        //首页       
├── README.md               //说明文件
├── .gitignore              //git提交忽略文件集合
├── .bowerrc                //bower配置文件
├── bower.json              //bower文件依赖关系说明
├── gulpfile.js             //gulp配置文件
├── LICENSE.json            //license
└── package.json            //项目依赖关系说明    

</pre>
