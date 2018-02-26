//对模块的加载行为进行自定义
require.config({
  paths:{
    "common": "util/common",
    "bootstrapTable": "bootstrap-table.min",
    "bootstrapTableCN": "bootstrap-table-zh-CN.min",
  },
  shim: {
    "bootstrapTable": {
      deps: ['common']
    },
    "bootstrapTableCN": {
      deps: ['common', 'bootstrapTable']
    } 
  }
});

require(["common"], function(){

});