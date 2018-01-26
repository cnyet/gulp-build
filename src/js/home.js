//对模块的加载行为进行自定义
require.config({
  paths:{
    "common": "util/common"
  }
});

require(["common"], function(){
  console.log("这是home");
});

