layui.use(['common','form','table', 'layer', 'laydate','dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var laydate = layui.laydate;
    var table = layui.table;
    var form = layui.form;
    var dropDownList ={
        statusList:{}
    }
    var eqpManagement = {
        tableObj:null,
        eventFun:{
            addLayer:function(options,title,action)
            {
                var action = action?action:'./eqp_bind_record.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:title,
                    content: action,
                    area: ['800px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
        },
        getSelectData: function () {
            var _this = this
            //设备状态
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
                'categoryCode': 'DEVICE_STATUS',
            }, function (res) {
                if (res.code == 0) {
                    $.appendSelect('status', res.content, 'value', 'name')
                    form.render('select')
                    res.content.forEach(function (ele) {
                        dropDownList.statusList[ele.value] = ele.name
                    })
                }
            })
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    "deviceType":$('#deviceType').val()==''?null:encodeURI($('#deviceType').val()),
                    "lastLoginAccount":$('#lastLoginAccount').val()==''?null:$('#lastLoginAccount').val(),
                    "operator":$('#operator').val()==''?null:$('#operator').val(),
                    "beginTime":$('#beginTime').val()==''?null:new Date($('#beginTime').val()).getTime(),
                    "endTime":$('#endTime').val()==''?null:new Date($('#endTime').val()).getTime(),
                    "status":$('#status').val()==''?null:$('#status').val(),
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
                url: '/management/v1/account/device/list',
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
                cols: [[
                    {field: 'deviceType', title: '设备型号', sort: true},
                    {field: 'deviceId', title: '设备id', sort: true},
                    {field: 'lastLoginAccount', title: '当前登录账号', sort: true},
                    {field: 'boundNumber', title: '已绑定账号数量', sort: true},
                    // {field: 'lastLoginTime', title: '最近操作时间', sort: false,templet: function(d){
                    //     return d.boundTime?new Date(parseInt(d.boundTime)).Format('yyyy-MM-dd hh:mm'):'';
                    // }},
                    {field: 'lastLoginTime', title: '最近登录时间', sort: false,templet: function(d){
                        return d.lastLoginTime?new Date(parseInt(d.lastLoginTime)*1000).Format('yyyy-MM-dd hh:mm'):'';
                    }},
                    {field: '', title: '操作', width:'215', sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs" lay-event="ele_show"  lay-event="show"><i class="layui-icon">&#xe615;</i>查看</button>' +
                                '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_status" style="width:60px;">'+ (d.block?'解除拉黑':'拉黑')+'</button>';
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
                        'deviceId':obj.data.deviceId,
                    },'绑定记录');
                }
                else if(obj.event =='ele_status')
                {
                    var statusTxt='拉黑'
                    if(obj.data.block){
                        statusTxt='解除拉黑'
                    }
                    _this.eventFun.addLayer({
                        'deviceId':obj.data.deviceId,
                        'type':obj.data.block?'unblock':'block'
                    },statusTxt,'./eqp_operate.html');
                }
            });

            laydate.render({
                trigger: 'click',
                elem: '#beginTime', //指定元素
                type: 'datetime',
                format:'yyyy-MM-dd HH:mm'
            });

            laydate.render({
                trigger: 'click',
                elem: '#endTime', //指定元素
                type: 'datetime',
                format:'yyyy-MM-dd HH:mm'
            });
        }
    };
    eqpManagement.getSelectData();
    eqpManagement.defaultEvent();
    eqpManagement.getData();

    eqpManagement.toolBar();
});