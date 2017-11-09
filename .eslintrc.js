/**
 * 规则说明：
 * "off" 或 0 - 关闭规则
 * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
 * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
 * "always" (默认)，"never" 禁止
 */
module.exports = {
    "extends": "standard",
    "env": {
      "browser": true
    },
    "rules": {
      "semi": [1, "always"],    //分号结尾
      "quotes": 0,              //禁用必须是单引号
      "eol-last": 0,            //要求或禁止文件末尾保留一行空行
      "space-before-function-paren": 0,     //要求或禁止函数圆括号之前有一个空格
      "space-before-blocks": 0,           //强制在块之前使用一致的空格
      "indent": 0,                  //强制使用一致的缩进
      "keyword-spacing": 0,         //强制在关键字前后使用一致的空格
      "key-spacing": 0,             //强制在对象字面量的属性中键和值之间使用一致的间距
      "no-trailing-spaces": 0,      //禁用行尾空格
      "no-multiple-empty-lines": 0, //禁止出现多行空行
      "spaced-comment": 0,          //强制在注释中 // 或 /* 使用一致的空格
      "space-infix-ops": 0,         //要求操作符周围有空格,
      "padded-blocks": 0,           //要求或禁止块内填充
      "comma-dangle": 0,            //要求或禁止末尾逗号
    },
    "globals":{                     //定义全局变量
      "jQuery": true,
      "$": true,
      "Modernizr": true,
      "require": true,
      "define": true    
    }        
};