$(function () {
    var userInfo = JSON.parse(getCookie("userInfo"));
    if (userInfo == null) return;
    commonAjax({
        sendUrl: "/api/index",
        apiType: "get",
        sendData: { UserId: userInfo.UserId },
        successBack: function (data) {
            if (data.code == "success") {
                bindTask(data.resultContent.MyTasks);
                bindApplicationForm(data.resultContent.ApplicationForms);
                bindAlreadyProcessed(data.resultContent.AlreadyProcessed);
                bindInsufficientStock(data.resultContent.InsufficientStock)
                bindExpirationOfServiceLife(data.resultContent.ExpirationOfServiceLife);
                bindAboveAvgQuantity(data.resultContent.AboveAvgQuantity);
                bindMyTaskCount(data.resultContent.MyTaskCount);
                bindApplicationProcess(data.resultContent.ApplicationProcess);
            }
            else {
                layer.msg(data.message, { icon: 5 });
            }
        },
        failBack: function (msg) {
            layer.msg(msg, { icon: 5 });
        }
    });

});
/*--------------绑定我的任务-----------------------------------------zhoushuangquan*/
function bindTask(task) {
    var table = $('#myTasks').DataTable({
        //这样配置后，即可用DT的API来访问表格数据
        processing: false,			//显示正在处理的状态
        deferRender: true,			//延迟渲染数据表格
        searching: false,			//关闭本地搜索
        lengthChange: false,		//关闭设置每页显示的记录数
        autoWidth: false,           //禁止自动列宽的计算 
        ordering: false,			//关闭列排序
        paging: false,
        info: false,
        data: task,
        language: {                 //本地化设置
            url: "../vendors/cn_zh.json"
        },
        columns: [
            { data: "ProcessName", title: "流程名称" },
            { data: "ProcessNO", title: "单号" },
               //{
               //    targets: 0, data: 'ApplicationDateTime', title: "申请时间", render: function (data, type, full, row) {
               //        var dateTime = new Date(full.ApplicationDateTime);
               //        var year = dateTime.getFullYear();       //年
               //        var month = dateTime.getMonth() + 1;     //月
               //        var day = dateTime.getDate(); //日
               //        var clock = year + "-";

               //        if (month < 10)
               //            clock += "0";

               //        clock += month + "-";

               //        if (day < 10)
               //            clock += "0";

               //        clock += day + " ";

               //        return clock;
               //    }
               //},
        {
            data: "ProcessNO", title: "申请状态"

        },
        {
            data: null, title: "操作", render: function (data, type, full, row) {
                var html = ' <i class="pass-icon" onclick="pass()" title="通过"></i> <i class="back-icon" title="打回" onclick="repulse()"></i> ';
                return html;
            }
        }

        ]
    });
}
/*--------------绑定代办事项(count)-----------------------------------------zhoushuangquan*/
function bindMyTaskCount(count) {
    $("#myTaskCount").html(count);
}
/*--------------绑定我的流程-----------------------------------------zhoushuangquan*/
function bindApplicationForm(applicationForm) {
    var table = $('#applicationForms').DataTable({
        //这样配置后，即可用DT的API来访问表格数据
        processing: false,			//显示正在处理的状态
        deferRender: true,			//延迟渲染数据表格
        searching: false,			//关闭本地搜索
        lengthChange: false,		//关闭设置每页显示的记录数
        autoWidth: false,           //禁止自动列宽的计算 
        paging: false,
        info: false,
        language: {                 //本地化设置
            url: "../vendors/cn_zh.json"
        },
        ordering: false,			//关闭列排序
        data: applicationForm,
        columns: [
            { data: "ProcessName", title: "流程名称" },
            { data: "ApplicationNO", title: "单号" },

               {
                   targets: 0, data: 'ApplicationDateTime', title: "申请时间", render: function (data, type, full, row) {
                       var dateTime = new Date(full.ApplicationDateTime);
                       var year = dateTime.getFullYear();       //年
                       var month = dateTime.getMonth() + 1;     //月
                       var day = dateTime.getDate(); //日
                       var clock = year + "-";

                       if (month < 10)
                           clock += "0";

                       clock += month + "-";

                       if (day < 10)
                           clock += "0";

                       clock += day + " ";

                       return clock;
                   }
               },
        { data: "ApprovedState", title: "申请状态" },
        {
            targets: 0, data: "ProcessState", title: "审核状态", render: function (data, type, full, row) {
                return getProcessNO(full.ProcessState);
            }
        }
        ]
    });
}
/*--------------绑定已被处理申请-----------------------------------------zhoushuangquan*/
function bindAlreadyProcessed(alreadyProcessed) {
    $("#alreadyProcessed").html(alreadyProcessed);
}
/*--------------库存不足-----------------------------------------zhoushuangquan*/
function bindInsufficientStock(insufficientStock) {
    $("#insufficientStock").html(insufficientStock);
}
/*--------------使用寿命到期-----------------------------------------zhoushuangquan*/
function bindExpirationOfServiceLife(expirationOfServiceLife) {
    $("#expirationOfServiceLife").html(expirationOfServiceLife);
}
/*--------------超出平均领用数量-----------------------------------------zhoushuangquan*/
function bindAboveAvgQuantity(aboveAvgQuantity) {
    $("#aboveAvgQuantity").html(aboveAvgQuantity);
}
/*--------------物资申请流程-----------------------------------------zhoushuangquan*/
function bindApplicationProcess(applicationProcess) {
    var html = '';
    rightHtml = '            <div class="prs-right">                       ' +
                  '                <div class="prs-right-box">               ' +
                  '                    <span class="prs-spt"></span>         ' +
                  '                </div>                                    ' +
                  '            </div>                                        ';
    for (var i = 0; i < applicationProcess.length; i++) {
        if (i == applicationProcess.length - 1) {
            html += '   <li class="prs-last">' +
                    '    <div class="progress-wrap">                           ' +
                    '        <div  class="progress-box  ">          ';
            rightHtml = '';
        } else {
            html += '   <li>   ' +
                 '    <div class="progress-wrap">                           ' +
                 '        <div  class="progress-box  clearfix">          ';
        }

        html += '          <a onclick="Hui_admin_tab(this)" " data-title="' + applicationProcess[i].MenuName + '" data-href="views/' + applicationProcess[i].Url + '">  <div class="prs-left">                        ' +
                '                <span style=\'background-image: url("../images/' + applicationProcess[i].ControllerName + '")\'  class="bg-icon"></span>             ' +
                '                <div class="prs-title">' + applicationProcess[i].MenuName + '</div>     ' +
                '            </div>     <a/>                                   ' + rightHtml +
                '        </div>                                            ' +
                '    </div>                                                ' +
                '</li>';
    }
    $("#applicationProcess").append(html);
}

function repulse() {
    layer.msg("开发中……", { icon: 1 });
}
function pass() {
    layer.msg("开发中……", { icon: 1 });
}

function getProcessNO(processNo) {

    switch (processNo) {
        case "Draft":
            return "草稿";
        case "Approval":
            return "审批中";
        case "Reject":
            return "打回";
        case "Complete":
            return "已完成";
        case "Cancel":
            return "取消";
        default:
            return "草稿";
    }
}

 