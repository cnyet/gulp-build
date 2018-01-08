require.config({
  paths:{
    "common": "util/common"
  }
});
define(["common"], function(common){
  function foo(x, y){
    console.log("这是test");
    return common.add(x, y)*2
  }
  return{
    foo: foo
  }
})