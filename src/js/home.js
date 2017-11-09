//对模块的加载行为进行自定义
require.config({
  paths:{
    "common": "common"
  }
});

require(["common"], function(common){
  console.log("这是home");
});

