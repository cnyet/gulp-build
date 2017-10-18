$(function() {
  initMenu();

});

function loginbox() {
  //登录框
  layer.confirm('  <input class="input-text" type="text" name="UserName" id="UserName" required="true" placeholder="用户名 "><div  style="height:10px"  > </div>' +
    '  <input class="input-text" type="password" id="UserPassword" name="UserPassword" required="true" placeholder="密码 " ><div  style="height:10px"  > </div>', {
      title: '长时间未操作，请重新登录',
      closeBtn: 0, //不显示关闭按钮
      type: 1,
      btn: ['登录', '关闭'] //按钮
    },
    function() {

      if (!$("#UserName").val() || !$("#UserPassword").val()) {
        layer.msg("用户名密码不能为空", {
          icon: 5
        });
        return;
      }
      login(function(data) {
        if (data.code == "success") {
          layer.msg('登录成功', {
            icon: 1
          });
          setCookie("platformtoken", data.resultContent.UserToken, 30);
          setCookie("userInfo", JSON.stringify(data.resultContent), 30);
          location.href = "index.html";
        } else {
          layer.msg(data.message, {
            icon: 5
          });
        }
      }, {
        UserName: "E001",
        UserLoginName: $("#UserName").val(),
        PassWord: $("#UserPassword").val()
      });

    },
    function() {
      location.href = "login.html";
    });
}
/*------------初始化菜单数据---------------author:zhoushuangquan*/
function initMenu() {

  if (!checkCookie("userInfo")) {
    loginbox();
  } else {
    var userInfo = JSON.parse(getCookie("userInfo"));
    $("#userName").html(userInfo.UserLoginName);
    if (userInfo.State.toUpperCase == 'INIT') {
      var insertHtml = $("#editPwd-tpl").html();
      //修改密码弹窗
      layer.open({
        type: 1,
        title: "首次登录请先修改密码",
        area: ['600px', '360px'],
        closeBtn: 0, //不显示关闭按钮
        btn: ['提交'],
        content: insertHtml,
        yes: function(index, layero) {
          ResetPassword();
        },
      });
      return
    }
    commonAjax({
      sendUrl: "/api/menu",
      apiType: "get",
      sendData: {
        UserId: userInfo.UserId
      },
      successBack: function(data) {
        if (data.code == "success") {
          setCookie("leftMenuList", JSON.stringify(data.resultContent), 30);
          $("#iframe_box").find(".show_iframe").append(' <iframe scrolling="yes" frameborder="0"  src="views/home.html"></iframe>');
          bindMenu(data.resultContent);
        } else {
          layer.msg(data.message, {
            icon: 5
          });
        }
      },
      failBack: function(msg) {
        layer.msg(msg, {
          icon: 5
        });
      }
    });
  }

}
/*------------绑定菜单数据-----------------author:zhoushuangquan*/
function bindMenu(menus) {
  if (menus == null || menus.length == 0) {
    layer.msg("暂无权限,请联系管理员添加", {
      icon: 5
    });
    return;
  }


  var arrFirstLevel = [];
  for (var i = 0; i < menus.length; i++) {
    if (menus[i].ParentId == 1)
      arrFirstLevel[arrFirstLevel.length] = menus[i];
  }
  var menuHtml = '';
  for (var i = 0; i < arrFirstLevel.length; i++) {
    if (i == arrFirstLevel.length - 1 && i != 0) {
      menuHtml += '            <li class="menu-last">';
    } else {
      menuHtml += '            <li>';
    }
    menuHtml += ' <dt>' +
      '     <img class="menu-icon" src="images/' + arrFirstLevel[i].Url + '" alt="">' +
      '     <div class="menu-name">' + arrFirstLevel[i].MenuName + '</div> ' +
      ' </dt>                             ' +
      ' <dd class="menu-box">' +
      '     <div class="menu-separate">' +
      '         <i class="menu-arrow"></i>' +
      '     </div>                 ' +
      '     <ul class="menu">       ';
    for (var j = 0; j < menus.length; j++) {
      if (menus[j].ParentId == arrFirstLevel[i].MenuId)
        menuHtml += ' <li><a data-href="views/' + menus[j].Url + '" data-title="' + menus[j].MenuName + '" href="javascript:void(0)">' + menus[j].MenuName + '</a></li>';
    }
    
    menuHtml += '           </ul>' +
      ' </dd>' +
      '</li>';
  }

  $("#ulMenuList").append(menuHtml);
  //计算二级导航的长度
  var parentHtml = "<div>"+menuHtml+"</div>";
  $("#ulMenuList").find(".menu-box").each(function(index, el) {
    var len = $(el).find(".menu").children().length;
    var sta = $(el).parent().hasClass('menu-last');    
    if(len*37 < 136){
      if(sta){
        $(el).find(".menu").css("bottom", parseFloat((136-len*37)/2));  
      }else{
        $(el).find(".menu").css("top", parseFloat((136-len*37)/2));      
      }     
    }
  });
  
}
/*------------绑定我的待办数据-----------------author:zhoushuangquan*/
function bindMyTask(task) {

}
/*------------安全退出---------------------author:zhoushuangquan*/
function logout() {
  clearCookie("platformtoken");
  clearCookie("userInfo");
  clearCookie("leftMenuList");
  layer.msg('安全退出', {
    icon: 1
  });
  location.href = 'login.html';
}
/*------------用户信息---------------------author:zhoushuangquan*/
function myselfinfo() {
  var index = layer.open({
    type: 2,
    area: ['900px', '600px'],
    title: "添加/编辑人员",
    content: "views/addEditMember.html?userId=" + JSON.parse(getCookie("userInfo")).UserId
  });

}