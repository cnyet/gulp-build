//对模块的加载行为进行自定义
require.config({
  paths:{
    "common": "util/common",
    "bootstrapTreeview": "bootstrap-treeview.min",
  },
  shim: {
    "bootstrapTreeview": {
      deps: ['common']
    }, 
  }
});

require(["common", "bootstrapTreeview"], function(){

  var defaultData = [{
      text: "parent 1",  
      selectable: false,
      state: {
        expanded: true
      },
      nodes: [
        {
          text: "child 1",  
          href: "#",        
          state: {
            selected: true            
          },     
        }, {
          text: "child 2",
          href: "#",
        }, {
          text: "child 3",
          href: "#",
        }
      ]      
    }, {
      text: "parent 2",
      selectable: false,
      state: {
        expanded: false
      },
      nodes: [
        {
          text: "child 1",
          href: "#",
        }, {
          text: "child 2",
          href: "#",
        }, {
          text: "child 3",
          href: "#",
        }
      ]
    }, {
      text: "parent 3",
      selectable: false,
      state: {
        expanded: false
      },
      nodes: [
        {
          text: "child 1",
          href: "#",
        }, {
          text: "child 2",
          href: "#",
        }, {
          text: "child 3",
          href: "#",
        }
      ]
    }];


  //初始化三级导航
  $('#tree').treeview({
    expandIcon: "fa fa-plus-square-o",
    collapseIcon: "fa fa-minus-square-o",
    backColor: "transparent",
    showBorder: false,
    enableLinks: true,
    selectedColor: "#333333",
    selectedBackColor: "#e8ebf0",
    onhoverColor: "#f1f1f1",
    data: defaultData,
    onNodeSelected:  function(event, node){      
      var parentNode = $('#tree').treeview('getParent', node);
      console.log(node, parentNode);
    }
  });

  console.log("这是home");
});

