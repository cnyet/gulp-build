//对模块的加载行为进行自定义
require.config({
  paths:{
    "common": "util/common",
    "holder": "lib/holder.min"  
  }
});

require(["common", "holder"], function(){
  //初始化轮播图
  $('#myCarousel').carousel({
    pause: null
  })
  console.log();
});

