//对模块的加载行为进行自定义
require.config({
  paths:{
    "test": "util/test"
  }
});

require(["test"], function(test){
    console.log(test.foo(2, 3));
});

