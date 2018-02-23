//对模块的加载行为进行自定义
require.config({
  paths:{
    "common": "util/common",
    "bootstrapTable": "bootstrap-table.min",
    "bootstrapTableCN": "bootstrap-table-zh-CN.min",
    "layui": "layui"
  },
  shim: {
    "bootstrapTable": {
      deps: ['common']
    },
    "bootstrapTableCN": {
      deps: ['common', 'bootstrapTable']
    },
    "layui": {
      deps: ["common"]
    }  
  }
});

require(["common", "bootstrapTable", "bootstrapTableCN", "layui"], function(){
  //在onload()之后执行
  
  //调用layui模块
  layui.use(['element', "layer", 'laydate', 'form'], function(){
    var laydate = layui.laydate;
    //开始时间
    var start = laydate.render({
      elem: '#startDate', //指定元素
      theme: '#238681',
      min: "1900-1-1",
      max: '2099-12-31',
      done: function(value, date){    
        //开始日选好后，重置结束日的最小日期，将结束日的初始值设定为开始日 
        end.config.min = {
          year: date.year,
          month: date.month - 1,
          date: date.date,
          hours: date.hours,
          minutes: date.minutes,
          seconds: date.seconds
        }; 
      }  
    });
    //结束时间
    var end = laydate.render({
      elem: '#endDate', //指定元素
      theme: '#238681',
      min: "1900-1-1",
      max: '2099-12-31',
      done: function(value, date){  
        //结束日选好后，重置开始日的最大日期  
        start.config.max = {
          year: date.year,
          month: date.month - 1,
          date: date.date,
          hours: date.hours,
          minutes: date.minutes,
          seconds: date.seconds
        }; 
      }  
    });   
  }); 
  
});