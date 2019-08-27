layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        moduleList:{},
        platformList:{}
    }
    var vehicleType = {
        tableObj:null,
        eventFun:{
            addLayer:function(options)
            {
                var action = './alarm_list_user.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'用户信息',
                    content: action,
                    area: ['800px', '300px'],
                    maxmin: true
                });
            },
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    orderId:$('#orderId').val()==''?null:$('#orderId').val(),
                    userId:$('#userId').val()==''?null:$('#userId').val()
                },
                page: {
                    curr: 1
                  }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
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
                url: '/management/v1/passenger/listAlarms',
                method:'post',
                contentType:"application/json",
                page: true,
                request: {
                    pageName: 'pageIndex',
                    limitName: 'pageSize'
                },
                parseData: function(res)
                {
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.content.total, //解析数据长度
                        "data": res.content.list //解析数据列表
                    };
                },
                cols: [[
                    {field: 'userId', title: '用户id',sort: true,templet:function(d){
                        return '<span lay-event="ele_show" style="color:#01AAED;cursor:pointer;">'+d.userId+'</span>'
                    }},
                    {field: 'alarmTime', title: '报警时间', sort: true,templet:function(d){
                        return d.alarmTime?new Date(d.alarmTime).Format('yyyy-MM-dd hh:mm'):""
                    }},
                    {field: 'city', title: '地点', sort: false,templet:function(d){
                        return d.city+d.address
                    }}
                ]],
                toolbar: '#toolbarDemo'
            });
        },
        toolBar:function()
        {
            var _this = this;
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer({
                        'id':obj.data.userId
                    });
                }
            });
        }
    };

    vehicleType.defaultEvent();
    vehicleType.toolBar();
    vehicleType.getData();
});