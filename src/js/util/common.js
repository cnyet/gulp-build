//对模块的加载行为进行自定义
require.config({
    baseUrl: "js/lib",     //根目录
    paths:{
      "jquery": "jquery.min",
      "bootstrap": "bootstrap.min"
    },
    shim: {
      bootstrap: {
        deps: ['jquery']
      },
    }
});
//定义模块
define(['jquery', "bootstrap"], function($){
  //判断浏览器对media query的支持
  if(!Modernizr.mq('only all')) {
    $('<script src="/js/lib/respond.min.js"></script>').appendTo("head");
    console.log("Your browser can't support the media query feature");      
  }
  var add = function(x, y){
      console.log("这是common");
      return x+y;
  };
  return {
      add: add
  }
  
});