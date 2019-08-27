layui.use(['common','form','table', 'layer', 'laydate','dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var laydate = layui.laydate;
    var table = layui.table;
    var form = layui.form;
    var taskManagement = {
        tableObj:null,
        eventFun:{
            addLayer:function(action,options,titleName)
            {
                if(options)
                    {
                        action = $.addUrlPro(action,options);
                    }
                layer.open({
                    type: 2,
                    title:titleName||'任务',
                    content: action,
                    area: ['900px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            deleteData:function(data,index)
            {
                // var carBrandId = '';
                // $(data.data).each(function(){
                //     carBrandId += this.carBrandId+'|';
                // });
                // carBrandId = carBrandId.slice(0,carBrandId.length-1);
                $.postApi('/management/v1/cron/del',{
                    'id':data.id
                },function(res){
                    if(res.message){
                        layer.msg(res.message)
                        taskManagement.searchEvent();
                    }
                });
            },
            delete:function(data)
            {
                var _this = this;
                // if(data.data.length == 0)
                // {
                //     layer.msg('请至少选择一条数据');
                // }
                // else{
                    layer.confirm('确认删除？',
                        {
                            btn: ['确认', '取消']
                        },
                        function(index, layero)
                        {
                            _this.deleteData(data,index);
                        },
                        function(index){

                        }
                    );
                // }
            },
            restart:function(data)
            {
                $.postApi('/management/v1/cron/restart',{
                    'id':Number(data.id)
                },function(res){
                    if(res.code == 0){
                    layer.msg('任务重启成功');
                    taskManagement.searchEvent();
                }
                });
            },
            unschedule:function(data)
            {
                $.postApi('/management/v1/cron/unschedule',{
                    'id':Number(data.id)
                },function(res){
                    if(res.code == 0){
                    layer.msg('任务暂停成功');
                    taskManagement.searchEvent();
                }
                });
            }
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    // "deviceType":$('#deviceType').val()==''?null:$('#carNumber').val(),
                    // "deviceType":$('#deviceType').val()==''?null:$('#deviceType').val(),
                    // "lastLoginAccount":$('#lastLoginAccount').val()==''?null:$('#lastLoginAccount').val(),
                    // "operator":$('#operator').val()==''?null:$('#operator').val(),
                    // "beginTime":$('#beginTime').val()==''?null:$('#beginTime').val(),
                    // "endTime":$('#endTime').val()==''?null:$('#endTime').val(),
                    // "status":$('#status').val()==''?null:$('#status').val(),
                },
                page: {
                    curr: 1
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsVehicleBrandAdd').click(function(){
                _this.eventFun.addLayer();
            });
            $('#searchBt').click(function(){
                _this.searchEvent();
            });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/cron/list',
                method:'post',
                contentType:"application/json",
                page: true,
                request: {
                    pageName: 'pageIndex',
                    limitName: 'pageSize'
                },
                parseData: function(res){
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.content.total, //解析数据长度
                        "data": res.content.data //解析数据列表
                    };
                },
                // data:[{
                //     'deviceId':'123',
                //     'deviceType':'123',
                //     'lastLoginAccount':'123',
                //     'boundNumber':'123',
                //     'lastLoginTime':'123',
                //     'boundNumber':'123',
                //     'status':1, //假设 1为拉黑，2为解除拉黑
                // },{
                //     'deviceId':'123',
                //     'deviceType':'123',
                //     'lastLoginAccount':'123',
                //     'boundNumber':'123',
                //     'lastLoginTime':'123',
                //     'boundNumber':'123',
                //     'status':2, //假设 1为拉黑，2为解除拉黑
                // }],
                cols: [[
                    {field: 'id', title: '任务ID',sort: false},
                    {field: 'jobClassName', title: '任务全类名',sort: false},
                    {field: 'jobTriggerUrl', title: '任务触发URL',sort: false},
                    {field: 'cronExpression', title: 'cron表达式', sort: false},
                    {field: 'triggerStateDesc', title: '状态', sort: false,templet:function(d){
                        return d.triggerStateDesc?d.triggerStateDesc:""
                    }},
                    {field: 'description', title: '任务描述', sort: false},
                    {field: 'updateTime', title: '处理时间', sort: false,templet:function(d){
                        return d.updateTime?new Date(d.updateTime).Format('yyyy-MM-dd hh:mm:ss'):""
                    }},
                    {field: '', title: '操作', width:'240', sort: false,templet: function(d){
                        return '<button class="layui-btn layui-btn-xs"  lay-event="ele_restart"><i class="layui-icon">&#xe669;</i>重启</button>' +
                        '<button class="layui-btn layui-btn-xs"  lay-event="ele_unschedule"><i class="layui-icon">&#x1006;</i>暂停</button>'+
                        // '<button class="layui-btn layui-btn-xs"  lay-event="ele_update"><i class="layui-icon">&#xe615;</i>修改</button>'+
                            '<button class="layui-btn layui-btn-xs jsupdate layui-btn-danger"  lay-event="ele_delete"><i class="layui-icon">&#xe640;</i>删除</button>';
                    }}
                ]],
                toolbar: '#toolbarDemo'
            });
        },
        toolBar:function()
        {
            var _this = this;
            table.on('toolbar(test)', function(obj){
                switch(obj.event)
                {
                    case 'add':
                    _this.eventFun.addLayer('./dispatcher_task_add.html');
                    break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_update')
                {
                    console.log(obj.data)
                    _this.eventFun.addLayer('./dispatcher_task_add.html',{
                        'id':obj.data.id,
                        'jobClassName':obj.data.jobClassName,
                        'jobTriggerUrl':obj.data.jobTriggerUrl,
                        'cronExpression':obj.data.cronExpression,
                        'description':obj.data.description,
                    },'修改任务');
                }
                else if(obj.event =='ele_restart')
                {
                    _this.eventFun.restart(obj.data);
                    layer.close(index);
                }
                else if(obj.event =='ele_unschedule')
                {
                    _this.eventFun.unschedule(obj.data);
                    layer.close(index);
                }
                else if(obj.event =='ele_delete')
                {
                    _this.eventFun.delete(obj.data);
                    layer.close(index);
                }
            });

            laydate.render({
                trigger: 'click',
                elem: '#beginTime' //指定元素
            });

            laydate.render({
                trigger: 'click',
                elem: '#endTime' //指定元素
            });
        }
    };

    taskManagement.defaultEvent();
    taskManagement.getData();
    taskManagement.toolBar();
});