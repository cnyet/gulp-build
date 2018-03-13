//对模块的加载行为进行自定义
require.config({
    //根目录
    baseUrl: "js/lib", 
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

  //filter方法支持旧版本浏览器
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = [];
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++)
      {
        if (i in t)
        {
          var val = t[i];
          if (fun.call(thisArg, val, i, t))
            res.push(val);
        }
      }
      return res;
    };
  }
  
});