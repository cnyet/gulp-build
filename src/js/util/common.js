//对模块的加载行为进行自定义
require.config({
    baseUrl: "js/lib",     //根目录
    paths:{
      "jquery": "jquery.min",
      "bootstrap": "bootstrap.min",
      "outdatedbrowser": "outdatedbrowser.min",       
      "loader": "mloading"  
    },
    shim: {
      "bootstrap": {
        deps: ['jquery']
      },
      "outdatedbrowser": {
        exports: "outdatedBrowser"
      },
      "loader": {
        deps: ['jquery'],
        exports: "loader"
      }   
    }
});
//定义模块
define(['jquery', "bootstrap", "outdatedbrowser"], function($){
  //检测是否是现代浏览器
  outdatedBrowser({
    lowerThan: 'transform',
    languagePath: '' 
  });

  //判断浏览器对media query的支持
  if(!Modernizr.mq('only all')) {
    $('<script src="/js/lib/respond.min.js"></script>').appendTo("head");
    console.log("Your browser can't support the media query feature");      
  }
  
});