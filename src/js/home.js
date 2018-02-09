//对模块的加载行为进行自定义
require.config({
  paths:{
    "common": "util/common",
    "layui": "layui"
  },
  shim: {
    "layui": {
      deps: ["common"]
    } 
  }
});

require(["common", "layui"], function(){
  //调用layui模块
  layui.use(['element', "layer", 'laydate', 'form'], function(){
    layui.laydate.render({
      base: "",
      elem: '.publishDate', //指定元素
      theme: '#c80505'
    })    
  }); 
  console.log("这是home");
});

